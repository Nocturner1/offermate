import express    from 'express'
import cors       from 'cors'
import pg         from 'pg'
import { fileURLToPath } from 'url'
import { dirname, join }  from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app       = express()
const PORT      = process.env.PORT || 3000
const DIST      = join(__dirname, 'dist')
const isProd    = existsSync(DIST)

// ─── PostgreSQL setup ──────────────────────────────────────────────────────
const { Pool } = pg

if (!process.env.DATABASE_URL) {
  console.warn('[DB] Warnung: DATABASE_URL nicht gesetzt. Datenbankverbindung wird fehlschlagen.')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on('error', (err) => {
  console.error('[DB] Unerwarteter Pool-Fehler:', err.message)
})

async function initDB() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id             TEXT PRIMARY KEY,
        created_at     TEXT NOT NULL,
        updated_at     TEXT NOT NULL,
        status         TEXT NOT NULL DEFAULT 'new',
        customer_name  TEXT,
        email          TEXT,
        company        TEXT,
        event_title    TEXT,
        event_date     TEXT,
        event_end_date TEXT,
        number_of_days INTEGER,
        pax            INTEGER,
        language       TEXT,
        hotel_id       TEXT,
        hotel_name     TEXT,
        total_amount   REAL,
        offer_json     TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS availability (
        hotel_id  TEXT NOT NULL,
        date      TEXT NOT NULL,
        room_id   TEXT NOT NULL,
        status    TEXT NOT NULL DEFAULT 'free',
        PRIMARY KEY (hotel_id, date, room_id)
      );

      CREATE TABLE IF NOT EXISTS settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `)
    console.log('[DB] Tabellen bereit.')
  } finally {
    client.release()
  }
}

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json({ limit: '10mb' }))

// ─── Config endpoint ──────────────────────────────────────────────────────
app.get('/api/config', (_req, res) => {
  res.json({ hasServerKey: !!process.env.ANTHROPIC_API_KEY })
})

// ─── Health / DB check ────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, db: 'connected' })
  } catch (err) {
    console.error('[DB] Health-Check fehlgeschlagen:', err.message)
    res.status(503).json({ ok: false, db: 'unavailable', error: err.message })
  }
})

// ─── Anthropic proxy ──────────────────────────────────────────────────────
app.post('/api/anthropic', async (req, res) => {
  const rawKey = process.env.ANTHROPIC_API_KEY || req.headers['x-api-key'] || ''
  const apiKey = rawKey.trim()

  console.log(`[API] key present=${!!apiKey} len=${apiKey.length} prefix="${apiKey.slice(0, 10)}"`)

  if (!apiKey) {
    return res.status(400).json({
      error: { message: 'Kein API-Key konfiguriert. Bitte ANTHROPIC_API_KEY als Umgebungsvariable setzen oder in den Einstellungen eintragen.' },
    })
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })

    const data = await upstream.json()
    console.log(`[API] Anthropic status=${upstream.status} error=${data?.error?.type ?? 'none'}`)
    res.status(upstream.status).json(data)
  } catch (err) {
    console.error(`[API] Proxy-Fehler: ${err.message}`)
    res.status(502).json({ error: { message: `Proxy-Fehler: ${err.message}` } })
  }
})

// ─── Inquiries ────────────────────────────────────────────────────────────
app.get('/api/anfragen', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC')
    const inquiries = rows.map(r => ({
      id:            r.id,
      createdAt:     r.created_at,
      updatedAt:     r.updated_at,
      status:        r.status,
      customerName:  r.customer_name,
      email:         r.email,
      company:       r.company,
      eventTitle:    r.event_title,
      eventDate:     r.event_date,
      eventEndDate:  r.event_end_date,
      numberOfDays:  r.number_of_days,
      pax:           r.pax,
      language:      r.language,
      hotelId:       r.hotel_id,
      hotelName:     r.hotel_name,
      totalAmount:   r.total_amount,
      offer:         JSON.parse(r.offer_json),
    }))
    res.json(inquiries)
  } catch (err) {
    console.error('[DB] GET /api/anfragen:', err.message)
    res.status(500).json({ error: err.message })
  }
})

function inquiryToRow(inq) {
  return {
    id:             inq.id,
    created_at:     inq.createdAt,
    updated_at:     inq.updatedAt,
    status:         inq.status,
    customer_name:  inq.customerName ?? null,
    email:          inq.email ?? null,
    company:        inq.company ?? null,
    event_title:    inq.eventTitle ?? null,
    event_date:     inq.eventDate ?? null,
    event_end_date: inq.eventEndDate ?? null,
    number_of_days: inq.numberOfDays ?? null,
    pax:            inq.pax ?? null,
    language:       inq.language ?? null,
    hotel_id:       inq.hotelId ?? null,
    hotel_name:     inq.hotelName ?? null,
    total_amount:   inq.totalAmount ?? null,
    offer_json:     JSON.stringify(inq.offer ?? {}),
  }
}

async function upsertInquiry(row) {
  await pool.query(`
    INSERT INTO inquiries
      (id, created_at, updated_at, status, customer_name, email, company,
       event_title, event_date, event_end_date, number_of_days, pax,
       language, hotel_id, hotel_name, total_amount, offer_json)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    ON CONFLICT (id) DO UPDATE SET
      updated_at     = EXCLUDED.updated_at,
      status         = EXCLUDED.status,
      customer_name  = EXCLUDED.customer_name,
      email          = EXCLUDED.email,
      company        = EXCLUDED.company,
      event_title    = EXCLUDED.event_title,
      event_date     = EXCLUDED.event_date,
      event_end_date = EXCLUDED.event_end_date,
      number_of_days = EXCLUDED.number_of_days,
      pax            = EXCLUDED.pax,
      language       = EXCLUDED.language,
      hotel_id       = EXCLUDED.hotel_id,
      hotel_name     = EXCLUDED.hotel_name,
      total_amount   = EXCLUDED.total_amount,
      offer_json     = EXCLUDED.offer_json
  `, [
    row.id, row.created_at, row.updated_at, row.status,
    row.customer_name, row.email, row.company,
    row.event_title, row.event_date, row.event_end_date,
    row.number_of_days, row.pax, row.language,
    row.hotel_id, row.hotel_name, row.total_amount, row.offer_json,
  ])
}

app.post('/api/anfragen', async (req, res) => {
  try {
    await upsertInquiry(inquiryToRow(req.body))
    res.json({ ok: true })
  } catch (err) {
    console.error('[DB] POST /api/anfragen:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/anfragen/:id', async (req, res) => {
  try {
    await upsertInquiry(inquiryToRow({ ...req.body, id: req.params.id }))
    res.json({ ok: true })
  } catch (err) {
    console.error('[DB] PUT /api/anfragen:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/anfragen/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM inquiries WHERE id = $1', [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    console.error('[DB] DELETE /api/anfragen:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── Availability ─────────────────────────────────────────────────────────
// Storage format: { hotelId: { "YYYY-MM-DD": { roomId: status } } }
// We flatten to rows and re-nest on read.

app.get('/api/kalender', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM availability')
    const result = {}
    for (const r of rows) {
      if (!result[r.hotel_id]) result[r.hotel_id] = {}
      if (!result[r.hotel_id][r.date]) result[r.hotel_id][r.date] = {}
      result[r.hotel_id][r.date][r.room_id] = r.status
    }
    res.json(result)
  } catch (err) {
    console.error('[DB] GET /api/kalender:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/kalender', async (req, res) => {
  const { hotelId, date, roomId, status } = req.body
  try {
    if (status === 'free') {
      await pool.query(
        'DELETE FROM availability WHERE hotel_id=$1 AND date=$2 AND room_id=$3',
        [hotelId, date, roomId]
      )
    } else {
      await pool.query(`
        INSERT INTO availability (hotel_id, date, room_id, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (hotel_id, date, room_id) DO UPDATE SET status = EXCLUDED.status
      `, [hotelId, date, roomId, status])
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('[DB] POST /api/kalender:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── Settings (hotels config) ─────────────────────────────────────────────
app.get('/api/settings/:key', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT value FROM settings WHERE key=$1', [req.params.key])
    if (!rows.length) return res.status(404).json({ error: 'not found' })
    res.json({ value: JSON.parse(rows[0].value) })
  } catch (err) {
    console.error('[DB] GET /api/settings:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/settings/:key', async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO settings (key, value) VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `, [req.params.key, JSON.stringify(req.body.value)])
    res.json({ ok: true })
  } catch (err) {
    console.error('[DB] PUT /api/settings:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── Serve built frontend in production ───────────────────────────────────
if (isProd) {
  app.use(express.static(DIST))
  app.get('*', (_req, res) => res.sendFile(join(DIST, 'index.html')))
}

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () =>
  console.log(`OfferMate läuft auf Port ${PORT} ${isProd ? '(production)' : '(dev proxy)'}`)
)

initDB()
  .then(() => console.log('[DB] Initialisierung erfolgreich.'))
  .catch(err => console.error('[DB] Initialisierung fehlgeschlagen (Server läuft weiter):', err.message))
