import express    from 'express'
import cors       from 'cors'
import Database   from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join }  from 'path'
import { existsSync, mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app       = express()
const PORT      = process.env.PORT || 3001
const DIST      = join(__dirname, 'dist')
const isProd    = existsSync(DIST)

// ─── SQLite setup ─────────────────────────────────────────────────────────
const DATA_DIR = join(__dirname, 'data')
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR)

const db = new Database(join(DATA_DIR, 'offermate.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id            TEXT PRIMARY KEY,
    created_at    TEXT NOT NULL,
    updated_at    TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'new',
    customer_name TEXT,
    email         TEXT,
    company       TEXT,
    event_title   TEXT,
    event_date    TEXT,
    event_end_date TEXT,
    number_of_days INTEGER,
    pax           INTEGER,
    language      TEXT,
    hotel_id      TEXT,
    hotel_name    TEXT,
    total_amount  REAL,
    offer_json    TEXT NOT NULL
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

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json({ limit: '4mb' }))

// ─── Config endpoint ──────────────────────────────────────────────────────
app.get('/api/config', (_req, res) => {
  res.json({ hasServerKey: !!process.env.ANTHROPIC_API_KEY })
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
app.get('/api/anfragen', (_req, res) => {
  const rows = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all()
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
})

const upsertInquiry = db.prepare(`
  INSERT INTO inquiries
    (id, created_at, updated_at, status, customer_name, email, company,
     event_title, event_date, event_end_date, number_of_days, pax,
     language, hotel_id, hotel_name, total_amount, offer_json)
  VALUES
    (@id, @created_at, @updated_at, @status, @customer_name, @email, @company,
     @event_title, @event_date, @event_end_date, @number_of_days, @pax,
     @language, @hotel_id, @hotel_name, @total_amount, @offer_json)
  ON CONFLICT(id) DO UPDATE SET
    updated_at     = excluded.updated_at,
    status         = excluded.status,
    customer_name  = excluded.customer_name,
    email          = excluded.email,
    company        = excluded.company,
    event_title    = excluded.event_title,
    event_date     = excluded.event_date,
    event_end_date = excluded.event_end_date,
    number_of_days = excluded.number_of_days,
    pax            = excluded.pax,
    language       = excluded.language,
    hotel_id       = excluded.hotel_id,
    hotel_name     = excluded.hotel_name,
    total_amount   = excluded.total_amount,
    offer_json     = excluded.offer_json
`)

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

app.post('/api/anfragen', (req, res) => {
  try {
    upsertInquiry.run(inquiryToRow(req.body))
    res.json({ ok: true })
  } catch (err) {
    console.error('[DB] POST /api/anfragen:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/anfragen/:id', (req, res) => {
  try {
    upsertInquiry.run(inquiryToRow({ ...req.body, id: req.params.id }))
    res.json({ ok: true })
  } catch (err) {
    console.error('[DB] PUT /api/anfragen:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/anfragen/:id', (req, res) => {
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ─── Availability ─────────────────────────────────────────────────────────
// Storage format: { hotelId: { "YYYY-MM-DD": { roomId: status } } }
// We flatten to rows and re-nest on read.

app.get('/api/kalender', (_req, res) => {
  const rows = db.prepare('SELECT * FROM availability').all()
  const result = {}
  for (const r of rows) {
    if (!result[r.hotel_id]) result[r.hotel_id] = {}
    if (!result[r.hotel_id][r.date]) result[r.hotel_id][r.date] = {}
    result[r.hotel_id][r.date][r.room_id] = r.status
  }
  res.json(result)
})

app.post('/api/kalender', (req, res) => {
  // Expect { hotelId, date, roomId, status }
  const { hotelId, date, roomId, status } = req.body
  try {
    if (status === 'free') {
      db.prepare('DELETE FROM availability WHERE hotel_id=? AND date=? AND room_id=?').run(hotelId, date, roomId)
    } else {
      db.prepare(`
        INSERT INTO availability (hotel_id, date, room_id, status)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(hotel_id, date, room_id) DO UPDATE SET status=excluded.status
      `).run(hotelId, date, roomId, status)
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('[DB] POST /api/kalender:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── Settings (hotels config) ─────────────────────────────────────────────
app.get('/api/settings/:key', (req, res) => {
  const row = db.prepare('SELECT value FROM settings WHERE key=?').get(req.params.key)
  if (!row) return res.status(404).json({ error: 'not found' })
  res.json({ value: JSON.parse(row.value) })
})

app.put('/api/settings/:key', (req, res) => {
  try {
    db.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value=excluded.value
    `).run(req.params.key, JSON.stringify(req.body.value))
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

app.listen(PORT, '0.0.0.0', () =>
  console.log(`OfferMate läuft auf Port ${PORT} ${isProd ? '(production)' : '(dev proxy)'}`)
)
