import { useState } from 'react'
import { calcItemTotal, calcSubtotal, calcSurcharge, calcTotal, fmtCHF, fmtDate } from '../utils/priceCalculator.js'
import { CATEGORY_LABELS, EMPTY_SCHEDULE_ROW, PRICE_CATALOG } from '../utils/defaults.js'
import { CALENDAR_ROOMS, AVAIL_STATUS, getAvailStatus } from './AvailabilityCalendar.jsx'

// ─── Inline editable cell ──────────────────────────────────────────────────
function InlineInput({ value, onChange, type = 'text', className = '', placeholder = '', error = false }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={e => onChange(type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)}
      placeholder={placeholder}
      className={`input-field ${error ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''} ${className}`}
    />
  )
}

// ─── Required field indicator ──────────────────────────────────────────────
function RequiredDot() {
  return <span className="text-red-500 ml-0.5">*</span>
}

// ─── Field row ────────────────────────────────────────────────────────────
function FieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-[140px,1fr] items-start gap-2 py-1.5">
      <span className="label pt-1.5">{label}</span>
      {children}
    </div>
  )
}

export default function FieldEditor({ offer, setOffer, onNext, onBack, availability, hotelId }) {
  const [activeTab,    setActiveTab]    = useState('customer')
  const [copySuccess,  setCopySuccess]  = useState(false)

  const { items, schedule, pax, numberOfDays } = offer
  const gPax  = pax || 0
  const gDays = numberOfDays || 1

  // ─── Validation ──────────────────────────────────────────────────────────
  const missingFields = []
  if (!offer.firstName && !offer.lastName)        missingFields.push({ tab: 'customer', label: 'Name' })
  if (!offer.email)                               missingFields.push({ tab: 'customer', label: 'E-Mail' })
  if (!offer.eventDate)                           missingFields.push({ tab: 'event',    label: 'Datum' })
  if (!offer.pax)                                 missingFields.push({ tab: 'event',    label: 'Personen (PAX)' })
  if (!offer.items?.some(i => i.enabled && i.category !== 'surcharge'))
                                                  missingFields.push({ tab: 'services', label: 'Mind. 1 Leistung' })
  const canProceed = missingFields.length === 0
  const tabHasError = tab => missingFields.some(f => f.tab === tab)

  // ─── Updaters ────────────────────────────────────────────────────────────
  const set = (key, val) => setOffer(prev => ({ ...prev, [key]: val }))

  const updateItem = (id, patch) =>
    setOffer(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, ...patch } : i),
    }))

  const addCustomItem = () => {
    const newItem = {
      id:            `custom_${Date.now()}`,
      name:          'Neue Position',
      customName:    'Neue Position',
      category:      'fb',
      unitPrice:     0,
      type:          'per_person_per_day',
      unit:          'p.P.',
      enabled:       true,
      quantityOverride: null,
      paxOverride:   null,
      quantity:      1,
    }
    setOffer(prev => ({ ...prev, items: [...prev.items, newItem] }))
  }

  const removeItem = (id) =>
    setOffer(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }))

  const updateSchedule = (id, patch) =>
    setOffer(prev => ({
      ...prev,
      schedule: prev.schedule.map(r => r.id === id ? { ...r, ...patch } : r),
    }))

  const addScheduleRow = () =>
    setOffer(prev => ({ ...prev, schedule: [...prev.schedule, EMPTY_SCHEDULE_ROW()] }))

  const removeScheduleRow = (id) =>
    setOffer(prev => ({ ...prev, schedule: prev.schedule.filter(r => r.id !== id) }))

  // ─── Price summary ────────────────────────────────────────────────────────
  const subtotal  = calcSubtotal(items, gPax, gDays)
  const surcharge = calcSurcharge(items, gPax, gDays)
  const total     = calcTotal(items, gPax, gDays)

  const TABS = [
    { id: 'customer', label: 'Kontakt' },
    { id: 'event',    label: 'Event' },
    { id: 'services', label: 'Leistungen' },
    { id: 'schedule', label: 'Ablauf' },
  ]

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Warnings */}
      {offer.warnings?.length > 0 && (
        <div className="flex flex-col gap-2">
          {offer.warnings.map((w, i) => (
            <div key={i} className={w.toLowerCase().includes('bitte') || w.toLowerCase().includes('please') ? 'warning-red' : 'warning-yellow'}>
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {w}
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white border border-b-white border-gray-200 -mb-px text-sg-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tabHasError(tab.id) && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── CUSTOMER ── */}
        {activeTab === 'customer' && (
          <div className="space-y-1">
            <FieldRow label={<>Vorname <RequiredDot /></>}>
              <InlineInput value={offer.firstName} onChange={v => set('firstName', v)} placeholder="Max"
                error={!offer.firstName && !offer.lastName} />
            </FieldRow>
            <FieldRow label="Nachname">
              <InlineInput value={offer.lastName} onChange={v => set('lastName', v)} placeholder="Mustermann"
                error={!offer.firstName && !offer.lastName} />
            </FieldRow>
            <FieldRow label={<>E-Mail <RequiredDot /></>}>
              <InlineInput value={offer.email} onChange={v => set('email', v)} placeholder="max@example.ch"
                error={!offer.email} />
            </FieldRow>
            <FieldRow label="Telefon">
              <InlineInput value={offer.phone} onChange={v => set('phone', v)} placeholder="+41 79 …" />
            </FieldRow>
            <FieldRow label="Firma">
              <InlineInput value={offer.company} onChange={v => set('company', v)} placeholder="Musterfirma AG" />
            </FieldRow>
            <FieldRow label="Sprache">
              <select value={offer.language || 'de'} onChange={e => set('language', e.target.value)} className="input-field">
                <option value="de">Deutsch (du-Form)</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </FieldRow>
            <FieldRow label="Typ">
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={!!offer.isAgency} onChange={e => set('isAgency', e.target.checked)} className="rounded text-alpine-600" />
                  Agentur-Anfrage (+10%)
                </label>
                <label className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={!!offer.isReturningCustomer} onChange={e => set('isReturningCustomer', e.target.checked)} className="rounded text-alpine-600" />
                  Stammkunde
                </label>
              </div>
            </FieldRow>
          </div>
        )}

        {/* ── EVENT ── */}
        {activeTab === 'event' && (
          <div className="space-y-1">
            <FieldRow label="Anlass/Titel">
              <InlineInput value={offer.eventTitle} onChange={v => set('eventTitle', v)} placeholder="Jahresmeeting" />
            </FieldRow>
            <FieldRow label={<>Datum <RequiredDot /></>}>
              <div className="flex gap-2">
                <InlineInput value={offer.eventDate} onChange={v => set('eventDate', v)} type="date"
                  error={!offer.eventDate} />
                <span className="pt-1.5 text-sm text-gray-400">bis</span>
                <InlineInput value={offer.eventEndDate} onChange={v => set('eventEndDate', v)} type="date" />
              </div>
            </FieldRow>
            <FieldRow label="Anzahl Tage">
              <InlineInput value={offer.numberOfDays} onChange={v => set('numberOfDays', v)} type="number" placeholder="1" />
            </FieldRow>

            {/* ── Availability check ── */}
            {offer.eventDate && hotelId && (
              <AvailabilityCheck
                availability={availability}
                hotelId={hotelId}
                eventDate={offer.eventDate}
                eventEndDate={offer.eventEndDate}
                numberOfDays={offer.numberOfDays || 1}
                enabledRoomIds={offer.items.filter(i => i.enabled && CALENDAR_ROOMS.some(r => r.id === i.id)).map(i => i.id)}
              />
            )}

            <FieldRow label={<>Personen (PAX) <RequiredDot /></>}>
              <InlineInput
                value={offer.pax}
                onChange={v => set('pax', v)}
                type="number"
                placeholder="0"
                error={!offer.pax}
              />
            </FieldRow>
            <FieldRow label="Rechnungsadresse">
              <textarea
                value={offer.billingAddress || ''}
                onChange={e => set('billingAddress', e.target.value)}
                placeholder="Firma AG, Strasse 1, 6000 Luzern"
                rows={2}
                className="input-field resize-none"
              />
            </FieldRow>
            <FieldRow label="Rechnungs-E-Mail">
              <InlineInput value={offer.invoiceEmail || offer.email} onChange={v => set('invoiceEmail', v)} placeholder="rechnung@firma.ch" />
            </FieldRow>
            <FieldRow label="Verrechnung">
              <select value={offer.paymentType || 'Gesamtrechnung'} onChange={e => set('paymentType', e.target.value)} className="input-field">
                <option>Gesamtrechnung</option>
                <option>Payself</option>
              </select>
            </FieldRow>
            <FieldRow label="Optionsdatum">
              <InlineInput value={offer.optionDate} onChange={v => set('optionDate', v)} type="date" />
            </FieldRow>
            <FieldRow label="Art">
              <select value={offer.requestType || 'day_seminar'} onChange={e => set('requestType', e.target.value)} className="input-field">
                <option value="day_seminar">Tagesseminar</option>
                <option value="multi_day_seminar">Mehrtages-Seminar</option>
                <option value="overnight">Mit Übernachtung</option>
                <option value="meeting">Meeting</option>
              </select>
            </FieldRow>
            <FieldRow label="Intro-Satz">
              <div>
                <textarea
                  value={offer.introText || ''}
                  onChange={e => set('introText', e.target.value)}
                  placeholder="Von Claude generierter Eröffnungssatz…"
                  rows={2}
                  className="input-field resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Persönlicher Einstieg — direkt nach der Anrede in der Offerte.</p>
              </div>
            </FieldRow>
            <FieldRow label="Besondere Wünsche">
              <textarea
                value={offer.specialRequests || ''}
                onChange={e => set('specialRequests', e.target.value)}
                placeholder="Vegetarisch, Allergien, etc."
                rows={2}
                className="input-field resize-none"
              />
            </FieldRow>
          </div>
        )}

        {/* ── SERVICES ── */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            {tabHasError('services') && (
              <div className="warning-red text-xs">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                Mindestens eine Leistung aktivieren bevor die Offerte erstellt werden kann.
              </div>
            )}
            {/* Group by category */}
            {Object.entries(CATEGORY_LABELS).map(([catId, catLabel]) => {
              const catItems = items.filter(i => i.category === catId)
              if (catItems.length === 0) return null
              return (
                <div key={catId}>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <span>{catLabel}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="space-y-1">
                    {catItems.map(item => (
                      <ServiceRow
                        key={item.id}
                        item={item}
                        gPax={gPax}
                        gDays={gDays}
                        onUpdate={patch => updateItem(item.id, patch)}
                        onRemove={item.id.startsWith('custom_') ? () => removeItem(item.id) : null}
                      />
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Custom items */}
            {items.filter(i => i.category === 'fb' && i.id.startsWith('custom_')).length === 0 && (
              <button onClick={addCustomItem} className="btn-secondary w-full justify-center text-xs py-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Eigene Position hinzufügen
              </button>
            )}

            {/* Live total */}
            <div className="card p-3 mt-4 bg-alpine-50">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Zwischentotal</span>
                  <span>{fmtCHF(subtotal)}</span>
                </div>
                {surcharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Agentur-Aufschlag</span>
                    <span>{fmtCHF(surcharge)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-alpine-700 border-t border-alpine-200 pt-1 mt-1">
                  <span>TOTAL (inkl. MWST)</span>
                  <span className="text-base">{fmtCHF(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {activeTab === 'schedule' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-alpine-700 text-white">
                    <th className="px-2 py-1.5 text-left font-medium w-20">Zeit</th>
                    <th className="px-2 py-1.5 text-left font-medium">Was</th>
                    <th className="px-2 py-1.5 text-left font-medium w-32">Wo</th>
                    <th className="px-2 py-1.5 text-left font-medium w-16">PAX</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-1 py-1">
                        <input type="time" value={row.time || ''} onChange={e => updateSchedule(row.id, { time: e.target.value })}
                          className="input-field text-xs" />
                      </td>
                      <td className="px-1 py-1">
                        <input value={row.activity || ''} onChange={e => updateSchedule(row.id, { activity: e.target.value })}
                          placeholder="Aktivität…" className="input-field text-xs" />
                      </td>
                      <td className="px-1 py-1">
                        <input value={row.location || ''} onChange={e => updateSchedule(row.id, { location: e.target.value })}
                          placeholder="Raum…" className="input-field text-xs" />
                      </td>
                      <td className="px-1 py-1">
                        <input type="number" value={row.pax ?? ''} onChange={e => updateSchedule(row.id, { pax: e.target.value ? Number(e.target.value) : null })}
                          placeholder={String(gPax)} className="input-field text-xs w-14" />
                      </td>
                      <td className="px-1 py-1 text-center">
                        <button onClick={() => removeScheduleRow(row.id)} className="text-red-400 hover:text-red-600">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={addScheduleRow} className="btn-secondary w-full justify-center text-xs py-1.5 mt-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              Zeile hinzufügen
            </button>

            <p className="text-xs text-gray-400 mt-2">
              Tipp: Leer lassen wenn kein detaillierter Tagesablauf gewünscht.
            </p>
          </div>
        )}

      </div>

      {/* Follow-up email */}
      {offer.followUpEmail && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 pt-3 pb-4 px-4 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-semibold text-blue-800 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              AI-Rückfrage — Pflichtfelder fehlen
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { navigator.clipboard.writeText(offer.followUpEmail); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000) }}
                className="btn-secondary text-xs py-1 px-2.5"
              >
                {copySuccess ? '✓ Kopiert' : 'Kopieren'}
              </button>
              {offer.email && (
                <a
                  href={`mailto:${offer.email}?subject=Ihre%20Anfrage%20Hotel%20Alpenblick&body=${encodeURIComponent(offer.followUpEmail)}`}
                  className="btn-primary text-xs py-1 px-2.5 no-underline"
                >
                  Per E-Mail öffnen
                </a>
              )}
            </div>
          </div>
          <textarea
            value={offer.followUpEmail}
            onChange={e => set('followUpEmail', e.target.value)}
            rows={5}
            className="input-field resize-none text-sm bg-white"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col gap-2 pt-3 border-t border-gray-200">
        {!canProceed && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Fehlend: {missingFields.map(f => f.label).join(' · ')}
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onBack} className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Zurück
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="btn-primary flex-1 justify-center"
          >
            Offerte Vorschau
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Availability Check ────────────────────────────────────────────────────
function AvailabilityCheck({ availability, hotelId, eventDate, eventEndDate, numberOfDays, enabledRoomIds }) {
  // Build list of dates to check
  const dates = []
  const start = new Date(eventDate + 'T12:00:00')
  for (let i = 0; i < Math.max(numberOfDays, 1); i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }

  // For each room: find worst status across all dates
  const roomStatuses = CALENDAR_ROOMS.map(room => {
    const statuses = dates.map(date => getAvailStatus(availability, hotelId, date, room.id))
    const worst = statuses.includes('booked') ? 'booked' : statuses.includes('option') ? 'option' : 'free'
    return { ...room, status: worst, isSelected: enabledRoomIds.includes(room.id) }
  })

  const hasConflict = roomStatuses.some(r => r.isSelected && r.status === 'booked')
  const hasOption   = roomStatuses.some(r => r.isSelected && r.status === 'option')
  const allFree     = roomStatuses.every(r => !r.isSelected || r.status === 'free')

  return (
    <div className={`rounded-lg border px-3 py-2.5 ${
      hasConflict ? 'bg-red-50 border-red-200' :
      hasOption   ? 'bg-amber-50 border-amber-200' :
                    'bg-green-50 border-green-200'
    }`}>
      <div className="flex items-center gap-2 mb-1.5">
        <svg className={`w-3.5 h-3.5 shrink-0 ${hasConflict ? 'text-red-500' : hasOption ? 'text-amber-500' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
        </svg>
        <span className={`text-xs font-semibold ${hasConflict ? 'text-red-700' : hasOption ? 'text-amber-700' : 'text-green-700'}`}>
          Verfügbarkeit {fmtDate(eventDate)}{dates.length > 1 ? ` – ${fmtDate(dates[dates.length - 1])}` : ''}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {roomStatuses.map(r => {
          const cfg = AVAIL_STATUS[r.status]
          return (
            <span
              key={r.id}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${
                cfg.bg} ${cfg.border} ${cfg.text} ${!r.isSelected ? 'opacity-40' : ''
              }`}
              title={r.isSelected ? 'Raum ist in Offerte gewählt' : 'Raum nicht gewählt'}
            >
              {r.isSelected && <span className="w-1 h-1 rounded-full bg-current" />}
              {r.short}: {cfg.label}
            </span>
          )
        })}
      </div>
      {roomStatuses.filter(r => r.isSelected && r.status === 'booked').map(r => (
        <p key={r.id} className="text-xs text-red-600 mt-1 font-medium">
          ⚠ {r.name} am {fmtDate(eventDate)} bereits belegt — bitte anderen Raum oder Datum prüfen
        </p>
      ))}
      {roomStatuses.filter(r => r.isSelected && r.status === 'option').map(r => (
        <p key={r.id} className="text-xs text-amber-600 mt-1 font-medium">
          ◑ {r.name} am {fmtDate(eventDate)} mit Offerte belegt — Überschneidung prüfen
        </p>
      ))}
    </div>
  )
}

// ─── Service Row Component ─────────────────────────────────────────────────
function ServiceRow({ item, gPax, gDays, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const total = calcItemTotal(item, gPax, gDays)

  const effectivePax  = item.paxOverride  ?? gPax
  const effectiveDays = item.quantityOverride ?? gDays

  let description = ''
  switch (item.type) {
    case 'per_person_per_day':
    case 'per_person_per_day_min':
      description = `CHF ${item.unitPrice} × ${effectivePax} P. × ${effectiveDays} T.`
      if (item.type === 'per_person_per_day_min' && item.unitPrice * effectivePax < (item.minPrice || 0)) {
        description += ` (Min. CHF ${item.minPrice}/T.)`
      }
      break
    case 'flat_per_day':
      description = `CHF ${item.unitPrice}/Tag × ${effectiveDays} T.`
      break
    case 'flat_per_unit':
      description = `CHF ${item.unitPrice} × ${item.quantity ?? 1} Stk.`
      break
    case 'per_person':
      description = `CHF ${item.unitPrice} × ${effectivePax} P.`
      break
    case 'percentage':
      description = `${item.unitPrice}% Aufschlag`
      break
  }

  return (
    <div className={`rounded-lg border transition-colors ${item.enabled ? 'border-alpine-200 bg-alpine-50/50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
      {/* Main row */}
      <div className="flex items-center gap-2 px-3 py-2">
        <input
          type="checkbox"
          checked={item.enabled}
          onChange={e => onUpdate({ enabled: e.target.checked })}
          className="rounded text-alpine-600 shrink-0"
        />
        <span className={`flex-1 text-sm truncate ${item.enabled ? 'text-gray-800' : 'text-gray-400'}`}>
          {item.customName || item.name}
        </span>
        {item.enabled && (
          <>
            <span className="text-xs text-gray-400 hidden sm:block shrink-0">{description}</span>
            <span className="text-sm font-semibold text-alpine-700 shrink-0 ml-2">{fmtCHF(total)}</span>
          </>
        )}
        {item.enabled && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-gray-400 hover:text-gray-600 shrink-0"
            title="Bearbeiten"
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        )}
        {onRemove && (
          <button onClick={onRemove} className="text-red-400 hover:text-red-600 shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Expanded edit */}
      {expanded && item.enabled && (
        <div className="px-3 pb-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-alpine-100 pt-2">
          <div>
            <label className="label">Bezeichnung</label>
            <input
              value={item.customName || item.name}
              onChange={e => onUpdate({ customName: e.target.value })}
              className="input-field text-xs"
            />
          </div>
          <div>
            <label className="label">Preis (CHF)</label>
            <input
              type="number"
              step="0.5"
              value={item.unitPrice}
              onChange={e => onUpdate({ unitPrice: Number(e.target.value) })}
              className="input-field text-xs"
            />
          </div>
          {item.type === 'flat_per_unit' ? (
            <div>
              <label className="label">Anzahl Stück</label>
              <input
                type="number"
                value={item.quantity ?? 1}
                onChange={e => onUpdate({ quantity: Number(e.target.value) })}
                className="input-field text-xs"
              />
            </div>
          ) : (
            <>
              {item.type !== 'per_person' && item.type !== 'percentage' && (
                <div>
                  <label className="label">Tage (leer = global)</label>
                  <input
                    type="number"
                    value={item.quantityOverride ?? ''}
                    onChange={e => onUpdate({ quantityOverride: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder={String(gDays)}
                    className="input-field text-xs"
                  />
                </div>
              )}
              {item.type !== 'flat_per_day' && item.type !== 'percentage' && (
                <div>
                  <label className="label">PAX (leer = global)</label>
                  <input
                    type="number"
                    value={item.paxOverride ?? ''}
                    onChange={e => onUpdate({ paxOverride: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder={String(gPax)}
                    className="input-field text-xs"
                  />
                </div>
              )}
            </>
          )}
          {item.type === 'per_person_per_day_min' && (
            <div>
              <label className="label">Minimum CHF/Tag</label>
              <input
                type="number"
                value={item.minPrice ?? ''}
                onChange={e => onUpdate({ minPrice: Number(e.target.value) })}
                className="input-field text-xs"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
