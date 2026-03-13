import { useState } from 'react'

const DEMO_EMAIL = `Von: Thomas Müller <t.mueller@synergic-ag.ch>
An: info@alpenblick-weggis.ch
Betreff: Seminaranfrage für unser Jahresmeeting

Guten Tag

Ich bin auf der Suche nach einem geeigneten Seminarraum für unser Jahresmeeting.

Datum: 15. April 2026
Personen: 18 Teilnehmer
Dauer: 1 Tag (kein Übernachten nötig)

Wir würden gerne folgende Leistungen in Anspruch nehmen:
- Seminarraum für den ganzen Tag
- Begrüssungskaffee mit Gipfeli
- Mittagessen vegetarisch (2-Gang)
- 2 Kaffeepausen

Rechnungsadresse: Synergic AG, Industriestrasse 12, 6010 Kriens
Rechnungs-E-Mail: finanzen@synergic-ag.ch

Über eine Offerte würde ich mich sehr freuen.

Freundliche Grüsse
Thomas Müller
Synergic AG | +41 79 345 67 89`

export default function EmailInput({ onAnalyze, isLoading, apiKey, serverHasKey, hotels = [], selectedHotelId, setSelectedHotelId }) {
  const [emailText, setEmailText] = useState('')

  const handleDemo = () => setEmailText(DEMO_EMAIL)

  const canAnalyze = emailText.trim().length > 20 && !isLoading

  return (
    <div className="flex flex-col h-full">
      {/* Intro */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Anfrage-E-Mail einfügen</h2>
        <p className="text-sm text-gray-500">
          E-Mail kopieren und hier einfügen — Claude extrahiert automatisch alle relevanten Informationen.
        </p>
      </div>

      {/* ── Hotel selector (only when >1 hotel) ── */}
      {hotels.length > 1 && (
        <div className="mb-4">
          <label className="label mb-1.5">Hotel</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {hotels.map(h => {
              const active = h.id === selectedHotelId
              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotelId(h.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all ${
                    active
                      ? 'border-alpine-600 bg-alpine-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {h.logo ? (
                    <img src={h.logo} alt="" className="h-6 w-10 object-contain rounded shrink-0" />
                  ) : (
                    <span className="text-base shrink-0">🏨</span>
                  )}
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${active ? 'text-alpine-800' : 'text-gray-700'}`}>
                      {h.name || 'Neues Hotel'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {h.address?.split(',').slice(-1)[0]?.trim() || '—'}
                    </p>
                  </div>
                  {active && (
                    <svg className="w-3.5 h-3.5 text-alpine-600 shrink-0 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {!apiKey && !serverHasKey && (
        <div className="warning-red mb-4">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span>Kein Claude API-Key konfiguriert. Bitte zuerst in den <strong>Einstellungen</strong> eintragen.</span>
        </div>
      )}

      {/* Textarea */}
      <div className="relative flex-1">
        <textarea
          value={emailText}
          onChange={e => setEmailText(e.target.value)}
          placeholder="E-Mail hier einfügen…"
          className="w-full h-full min-h-[320px] rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono
            focus:outline-none focus:ring-2 focus:ring-alpine-500 focus:border-transparent
            placeholder:text-gray-400 resize-y"
          spellCheck={false}
        />
        {emailText && (
          <button
            onClick={() => setEmailText('')}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Leeren"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onAnalyze(emailText)}
          disabled={!canAnalyze}
          className="btn-primary flex-1 justify-center py-2.5"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Claude analysiert…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              E-Mail analysieren
            </>
          )}
        </button>

        <button
          onClick={handleDemo}
          className="btn-secondary"
          title="Demo-E-Mail laden"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Demo
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Powered by Claude Haiku · API-Kosten ca. CHF 0.001 pro Anfrage
      </p>
    </div>
  )
}
