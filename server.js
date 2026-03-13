import express from 'express'
import cors    from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join }  from 'path'
import { existsSync }     from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app       = express()
const PORT      = process.env.PORT || 3001
const DIST      = join(__dirname, 'dist')
const isProd    = existsSync(DIST)

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json({ limit: '2mb' }))

// ─── Config endpoint ──────────────────────────────────────────────────────
// Frontend uses this to know whether a server-side API key is configured
app.get('/api/config', (_req, res) => {
  res.json({ hasServerKey: !!process.env.ANTHROPIC_API_KEY })
})

// ─── Anthropic proxy ──────────────────────────────────────────────────────
app.post('/api/anthropic', async (req, res) => {
  // Server env var takes priority; falls back to key supplied by browser
  const apiKey = process.env.ANTHROPIC_API_KEY || req.headers['x-api-key']

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
    res.status(upstream.status).json(data)
  } catch (err) {
    res.status(502).json({ error: { message: `Proxy-Fehler: ${err.message}` } })
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
