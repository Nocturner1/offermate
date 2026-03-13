import { useState, useEffect } from 'react'
import Sidebar             from './components/Sidebar.jsx'
import EmailInput          from './components/EmailInput.jsx'
import FieldEditor         from './components/FieldEditor.jsx'
import OfferPreview        from './components/OfferPreview.jsx'
import AdminPanel          from './components/AdminPanel.jsx'
import InquiryList         from './components/InquiryList.jsx'
import AvailabilityCalendar from './components/AvailabilityCalendar.jsx'
import { parseEmailWithClaude } from './utils/claudeApi.js'
import { calcTotal } from './utils/priceCalculator.js'
import {
  buildItems, applyDetectedServices, getOptionDate,
  DEFAULT_HOTELS, hotelToInfo,
} from './utils/defaults.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'

const EMPTY_OFFER = (hotelInfo, items) => ({
  inquiryId:           null,
  firstName:           '',
  lastName:            '',
  email:               '',
  phone:               '',
  company:             '',
  isAgency:            false,
  isReturningCustomer: false,
  language:            'de',
  eventTitle:          '',
  eventDate:           '',
  eventEndDate:        '',
  numberOfDays:        1,
  pax:                 null,
  requestType:         'day_seminar',
  billingAddress:      '',
  invoiceEmail:        '',
  paymentType:         'Gesamtrechnung',
  optionDate:          getOptionDate(),
  items,
  schedule:            [],
  specialRequests:     '',
  introText:           '',
  warnings:            [],
  hotelInfo,
})

const VIEW_TITLES = {
  offer:     'Neue Offerte',
  inquiries: 'Anfragen-Übersicht',
  calendar:  'Verfügbarkeit',
}

