import { useRef, useState } from 'react'
import { calcItemTotal, calcSubtotal, calcSurcharge, calcTotal, fmtCHF, fmtDate } from '../utils/priceCalculator.js'
import { CATEGORY_LABELS } from '../utils/defaults.js'
import { generateDocx } from '../utils/docxExport.js'

const T = {
  de: {
    greeting:        (name, lastName, greeting) =>
      greeting === 'Sie' ? `Guten Tag ${name} ${lastName},` : `Hallo ${name}`,
    event:           'Veranstaltungsdetails',
    occasion:        'Anlass',
    date:            'Datum',
    days:            'Anzahl Tage',
    pax:             'Anzahl Personen',
    billing:         'Rechnungsadresse',
    invoiceEmail:    'E-Mail für Rechnung',
    services:        'Gewählte Leistungen',
    service:         'Leistung',
    unitPrice:       'Einzelpreis',
    qty:             'Menge / PAX',
    total:           'Total',
    schedule:        'Tagesablauf',
    time:            'Zeit',
    activity:        'Was',
    location:        'Wo',
    paxCol:          'PAX',
    priceOverview:   'Preisübersicht',
    subtotal:        'Zwischentotal',
    agencySurcharge: (pct) => `Agentur-Aufschlag ${pct}%`,
    grandTotal:      'GESAMTTOTAL (inkl. MWST)',
    paymentMethod:   'Verrechnungsart',
    validUntil:      'Diese Offerte ist gültig bis',
    cancellation:    'Stornobedingungen',
    cancRows: [
      ['0–5 Tage vor dem Anlass',  '100%'],
      ['6–14 Tage vor dem Anlass', '75%'],
      ['15–30 Tage vor dem Anlass','50%'],
      ['31–60 Tage vor dem Anlass','20%'],
    ],
    bookingConfirm:  'Buchungsbestätigung',
    bookingText:     'Mit meiner Unterschrift bestätige ich die Buchung sowie die AGB und Stornobedingungen des Hotels.',
    placeDate:       'Ort, Datum',
    clientSig:       'Unterschrift Auftraggeber',
    hotelSig:        (name) => `Unterschrift ${name}`,
    specialRequests: 'Besondere Wünsche',
  },
  en: {
    greeting:        (name, lastName, greeting) =>
      greeting === 'Sie' ? `Dear ${name} ${lastName},` : `Dear ${name},`,
    event:           'Event Details',
    occasion:        'Event',
    date:            'Date',
    days:            'Number of Days',
    pax:             'Number of Persons',
    billing:         'Billing Address',
    invoiceEmail:    'Invoice Email',
    services:        'Selected Services',
    service:         'Service',
    unitPrice:       'Unit Price',
    qty:             'Qty / PAX',
    total:           'Total',
    schedule:        'Schedule',
    time:            'Time',
    activity:        'Activity',
    location:        'Location',
    paxCol:          'PAX',
    priceOverview:   'Price Summary',
    subtotal:        'Subtotal',
    agencySurcharge: (pct) => `Agency surcharge ${pct}%`,
    grandTotal:      'GRAND TOTAL (incl. VAT)',
    paymentMethod:   'Payment method',
    validUntil:      'This offer is valid until',
    cancellation:    'Cancellation Policy',
    cancRows: [
      ['0–5 days before the event',  '100%'],
      ['6–14 days before the event', '75%'],
      ['15–30 days before the event','50%'],
      ['31–60 days before the event','20%'],
    ],
    bookingConfirm:  'Booking Confirmation',
    bookingText:     'By signing below, I confirm the booking and agree to the hotel\'s terms and cancellation policy.',
    placeDate:       'Place, Date',
    clientSig:       'Client Signature',
    hotelSig:        (name) => `${name} Signature`,
    specialRequests: 'Special Requests',
  },
  fr: {
    greeting:        (name, lastName, greeting) =>
      greeting === 'Sie' ? `Bonjour ${name} ${lastName},` : `Bonjour ${name},`,
    event:           'Détails de l\'événement',
    occasion:        'Événement',
    date:            'Date',
    days:            'Nombre de jours',
    pax:             'Nombre de personnes',
    billing:         'Adresse de facturation',
    invoiceEmail:    'E-mail facturation',
    services:        'Prestations sélectionnées',
    service:         'Prestation',
    unitPrice:       'Prix unitaire',
    qty:             'Qté / PAX',
    total:           'Total',
    schedule:        'Programme',
    time:            'Heure',
    activity:        'Activité',
    location:        'Lieu',
    paxCol:          'PAX',
    priceOverview:   'Récapitulatif des prix',
    subtotal:        'Sous-total',
    agencySurcharge: (pct) => `Majoration agence ${pct}%`,
    grandTotal:      'TOTAL (TVA incluse)',
    paymentMethod:   'Mode de facturation',
    validUntil:      'Cette offre est valable jusqu\'au',
    cancellation:    'Conditions d\'annulation',
    cancRows: [
      ['0–5 jours avant l\'événement',  '100%'],
      ['6–14 jours avant l\'événement', '75%'],
      ['15–30 jours avant l\'événement','50%'],
      ['31–60 jours avant l\'événement','20%'],
    ],
    bookingConfirm:  'Confirmation de réservation',
    bookingText:     'En signant, je confirme la réservation et accepte les conditions générales de l\'hôtel.',
    placeDate:       'Lieu, date',
    clientSig:       'Signature du client',
    hotelSig:        (name) => `Signature ${name}`,
    specialRequests: 'Demandes particulières',
  },
  es: {
    greeting:        (name, lastName, greeting) =>
      greeting === 'Sie' ? `Estimado/a ${name} ${lastName},` : `Estimado/a ${name},`,
    event:           'Detalles del evento',
    occasion:        'Evento',
    date:            'Fecha',
    days:            'Número de días',
    pax:             'Número de personas',
    billing:         'Dirección de facturación',
    invoiceEmail:    'Email de facturación',
    services:        'Servicios seleccionados',
    service:         'Servicio',
    unitPrice:       'Precio unitario',
    qty:             'Cant. / PAX',
    total:           'Total',
    schedule:        'Programa',
    time:            'Hora',
    activity:        'Actividad',
    location:        'Lugar',
    paxCol:          'PAX',
    priceOverview:   'Resumen de precios',
    subtotal:        'Subtotal',
    agencySurcharge: (pct) => `Recargo agencia ${pct}%`,
    grandTotal:      'TOTAL (IVA incluido)',
    paymentMethod:   'Método de pago',
    validUntil:      'Esta oferta es válida hasta',
    cancellation:    'Condiciones de cancelación',
    cancRows: [
      ['0–5 días antes del evento',  '100%'],
      ['6–14 días antes del evento', '75%'],
      ['15–30 días antes del evento','50%'],
      ['31–60 días antes del evento','20%'],
    ],
    bookingConfirm:  'Confirmación de reserva',
    bookingText:     'Con mi firma confirmo la reserva y acepto los términos y condiciones del hotel.',
    placeDate:       'Lugar, fecha',
    clientSig:       'Firma del cliente',
    hotelSig:        (name) => `Firma ${name}`,
    specialRequests: 'Solicitudes especiales',
  },
}

