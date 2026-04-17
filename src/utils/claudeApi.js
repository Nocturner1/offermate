const MODEL = 'claude-haiku-4-5-20251001'

function buildSystemPrompt(hotel) {
  const hotelName = hotel?.name || 'Hotel'
  const hotelNotes = hotel?.notes ? `\n\nHotel-Informationen:\n${hotel.notes}` : ''

  return `Du bist Experte für Hotel-Seminaranfragen des ${hotelName}.
Extrahiere strukturierte Daten aus der E-Mail und gib valides JSON zurück.
Antworte NUR mit dem JSON-Objekt, ohne Erklärungen oder Markdown.${hotelNotes}

Mögliche requestedServices IDs (nur vorhandene verwenden):
room_wattawis, room_weinkeller, room_buero,
overnight_classic, overnight_premium, overnight_peak,
overnight_ez, overnight_comfort, overnight_nostalgie, overnight_suite,
welcome_coffee,
lunch_veg, lunch_meat, lunch_flammi, lunch_sandwich, lunch_dessert, dinner,
coffee_break_1, coffee_break_2, smoothie, aperitif,
pinboard, microphone, conference_tech

DATEN-REGELN:
- requestType: "day_seminar" (Seminar/Meeting/Tagung ohne Übernachtung), "multi_day_seminar" (mehrere Tage), "overnight" (mit Übernachtung)
- isAgency=true: Agentur, Agency, "im Auftrag von", "für unseren Kunden"
- isReturningCustomer=true: "wie letztes Jahr", "wie immer", "wie bisher", "Stammgast", "schon mehrmals"
- language: "de" / "en" / "fr" / "es" — Sprache der eingehenden E-Mail
- tagesablauf: nur befüllen wenn konkrete Zeitangaben in der Mail stehen
- warnings: ["PAX nicht angegeben – bitte nachfragen"] wenn PAX fehlt; ["Datum fehlt – bitte nachfragen"] wenn Datum fehlt; ["Vorjahresbuchung prüfen"] wenn Stammkunde

RÜCKFRAGE-REGELN (followUpEmail):
Wenn PAX oder Datum fehlen, generiere eine höfliche, kurze Rückfrage-Mail in derselben Sprache wie die Anfrage.
Stil: persönlich (du/Sie passend zur Anfrage), direkt, max. 3-4 Sätze.
Begrüssung → konkrete Fragen → kurzer freundlicher Abschluss.
Wenn beide Pflichtfelder (PAX und Datum) vorhanden sind: followUpEmail = null.

INTRO-TEXT-REGELN (introText):
Schreibe EINEN einzigen Eröffnungssatz für die Offerte. Keine Begrüssung, kein "Vielen Dank" — direkt.
- Greife den konkreten Anlass oder die besondere Eigenschaft der Anfrage auf
- Ton: warmherzig und direkt, kein Marketingsprech, keine Floskeln
- Bei Stammkunden: persönlicher ("Schön, dass ihr wieder bei uns seid.")
- Bei Erstkontakt: etwas konkreter auf den Anlass eingehen
- Sprache: exakt die Sprache der eingehenden E-Mail (de/en/fr/es)
- Maximal 2 kurze Sätze`
}

function buildUserPrompt(emailText) {
  return `Extrahiere die Daten aus dieser Hotel-Anfrage-E-Mail:

${emailText}

Gib exakt dieses JSON zurück (alle Felder, fehlende als null):
{
  "firstName": string|null,
  "lastName": string|null,
  "email": string|null,
  "phone": string|null,
  "company": string|null,
  "isAgency": boolean,
  "language": "de"|"en"|"fr"|"es",
  "eventDate": "YYYY-MM-DD"|null,
  "eventEndDate": "YYYY-MM-DD"|null,
  "numberOfDays": number|null,
  "pax": number|null,
  "requestType": "day_seminar"|"multi_day_seminar"|"overnight"|"meeting",
  "eventTitle": string|null,
  "billingAddress": string|null,
  "invoiceEmail": string|null,
  "requestedServices": string[],
  "tagesablauf": [{"id":"uuid","time":string,"activity":string,"location":string,"pax":number|null}],
  "specialRequests": string|null,
  "introText": string,
  "warnings": string[],
  "isReturningCustomer": boolean,
  "followUpEmail": string|null
}`
}

export async function parseEmailWithClaude(emailText, apiKey, hotel) {
  const response = await fetch('/api/anthropic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: 2048,
      system:     buildSystemPrompt(hotel),
      messages:   [{ role: 'user', content: buildUserPrompt(emailText) }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API Fehler: ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    const parsed = JSON.parse(cleaned)

    if (Array.isArray(parsed.tagesablauf)) {
      parsed.tagesablauf = parsed.tagesablauf.map(row => ({
        ...row,
        id: row.id || crypto.randomUUID(),
      }))
    } else {
      parsed.tagesablauf = []
    }
    if (!Array.isArray(parsed.warnings))         parsed.warnings = []
    if (!Array.isArray(parsed.requestedServices)) parsed.requestedServices = []
    if (!parsed.introText)                        parsed.introText = ''
    if (parsed.followUpEmail === undefined)        parsed.followUpEmail = null

    return parsed
  } catch {
    throw new Error('Claude hat kein gültiges JSON zurückgegeben. Bitte E-Mail prüfen und nochmals versuchen.')
  }
}
