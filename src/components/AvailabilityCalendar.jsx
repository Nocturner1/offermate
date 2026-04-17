import { useState } from 'react'

// Fallback rooms (used if hotel has no calendarRooms defined)
export const CALENDAR_ROOMS = [
  { id: 'room_wattawis',   name: 'Raum Wattawis',  short: 'Wattawis'   },
  { id: 'room_weinkeller', name: 'Weinkeller',      short: 'Weinkeller' },
  { id: 'room_buero',      name: 'Kleines Büro',    short: 'Büro'       },
]

export const AVAIL_STATUS = {
  free:   { label: 'Verfügbar',    bg: 'bg-green-50',    border: 'border-green-200',  text: 'text-green-700',  icon: null },
  booked: { label: 'Belegt',       bg: 'bg-red-100',     border: 'border-red-300',    text: 'text-red-700',    icon: '✕'  },
  option: { label: 'Offerte ges.', bg: 'bg-orange-100',  border: 'border-orange-300', text: 'text-orange-700', icon: '◑'  },
  unklar: { label: 'Auf Anfrage',  bg: 'bg-gray-100',    border: 'border-gray-300',   text: 'text-gray-500',   icon: '?'  },
}

const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
const DAY_ABBR    = ['So','Mo','Di','Mi','Do','Fr','Sa']

// ─── Pure helpers ──────────────────────────────────────────────────────────
export function getAvailStatus(availability, hotelId, date, roomId) {
  return availability?.[hotelId]?.[date]?.[roomId] ?? 'free'
}

function cycleNext(current) {
  if (current === 'free')   return 'booked'
  if (current === 'booked') return 'option'
  if (current === 'option') return 'unklar'
  return 'free'
}

function setRoomStatus(availability, hotelId, date, roomId, status) {
  const next = JSON.parse(JSON.stringify(availability ?? {}))
  if (!next[hotelId])       next[hotelId] = {}
  if (!next[hotelId][date]) next[hotelId][date] = {}

  if (status === 'free') {
    delete next[hotelId][date][roomId]
    if (!Object.keys(next[hotelId][date]).length) delete next[hotelId][date]
    if (!Object.keys(next[hotelId]).length)       delete next[hotelId]
  } else {
    next[hotelId][date][roomId] = status
  }
  return next
}