export default function OfferPreview({ offer, onBack, onEdit }) {
  const printRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)

  const lang   = T[offer.language] ? offer.language : 'de'
  const t      = T[lang]
  const gPax   = offer.pax  || 0
  const gDays  = offer.numberOfDays || 1

  // Template values
  const template     = offer.hotelInfo?.template ?? {}
  const primaryColor = template.primaryColor || '#2D5016'
  const greetingMode = template.greeting || 'du'

  const enabledItems = offer.items.filter(i => i.enabled && i.type !== 'percentage')
  const agencyItem   = offer.items.find(i => i.id === 'agency_surcharge' && i.enabled)
  const subtotal     = calcSubtotal(offer.items, gPax, gDays)
  const surcharge    = calcSurcharge(offer.items, gPax, gDays)
  const total        = calcTotal(offer.items, gPax, gDays)

  const handlePrint = () => {
    window.print()
  }

  const handleDocx = async () => {
    setIsExporting(true)
    try {
      await generateDocx({ ...offer, hotelInfo: offer.hotelInfo })
    } catch (e) {
      alert('Fehler beim Export: ' + e.message)
    } finally {
      setIsExporting(false)
    }
  }

  const dateRange = offer.eventDate
    ? fmtDate(offer.eventDate, lang) + (offer.eventEndDate ? ` – ${fmtDate(offer.eventEndDate, lang)}` : '')
    : '—'

  // AGB text from template, falling back to cancRows table
  const agbText = template.agbText || null

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 no-print flex-wrap">
        <button onClick={onBack} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Zurück
        </button>
        <button onClick={onEdit} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Bearbeiten
        </button>
        <div className="flex-1" />
        <button onClick={handlePrint} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Drucken
        </button>
        <button onClick={handleDocx} disabled={isExporting} className="btn-primary">
          {isExporting ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          )}
          .docx exportieren
        </button>
      </div>

      {/* Offer document */}
      <div ref={printRef} className="offer-preview flex-1 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="max-w-3xl mx-auto">

          {/* Header image (if set in template) */}
          {template.headerImage && (
            <img src={template.headerImage} alt="Header" className="w-full h-40 object-cover" />
          )}

          {/* Hotel header bar */}
          <div
            className="flex items-start justify-between px-8 py-5"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-start gap-4">
              {offer.hotelInfo.logo && (
                <img
                  src={offer.hotelInfo.logo}
                  alt={offer.hotelInfo.name}
                  className="h-12 max-w-36 object-contain"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">{offer.hotelInfo.name}</h1>
                <p className="text-sm text-white/70 mt-1">{offer.hotelInfo.address}</p>
                <p className="text-sm text-white/70">{offer.hotelInfo.phone} · {offer.hotelInfo.email}</p>
              </div>
            </div>
            <div className="text-right text-sm text-white/70 shrink-0">
              <p className="font-medium text-white">Offerte</p>
              <p>{new Date().toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="p-8 sm:p-12">

            {/* Greeting */}
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {t.greeting(offer.firstName || '', offer.lastName || '', greetingMode)}
            </p>
            {offer.introText && (
              <p className="text-gray-700 mb-8">{offer.introText}</p>
            )}

            {/* Event details */}
            <SectionTitle color={primaryColor}>{t.event}</SectionTitle>
            <table className="w-full text-sm mb-8 border-collapse">
              <tbody>
                {[
                  [t.occasion,     offer.eventTitle || '—'],
                  [t.date,         dateRange],
                  [t.days,         String(gDays)],
                  [t.pax,          offer.pax ? `${offer.pax} Personen` : <span className="text-red-500 font-medium">Nicht angegeben!</span>],
                  [t.billing,      offer.billingAddress || offer.company || '—'],
                  [t.invoiceEmail, offer.invoiceEmail || offer.email || '—'],
                ].map(([k, v], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-3 py-2 font-medium text-gray-600 w-40 border border-gray-200">{k}</td>
                    <td className="px-3 py-2 text-gray-900 border border-gray-200">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Services */}
            {enabledItems.length > 0 && (
              <>
                <SectionTitle color={primaryColor}>{t.services}</SectionTitle>
                <table className="w-full text-sm mb-8 border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: primaryColor }}>
                      <th className="px-3 py-2 text-left font-medium text-white border border-white/20">{t.service}</th>
                      <th className="px-3 py-2 text-right font-medium text-white border border-white/20 w-28">{t.unitPrice}</th>
                      <th className="px-3 py-2 text-center font-medium text-white border border-white/20 w-36">{t.qty}</th>
                      <th className="px-3 py-2 text-right font-medium text-white border border-white/20 w-28">{t.total}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enabledItems.map((item, idx) => {
                      const itemTotal = calcItemTotal(item, gPax, gDays)
                      const effPax    = item.paxOverride  ?? gPax
                      const effDays   = item.quantityOverride ?? gDays
                      let qtyLabel = ''
                      switch (item.type) {
                        case 'per_person_per_day':
                        case 'per_person_per_day_min':
                          qtyLabel = `${effPax} P. × ${effDays} T.`
                          break
                        case 'flat_per_day':
                          qtyLabel = `${effDays} Tag(e)`
                          break
                        case 'flat_per_unit':
                          qtyLabel = `${item.quantity ?? 1} Stk.`
                          break
                        case 'per_person':
                          qtyLabel = `${effPax} Pers.`
                          break
                      }
                      return (
                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 text-gray-800 border border-gray-200">{item.customName || item.name}</td>
                          <td className="px-3 py-2 text-right text-gray-600 border border-gray-200">
                            {fmtCHF(item.unitPrice)} {item.unit}
                            {item.type === 'per_person_per_day_min' && item.minPrice && (
                              <div className="text-xs text-gray-400">min. {fmtCHF(item.minPrice)}/T.</div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center text-gray-600 border border-gray-200">{qtyLabel}</td>
                          <td className="px-3 py-2 text-right font-semibold text-gray-900 border border-gray-200">{fmtCHF(itemTotal)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </>
            )}

            {/* Schedule */}
            {offer.schedule.length > 0 && (
              <>
                <SectionTitle color={primaryColor}>{t.schedule}</SectionTitle>
                <table className="w-full text-sm mb-8 border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: primaryColor }}>
                      <th className="px-3 py-2 text-left font-medium text-white border border-white/20 w-20">{t.time}</th>
                      <th className="px-3 py-2 text-left font-medium text-white border border-white/20">{t.activity}</th>
                      <th className="px-3 py-2 text-left font-medium text-white border border-white/20 w-32">{t.location}</th>
                      <th className="px-3 py-2 text-center font-medium text-white border border-white/20 w-16">{t.paxCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offer.schedule.map((row, idx) => (
                      <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 font-mono text-gray-700 border border-gray-200">{row.time}</td>
                        <td className="px-3 py-2 text-gray-800 border border-gray-200">{row.activity}</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-200">{row.location}</td>
                        <td className="px-3 py-2 text-center text-gray-600 border border-gray-200">{row.pax ?? gPax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Special requests */}
            {offer.specialRequests && (
              <p className="text-sm text-gray-600 italic mb-6">
                <strong>{t.specialRequests}:</strong> {offer.specialRequests}
              </p>
            )}

            {/* Price summary */}
            <SectionTitle color={primaryColor}>{t.priceOverview}</SectionTitle>
            <div className="flex justify-end mb-8">
              <table className="text-sm w-64 border-collapse">
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="px-3 py-2 text-gray-600 border border-gray-200">{t.subtotal}</td>
                    <td className="px-3 py-2 text-right font-medium border border-gray-200">{fmtCHF(subtotal)}</td>
                  </tr>
                  {agencyItem && (
                    <tr>
                      <td className="px-3 py-2 text-gray-600 border border-gray-200">{t.agencySurcharge(agencyItem.unitPrice)}</td>
                      <td className="px-3 py-2 text-right font-medium border border-gray-200">{fmtCHF(surcharge)}</td>
                    </tr>
                  )}
                  <tr style={{ backgroundColor: primaryColor }}>
                    <td className="px-3 py-2 font-bold text-white border border-white/20">{t.grandTotal}</td>
                    <td className="px-3 py-2 text-right font-bold text-lg text-white border border-white/20">{fmtCHF(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment & validity */}
            <div className="flex gap-8 mb-8 text-sm text-gray-700">
              <div>
                <span className="font-medium">{t.paymentMethod}:</span>{' '}
                {offer.paymentType || 'Gesamtrechnung'}
              </div>
              <div>
                <span className="font-medium">{t.validUntil}:</span>{' '}
                {fmtDate(offer.optionDate, lang)}
              </div>
            </div>

            {/* Cancellation / AGB */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <p className="font-semibold text-amber-900 text-sm mb-2">{t.cancellation}</p>
              {agbText ? (
                <pre className="text-xs text-amber-800 whitespace-pre-wrap font-sans leading-relaxed">{agbText}</pre>
              ) : (
                <table className="text-xs w-full">
                  <tbody>
                    {t.cancRows.map(([period, pct], i) => (
                      <tr key={i}>
                        <td className="py-0.5 text-amber-800">{period}</td>
                        <td className="py-0.5 text-right font-semibold text-amber-900 w-12">{pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Booking confirmation */}
            <div className="border-t-2 border-gray-200 pt-8">
              <h3 className="font-bold text-gray-900 mb-2">{t.bookingConfirm}</h3>
              <p className="text-sm text-gray-600 mb-8">{t.bookingText}</p>

              <div className="grid grid-cols-3 gap-8 mt-12">
                {[
                  t.placeDate,
                  t.clientSig,
                  t.hotelSig(offer.hotelInfo.name),
                ].map((label, i) => (
                  <div key={i} className="text-center">
                    <div className="border-t-2 border-gray-400 pt-2">
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer / Signature */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
              {(template.signatureName || template.signatureTitle || template.signaturePhone || template.signatureEmail) ? (
                <div className="space-y-0.5">
                  {template.signatureName  && <p className="font-medium text-gray-600">{template.signatureName}</p>}
                  {template.signatureTitle && <p>{template.signatureTitle}</p>}
                  {template.signaturePhone && <p>{template.signaturePhone}</p>}
                  {template.signatureEmail && <p>{template.signatureEmail}</p>}
                  {offer.hotelInfo.website && <p>{offer.hotelInfo.website}</p>}
                </div>
              ) : (
                <p>{offer.hotelInfo.contactPerson} · {offer.hotelInfo.phone} · {offer.hotelInfo.email} · {offer.hotelInfo.website}</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children, color }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-sm font-bold uppercase tracking-wide whitespace-nowrap" style={{ color }}>
        {children}
      </h2>
      <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
    </div>
  )
}
