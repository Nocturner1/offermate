import { useState } from 'react'
import { fmtCHF, fmtDate } from '../utils/priceCalculator.js'
import { CALENDAR_ROOMS } from './AvailabilityCalendar.jsx'

export const STATUS_CONFIG = {
  new:       { label: 'Neu',              cssClass: 'badge badge-new' },
  sent:      { label: 'Offerte gesendet', cssClass: 'badge badge-sent' },
  confirmed: { label: 'Bestätigt',        cssClass: 'badge badge-confirmed' },
  cancelled: { label: 'Abgesagt',        cssClass: 'badge badge-cancelled' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.new
  return (
    <span className={cfg.cssClass}>
      {cfg.label}
    </span>
  )
}

function StatusSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      onClick={e => e.stopPropagation()}
      className="text-xs border border-gray-200 rounded-md px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-sg-500 cursor-pointer"
    >
      {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
        <option key={key} value={key}>{label}</option>
      ))}
    </select>
  )
}

export default function InquiryList({ inquiries, setInquiries, hotels, onOpenOffer, onNewOffer, availability, setAvailability }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterHotel,  setFilterHotel]  = useState('all')
  const [sortAsc,      setSortAsc]      = useState(true)

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const updateStatus = (inq, newStatus) => {
    setInquiries(prev =>
      prev.map(i => i.id === inq.id ? { ...i, status: newStatus, updatedAt: new Date().toISOString() } : i)
    )

    // Auto-update calendar rooms
    if (!inq.hotelId || !inq.eventDate || !setAvailability) return
    const calStatus = newStatus === 'confirmed' ? 'booked'
                    : newStatus === 'sent'      ? 'option'
                    : 'free'
    const enabledRooms = (inq.offer?.items ?? [])
      .filter(item => item.enabled && CALENDAR_ROOMS.some(r => r.id === item.id))
      .map(item => item.id)
    if (enabledRooms.length === 0) return

    const dates = []
    const start = new Date(inq.eventDate + 'T12:00:00')
    for (let i = 0; i < Math.max(inq.numberOfDays || 1, 1); i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      dates.push(d.toISOString().split('T')[0])
    }

    setAvailability(prev => {
      const next = JSON.parse(JSON.stringify(prev ?? {}))
      for (const roomId of enabledRooms) {
        for (const date of dates) {
          if (calStatus === 'free') {
            delete next[inq.hotelId]?.[date]?.[roomId]
          } else {
            if (!next[inq.hotelId])       next[inq.hotelId] = {}
            if (!next[inq.hotelId][date]) next[inq.hotelId][date] = {}
            next[inq.hotelId][date][roomId] = calStatus
          }
        }
      }
      return next
    })
  }

  const deleteInquiry = (id, name) => {
    if (confirm(`Anfrage von "${name}" löschen?`)) {
      setInquiries(prev => prev.filter(i => i.id !== id))
    }
  }

  // ─── Filter + sort ────────────────────────────────────────────────────────
  const filtered = inquiries
    .filter(i => filterStatus === 'all' || i.status === filterStatus)
    .filter(i => filterHotel  === 'all' || i.hotelId === filterHotel)
    .sort((a, b) => {
      const da = a.eventDate || '9999', db = b.eventDate || '9999'
      return sortAsc ? da.localeCompare(db) : db.localeCompare(da)
    })

  // ─── Stats ────────────────────────────────────────────────────────────────
  const counts = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map(k => [k, inquiries.filter(i => i.status === k).length])
  )
  const multiHotel = hotels.length > 1

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Anfragen-Übersicht</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {inquiries.length} Anfrage{inquiries.length !== 1 ? 'n' : ''} total
            {counts.confirmed > 0 && <span className="ml-2 text-green-700 font-medium">· {counts.confirmed} bestätigt</span>}
          </p>
        </div>
        <button onClick={onNewOffer} className="btn-primary shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Neue Offerte
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status pills */}
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Alle ({inquiries.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
            counts[key] > 0 && (
              <button
                key={key}
                onClick={() => setFilterStatus(prev => prev === key ? 'all' : key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  filterStatus === key
                    ? STATUS_CONFIG[key].cssClass + ' font-semibold'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {label} ({counts[key]})
              </button>
            )
          ))}
        </div>

        <div className="flex-1" />

        {/* Hotel filter */}
        {multiHotel && (
          <select
            value={filterHotel}
            onChange={e => setFilterHotel(e.target.value)}
            className="input-field text-xs py-1 w-auto"
          >
            <option value="all">Alle Hotels</option>
            {hotels.map(h => (
              <option key={h.id} value={h.id}>{h.name || 'Neues Hotel'}</option>
            ))}
          </select>
        )}

        {/* Sort toggle */}
        <button
          onClick={() => setSortAsc(s => !s)}
          className="btn-secondary text-xs py-1 px-2.5"
          title={sortAsc ? 'Älteste zuerst' : 'Neueste zuerst'}
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${sortAsc ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
          </svg>
          Datum
        </button>
      </div>

      {/* Empty state */}
      {inquiries.length === 0 && (
        <div className="card p-12 text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p className="font-medium text-gray-500">Noch keine Anfragen gespeichert</p>
          <p className="text-sm mt-1">Anfragen werden automatisch gespeichert, wenn du eine Offerte erstellst.</p>
          <button onClick={onNewOffer} className="btn-primary mt-4 mx-auto">
            Erste Offerte erstellen
          </button>
        </div>
      )}

      {/* No results after filter */}
      {inquiries.length > 0 && filtered.length === 0 && (
        <div className="card p-8 text-center text-gray-400 text-sm">
          Keine Anfragen mit diesem Filter.
        </div>
      )}

      {/* Table — desktop */}
      {filtered.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="card overflow-hidden hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {multiHotel && <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Hotel</th>}
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kunde</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Anlass</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <button onClick={() => setSortAsc(s => !s)} className="flex items-center gap-1 hover:text-gray-700">
                      Datum
                      <svg className={`w-3 h-3 ${sortAsc ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">PAX</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="w-16" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((inq, idx) => (
                  <tr
                    key={inq.id}
                    onClick={() => onOpenOffer(inq)}
                    className={`cursor-pointer transition-colors hover:bg-sg-50 ${
                      inq.status === 'cancelled' ? 'opacity-50' : ''
                    }`}
                  >
                    {multiHotel && (
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {hotels.find(h => h.id === inq.hotelId)?.name?.split(' ')[0] ?? '—'}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <p className={`font-medium text-gray-900 ${inq.status === 'cancelled' ? 'line-through' : ''}`}>
                        {inq.customerName || '—'}
                      </p>
                      {inq.company && <p className="text-xs text-gray-400 truncate max-w-32">{inq.company}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-40">
                      <p className="truncate">{inq.eventTitle || <span className="text-gray-300 italic">kein Titel</span>}</p>
                      <p className="text-xs text-gray-400">{inq.numberOfDays} Tag{inq.numberOfDays !== 1 ? 'e' : ''}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {inq.eventDate ? fmtDate(inq.eventDate) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {inq.pax ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800 whitespace-nowrap">
                      {inq.totalAmount ? fmtCHF(inq.totalAmount) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <StatusSelect value={inq.status} onChange={s => updateStatus(inq, s)} />
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); deleteInquiry(inq.id, inq.customerName) }}
                        className="text-gray-300 hover:text-red-400 transition-colors p-1"
                        title="Löschen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-2">
            {filtered.map(inq => (
              <div
                key={inq.id}
                onClick={() => onOpenOffer(inq)}
                className={`card p-4 cursor-pointer hover:border-sg-300 transition-colors ${
                  inq.status === 'cancelled' ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className={`font-semibold text-gray-900 truncate ${inq.status === 'cancelled' ? 'line-through' : ''}`}>
                      {inq.customerName || '—'}
                    </p>
                    {inq.company && <p className="text-xs text-gray-400">{inq.company}</p>}
                  </div>
                  <div onClick={e => e.stopPropagation()}>
                    <StatusSelect value={inq.status} onChange={s => updateStatus(inq, s)} />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  {inq.eventTitle && <span className="font-medium text-gray-700">{inq.eventTitle}</span>}
                  {inq.eventDate && <span>{fmtDate(inq.eventDate)}</span>}
                  {inq.pax && <span>{inq.pax} PAX</span>}
                  {inq.totalAmount > 0 && <span className="font-semibold text-gray-800 ml-auto">{fmtCHF(inq.totalAmount)}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