// ─── Single cell ───────────────────────────────────────────────────────────
function Cell({ status, isToday, isPast, isWeekend, onClick }) {
  const cfg = AVAIL_STATUS[status] ?? AVAIL_STATUS.free
  return (
    <button
      onClick={onClick}
      disabled={isPast}
      title={cfg.label}
      className={[
        'w-full h-8 rounded border text-xs font-bold transition-colors select-none',
        cfg.bg, cfg.border, cfg.text,
        isToday   ? 'ring-2 ring-alpine-500 ring-offset-1' : '',
        isWeekend && status === 'free' ? 'bg-gray-50' : '',
        isPast    ? 'opacity-25 cursor-default' : 'cursor-pointer hover:opacity-80',
      ].join(' ')}
    >
      {cfg.icon}
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function AvailabilityCalendar({ availability, setAvailability, hotels, selectedHotelId, setSelectedHotelId }) {
  const today    = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const hotel = hotels.find(h => h.id === selectedHotelId) ?? hotels[0]
  const activeRooms = hotel?.calendarRooms ?? CALENDAR_ROOMS

  // ─── Navigation ───────────────────────────────────────────────────────────
  const prevMonth = () => month === 0  ? (setYear(y => y-1), setMonth(11))  : setMonth(m => m-1)
  const nextMonth = () => month === 11 ? (setYear(y => y+1), setMonth(0))   : setMonth(m => m+1)
  const goToday   = () => { setYear(today.getFullYear()); setMonth(today.getMonth()) }

  // ─── Days ─────────────────────────────────────────────────────────────────
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d   = new Date(year, month, i + 1)
    const str = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
    return {
      date:     str,
      num:      i + 1,
      weekday:  d.getDay(),
      isToday:  str === todayStr,
      isPast:   str < todayStr,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    }
  })

  // ─── Interactions ─────────────────────────────────────────────────────────
  const handleCellClick = (date, roomId) => {
    if (!hotel) return
    const current = getAvailStatus(availability, hotel.id, date, roomId)
    const next    = cycleNext(current)
    setAvailability(setRoomStatus(availability, hotel.id, date, roomId, next))
  }

  // Bulk mark a whole day
  const handleDayHeader = (date) => {
    if (!hotel) return
    const allBooked = activeRooms.every(r => getAvailStatus(availability, hotel.id, date, r.id) === 'booked')
    activeRooms.forEach(r => {
      setAvailability(prev => setRoomStatus(prev, hotel.id, date, r.id, allBooked ? 'free' : 'booked'))
    })
  }

  // Clear whole month for this hotel
  const handleClearMonth = () => {
    if (!hotel) return
    if (!confirm(`Alle Einträge für ${MONTH_NAMES[month]} ${year} im ${hotel.name} löschen?`)) return
    setAvailability(prev => {
      const next = JSON.parse(JSON.stringify(prev ?? {}))
      if (!next[hotel.id]) return next
      days.forEach(d => {
        if (next[hotel.id]?.[d.date]) delete next[hotel.id][d.date]
      })
      if (!Object.keys(next[hotel.id] ?? {}).length) delete next[hotel.id]
      return next
    })
  }

  // Stats for the month
  const bookedCount = days.reduce((acc, d) =>
    acc + activeRooms.filter(r => getAvailStatus(availability, hotel?.id, d.date, r.id) === 'booked').length, 0)

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Verfügbarkeit</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manuelle Belegungsübersicht — Klick auf Zelle wechselt Status
          </p>
        </div>
        {bookedCount > 0 && (
          <button onClick={handleClearMonth} className="btn-secondary text-xs py-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Monat leeren
          </button>
        )}
      </div>

      {/* Hotel tabs (if >1) */}
      {hotels.length > 1 && (
        <div className="flex gap-1.5 flex-wrap">
          {hotels.map(h => (
            <button
              key={h.id}
              onClick={() => setSelectedHotelId(h.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                h.id === hotel?.id
                  ? 'border-alpine-600 bg-alpine-50 text-alpine-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {h.logo && <img src={h.logo} alt="" className="h-4 w-6 object-contain" />}
              {h.name || 'Hotel'}
            </button>
          ))}
        </div>
      )}

      {/* Month navigator */}
      <div className="flex items-center gap-3">
        <button onClick={prevMonth} className="btn-secondary p-1.5" title="Vorheriger Monat">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h3 className="text-base font-semibold text-gray-900 min-w-36 text-center">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button onClick={nextMonth} className="btn-secondary p-1.5" title="Nächster Monat">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button onClick={goToday} className="btn-secondary text-xs py-1.5 px-3 ml-1">
          Heute
        </button>
        {bookedCount > 0 && (
          <span className="text-xs text-gray-400 ml-1">
            {bookedCount} Belegung{bookedCount !== 1 ? 'en' : ''}
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="border-collapse" style={{ minWidth: `${150 + daysInMonth * 36}px` }}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {/* Room header col */}
                <th className="sticky left-0 z-10 bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-r border-gray-200 w-32">
                  Raum
                </th>
                {days.map(d => (
                  <th
                    key={d.date}
                    className={[
                      'px-0 py-1.5 text-center cursor-pointer select-none',
                      d.isToday   ? 'bg-alpine-50'         : '',
                      d.isWeekend ? 'bg-gray-100/60'       : '',
                      d.isPast    ? 'opacity-40'           : 'hover:bg-gray-100',
                    ].join(' ')}
                    style={{ width: 34, minWidth: 34 }}
                    title={`Ganzen Tag ${d.isPast ? '' : '(klick = alle Räume belegt/frei)'}`}
                    onClick={() => !d.isPast && handleDayHeader(d.date)}
                  >
                    <div className={`text-xs font-bold ${d.isToday ? 'text-alpine-700' : d.isWeekend ? 'text-gray-400' : 'text-gray-700'}`}>
                      {d.num}
                    </div>
                    <div className={`text-xs ${d.isToday ? 'text-alpine-500 font-semibold' : 'text-gray-400'}`}>
                      {DAY_ABBR[d.weekday]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeRooms.map((room, roomIdx) => (
                <tr key={room.id} className={roomIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  {/* Room label — sticky */}
                  <td className={`sticky left-0 z-10 px-3 py-1.5 border-r border-gray-200 ${roomIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{room.short}</span>
                  </td>
                  {/* Day cells */}
                  {days.map(d => (
                    <td key={d.date} className={`p-0.5 ${d.isToday ? 'bg-alpine-50/40' : ''} ${d.isWeekend ? 'bg-gray-100/40' : ''}`}>
                      <Cell
                        status={getAvailStatus(availability, hotel?.id, d.date, room.id)}
                        isToday={d.isToday}
                        isPast={d.isPast}
                        isWeekend={d.isWeekend}
                        onClick={() => !d.isPast && handleCellClick(d.date, room.id)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend + tips */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {Object.entries(AVAIL_STATUS).map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs font-bold ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                {cfg.icon}
              </span>
              {cfg.label}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Klick auf Tageszahl → alle Räume belegt/frei
        </p>
      </div>
    </div>
  )
}