export default function App() {
  const [view,      setView]      = useState('offer')
  const [step,      setStep]      = useState('input')
  const [offer,     setOffer]     = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)

  const [serverHasKey,    setServerHasKey]    = useState(false)
  const [apiKey,          setApiKey]          = useLocalStorage('om_api_key',       '')

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(d => setServerHasKey(!!d.hasServerKey)).catch(() => {})
  }, [])
  const [hotels,          setHotels]          = useLocalStorage('om_hotels',        DEFAULT_HOTELS)
  const [selectedHotelId, setSelectedHotelId] = useLocalStorage('om_selected_hotel', DEFAULT_HOTELS[0].id)
  const [inquiries,       setInquiries]       = useLocalStorage('om_inquiries',     [])
  const [availability,    setAvailability]    = useLocalStorage('om_availability',  {})

  const activeHotel = hotels.find(h => h.id === selectedHotelId) ?? hotels[0]
  const newInquiryCount = inquiries.filter(i => i.status === 'new').length

  // ─── Hotel helpers ────────────────────────────────────────────────────────
  const handleUpdateHotel = (id, patch) => {
    setHotels(prev => prev.map(h => h.id === id ? { ...h, ...patch } : h))
    if (offer && activeHotel?.id === id) {
      const updated = { ...activeHotel, ...patch }
      setOffer(prev => ({ ...prev, hotelInfo: hotelToInfo(updated) }))
    }
  }

  // ─── Inquiry save ─────────────────────────────────────────────────────────
  const saveInquiry = (currentOffer) => {
    const hotel = hotels.find(h => h.id === selectedHotelId) ?? hotels[0]
    const total = calcTotal(currentOffer.items, currentOffer.pax || 0, currentOffer.numberOfDays || 1, !!currentOffer.isAgency)
    const now   = new Date().toISOString()

    if (currentOffer.inquiryId) {
      setInquiries(prev => prev.map(i =>
        i.id === currentOffer.inquiryId
          ? { ...i, updatedAt: now, customerName: [currentOffer.firstName, currentOffer.lastName].filter(Boolean).join(' '),
              email: currentOffer.email, company: currentOffer.company, eventTitle: currentOffer.eventTitle,
              eventDate: currentOffer.eventDate, eventEndDate: currentOffer.eventEndDate,
              numberOfDays: currentOffer.numberOfDays, pax: currentOffer.pax, language: currentOffer.language,
              hotelId: hotel?.id, hotelName: hotel?.name, totalAmount: total, offer: currentOffer }
          : i
      ))
    } else {
      const id = `inq_${Date.now()}`
      setInquiries(prev => [...prev, {
        id, createdAt: now, updatedAt: now, status: 'new',
        customerName: [currentOffer.firstName, currentOffer.lastName].filter(Boolean).join(' '),
        email: currentOffer.email, company: currentOffer.company, eventTitle: currentOffer.eventTitle,
        eventDate: currentOffer.eventDate, eventEndDate: currentOffer.eventEndDate,
        numberOfDays: currentOffer.numberOfDays, pax: currentOffer.pax, language: currentOffer.language,
        hotelId: hotel?.id, hotelName: hotel?.name, totalAmount: total,
        offer: { ...currentOffer, inquiryId: id },
      }])
      setOffer(prev => ({ ...prev, inquiryId: id }))
    }
  }

  // ─── Offer flow ───────────────────────────────────────────────────────────
  const handleAnalyze = async (emailText) => {
    setError(null)
    setIsLoading(true)
    try {
      const parsed = await parseEmailWithClaude(emailText, apiKey)
      const hotel  = hotels.find(h => h.id === selectedHotelId) ?? hotels[0]
      const items  = applyDetectedServices(buildItems(hotel.prices), parsed.requestedServices || [], parsed.isAgency || false)
      setOffer({
        ...EMPTY_OFFER(hotelToInfo(hotel), items),
        firstName: parsed.firstName || '', lastName: parsed.lastName || '',
        email: parsed.email || '', phone: parsed.phone || '', company: parsed.company || '',
        isAgency: parsed.isAgency || false, isReturningCustomer: parsed.isReturningCustomer || false,
        language: parsed.language || 'de', eventTitle: parsed.eventTitle || '',
        eventDate: parsed.eventDate || '', eventEndDate: parsed.eventEndDate || '',
        numberOfDays: parsed.numberOfDays || 1, pax: parsed.pax || null,
        requestType: parsed.requestType || 'day_seminar',
        billingAddress: parsed.billingAddress || '', invoiceEmail: parsed.invoiceEmail || '',
        specialRequests: parsed.specialRequests || '', introText: parsed.introText || '',
        followUpEmail: parsed.followUpEmail || null,
        schedule: parsed.tagesablauf || [], warnings: parsed.warnings || [], items,
      })
      setStep('edit')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToPreview = () => {
    setStep('preview')
    if (offer) saveInquiry(offer)
  }

  const handleNewOffer = () => {
    setOffer(null); setError(null); setStep('input'); setView('offer')
  }

  const handleOpenOffer = (inq) => {
    setOffer(inq.offer); setStep('preview'); setView('offer')
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  const pageTitle = view === 'offer'
    ? (step === 'input' ? 'Neue Offerte' : step === 'edit' ? 'Offerte bearbeiten' : 'Offerte Vorschau')
    : VIEW_TITLES[view]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar */}
      <Sidebar
        view={view}
        setView={(v) => { setView(v); if (v === 'offer' && !offer) setStep('input') }}
        setAdminOpen={setAdminOpen}
        inquiryBadge={newInquiryCount}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col ml-64 min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="no-print h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            {/* Breadcrumb / title */}
            <h1 className="text-base font-semibold text-gray-900">{pageTitle}</h1>
            {view === 'offer' && step !== 'input' && (
              <>
                <span className="text-gray-300">/</span>
                <div className="flex items-center gap-1.5 text-sm">
                  {[
                    { id: 'input',   label: 'E-Mail' },
                    { id: 'edit',    label: 'Felder' },
                    { id: 'preview', label: 'Vorschau' },
                  ].map((s, i, arr) => (
                    <div key={s.id} className="flex items-center gap-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                        step === s.id ? 'bg-sg-100 text-sg-700' : 'text-gray-400'
                      }`}>{s.label}</span>
                      {i < arr.length - 1 && <span className="text-gray-200">›</span>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* New offer button (non-offer views) */}
            {view !== 'offer' && (
              <button onClick={handleNewOffer} className="btn-primary text-xs py-1.5 px-3">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Neue Offerte
              </button>
            )}
            {/* New offer in offer view (not on input step) */}
            {view === 'offer' && step !== 'input' && (
              <button onClick={handleNewOffer} className="btn-ghost text-xs py-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Neue Offerte
              </button>
            )}

            {/* Hotel selector */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              {activeHotel?.logo && (
                <img src={activeHotel.logo} alt="" className="h-6 w-10 object-contain rounded" />
              )}
              <select
                value={selectedHotelId}
                onChange={e => setSelectedHotelId(e.target.value)}
                className="text-sm font-medium text-gray-700 bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer pr-6 appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center', backgroundSize: '16px' }}
              >
                {hotels.map(h => (
                  <option key={h.id} value={h.id}>{h.name || 'Neues Hotel'}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* Error */}
          {error && (
            <div className="warning-red mb-5">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <div className="flex-1 text-sm"><strong>Fehler:</strong> {error}</div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          )}

          {/* ── CALENDAR ── */}
          {view === 'calendar' && (
            <AvailabilityCalendar
              availability={availability}
              setAvailability={setAvailability}
              hotels={hotels}
              selectedHotelId={selectedHotelId}
              setSelectedHotelId={setSelectedHotelId}
            />
          )}

          {/* ── INQUIRIES ── */}
          {view === 'inquiries' && (
            <InquiryList
              inquiries={inquiries}
              setInquiries={setInquiries}
              hotels={hotels}
              onOpenOffer={handleOpenOffer}
              onNewOffer={handleNewOffer}
              availability={availability}
              setAvailability={setAvailability}
            />
          )}

          {/* ── OFFER ── */}
          {view === 'offer' && (
            <>
              {step === 'input' && (
                <div className="max-w-2xl mx-auto">
                  <div className="card p-6">
                    <EmailInput
                      onAnalyze={handleAnalyze}
                      isLoading={isLoading}
                      apiKey={apiKey}
                      serverHasKey={serverHasKey}
                      hotels={hotels}
                      selectedHotelId={selectedHotelId}
                      setSelectedHotelId={setSelectedHotelId}
                    />
                  </div>
                </div>
              )}

              {step === 'edit' && offer && (
                <div className="max-w-3xl mx-auto">
                  <div className="card p-6">
                    <FieldEditor
                      offer={offer}
                      setOffer={setOffer}
                      onNext={handleGoToPreview}
                      onBack={() => setStep('input')}
                      availability={availability}
                      hotelId={activeHotel?.id}
                    />
                  </div>
                </div>
              )}

              {step === 'preview' && offer && (
                <OfferPreview
                  offer={offer}
                  setOffer={setOffer}
                  onBack={() => setStep('edit')}
                  onEdit={() => setStep('edit')}
                />
              )}
            </>
          )}

        </main>
      </div>

      {/* Admin panel */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        hotels={hotels}
        setHotels={setHotels}
        onUpdateHotel={handleUpdateHotel}
        apiKey={apiKey}
        setApiKey={setApiKey}
        serverHasKey={serverHasKey}
      />
    </div>
  )
}
