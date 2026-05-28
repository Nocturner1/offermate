import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, BorderStyle,
  ShadingType, ImageRun,
} from 'docx'
import { saveAs } from 'file-saver'
import { calcItemTotal, calcSubtotal, calcSurcharge, calcTotal, fmtCHF, fmtDate } from './priceCalculator.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexColor(color) {
  const raw = (color || '#2D5016').replace('#', '').trim().toUpperCase()
  // Must be exactly 6 valid hex chars — fallback to safe dark green otherwise
  return /^[0-9A-F]{6}$/.test(raw) ? raw : '2D5016'
}

function lighten(hex) {
  // Returns a very light tint for table alternating rows
  return 'F8F8F8'
}

function txt(text, opts = {}) {
  return new TextRun({ text: String(text ?? ''), font: 'Arial', ...opts })
}

function para(children, opts = {}) {
  const runs = Array.isArray(children) ? children : [children]
  return new Paragraph({ children: runs, ...opts })
}

const BORDER_NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const ALL_NONE    = { top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_NONE, insideH: BORDER_NONE, insideV: BORDER_NONE }

function hr(color = 'DDDDDD') {
  return para([], {
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
    spacing: { before: 80, after: 80 },
  })
}

function spacer(before = 200) {
  return para([], { spacing: { before } })
}

function sectionTitle(title, color) {
  return para([txt(title, { bold: true, size: 22, color: hexColor(color) })], {
    spacing: { before: 280, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: hexColor(color) } },
  })
}

function dataCell(content, { alignment, bold, color, italics } = {}) {
  const children = Array.isArray(content) ? content : [
    para([txt(String(content ?? ''), { size: 18, bold, color, italics })],
      alignment ? { alignment } : {}),
  ]
  return new TableCell({
    children,
    margins: { top: 60, bottom: 60, left: 140, right: 140 },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      left:   { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      right:  { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
    },
  })
}

function headerCell(text, primaryHex) {
  return new TableCell({
    children: [para([txt(text, { bold: true, color: 'FFFFFF', size: 18 })])],
    shading: { fill: primaryHex, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: primaryHex },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: primaryHex },
      left:   { style: BorderStyle.SINGLE, size: 1, color: primaryHex },
      right:  { style: BorderStyle.SINGLE, size: 1, color: primaryHex },
    },
  })
}

function labelCell(text, shade = 'F3F4F6') {
  return new TableCell({
    children: [para([txt(text, { bold: true, size: 18 })])],
    shading: { fill: shade, type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 140, right: 140 },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      left:   { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      right:  { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
    },
    width: { size: 3200, type: WidthType.DXA },
  })
}

// Fetch logo from URL and return ArrayBuffer (or null if not available)
async function fetchLogo(logoUrl) {
  if (!logoUrl) return null
  try {
    const res = await fetch(logoUrl)
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateDocx(offer) {
  const {
    firstName, lastName, email, phone, company,
    eventTitle, eventDate, eventEndDate, numberOfDays, numberOfNights, pax,
    billingAddress, invoiceEmail, paymentType, optionDate,
    language, isAgency, items, schedule, hotelInfo, specialRequests,
    introText,
  } = offer

  const lang    = ['de','en','fr','es'].includes(language) ? language : 'de'
  const isDE    = lang === 'de'
  const gPax    = pax || 0
  const gDays   = numberOfDays || 1
  const gNights = numberOfNights ?? Math.max(0, gDays - 1)

  const template     = hotelInfo?.template ?? {}
  const primaryColor = template.primaryColor || '#2D5016'
  const primaryHex   = hexColor(primaryColor)

  const greetingMode = template.greeting || 'du'
  const sigName      = template.signatureName  || hotelInfo?.contactPerson || ''
  const sigTitle     = template.signatureTitle || ''
  const sigPhone     = template.signaturePhone || hotelInfo?.phone || ''
  const sigEmail     = template.signatureEmail || hotelInfo?.email || ''

  const greetingMap = {
    de: greetingMode === 'Sie' ? `Guten Tag ${firstName || ''} ${lastName || ''},` : `Hallo ${firstName || ''},`,
    en: `Dear ${firstName || ''} ${lastName || ''},`,
    fr: `Bonjour ${firstName || ''},`,
    es: `Estimado/a ${firstName || ''},`,
  }
  const greeting = greetingMap[lang] ?? greetingMap.de

  const closingMap = {
    de: greetingMode === 'Sie' ? 'Freundliche Grüsse' : 'Herzliche Grüsse',
    en: 'Kind regards',
    fr: 'Cordialement',
    es: 'Atentamente',
  }
  const closing = closingMap[lang] ?? closingMap.de

  const titleMap = {
    de: `Deine Offerte aus dem ${hotelInfo?.name || 'Hotel'}`,
    en: `Your offer from ${hotelInfo?.name || 'Hotel'}`,
    fr: `Votre offre de ${hotelInfo?.name || 'Hotel'}`,
    es: `Su oferta de ${hotelInfo?.name || 'Hotel'}`,
  }
  const offerTitle = titleMap[lang] ?? titleMap.de

  const enabledItems = items.filter(i => i.enabled && i.type !== 'percentage')
  const subtotal     = calcSubtotal(items, gPax, gDays, isAgency)
  const surcharge    = calcSurcharge(items, gPax, gDays, isAgency)
  const total        = calcTotal(items, gPax, gDays, isAgency)

  // ─── Logo ─────────────────────────────────────────────────────────────────
  const logoData = await fetchLogo(hotelInfo?.logo)

  // ─── Contact + Event detail table ─────────────────────────────────────────
  const TABLE_WIDTH = 9200 // DXA

  const detailRows = [
    [isDE ? 'Firma'           : 'Company',        company || '—'],
    [isDE ? 'Name'            : 'Name',            `${firstName || ''} ${lastName || ''}`.trim() || '—'],
    [isDE ? 'Telefon'         : 'Phone',           phone || '—'],
    [isDE ? 'E-Mail'          : 'Email',           email || '—'],
    [''],
    [isDE ? 'Anlass'          : 'Event',           eventTitle || '—'],
    [isDE ? 'Datum'           : 'Date',            eventDate ? fmtDate(eventDate, lang) + (eventEndDate ? ` – ${fmtDate(eventEndDate, lang)}` : '') : '—'],
    [isDE ? 'Anzahl Tage'     : 'Days',            String(gDays)],
    ...(gNights > 0 ? [[isDE ? 'Anzahl Nächte' : 'Nights', String(gNights)]] : []),
    [isDE ? 'Personen (PAX)'  : 'Persons',         pax ? String(pax) : '—'],
    [''],
    [isDE ? 'Rechnungsadresse': 'Billing Address', billingAddress || company || '—'],
    [isDE ? 'E-Mail Rechnung' : 'Invoice Email',   invoiceEmail || email || '—'],
  ].filter(r => r.length > 0)

  const detailTable = new Table({
    width: { size: TABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [3200, 6000],
    rows: detailRows.map(([k, v]) => {
      if (!k && !v) {
        // Empty separator row
        return new TableRow({
          children: [
            new TableCell({
              children: [para([])],
              columnSpan: 2,
              borders: ALL_NONE,
              margins: { top: 40, bottom: 40, left: 0, right: 0 },
            }),
          ],
        })
      }
      return new TableRow({
        children: [
          labelCell(k),
          dataCell(v),
        ],
      })
    }),
  })

  // ─── Services Table ────────────────────────────────────────────────────────
  const serviceHeaderRow = new TableRow({
    children: [
      headerCell(isDE ? 'Leistung'       : 'Service',    primaryHex),
      headerCell(isDE ? 'Einzelpreis'    : 'Unit Price', primaryHex),
      headerCell(isDE ? 'Menge / PAX'   : 'Qty / PAX',  primaryHex),
      headerCell('Total CHF',                            primaryHex),
    ],
    tableHeader: true,
  })

  const serviceRows = enabledItems.map((item, idx) => {
    const itemTotal      = calcItemTotal(item, gPax, gDays, isAgency)
    const effectivePax   = item.paxOverride      ?? gPax
    const effectiveDays  = item.quantityOverride ?? gDays
    const displayPrice   = (isAgency && item.agencyUnitPrice != null) ? item.agencyUnitPrice : item.unitPrice

    let qtyLabel = ''
    switch (item.type) {
      case 'per_person_per_day':
      case 'per_person_per_day_min':
        qtyLabel = `${effectivePax} Pers. × ${effectiveDays} ${isDE ? 'Tag(e)' : 'day(s)'}`
        break
      case 'flat_per_day':
        qtyLabel = `${effectiveDays} ${isDE ? 'Tag(e)' : 'day(s)'}`
        break
      case 'flat_per_unit':
        qtyLabel = `${item.quantity ?? 1} ${isDE ? 'Stück' : 'pcs'}`
        break
      case 'per_person':
        qtyLabel = `${effectivePax} ${isDE ? 'Pers.' : 'pers.'}`
        break
    }

    const fill = idx % 2 === 0 ? 'FFFFFF' : 'F9FAFB'
    const cellStyle = { shading: { fill, type: ShadingType.CLEAR } }
    return new TableRow({
      children: [
        new TableCell({
          children: [para([txt(item.customName || item.name, { size: 18 })])],
          ...cellStyle,
          margins: { top: 70, bottom: 70, left: 140, right: 140 },
          width: { size: 4200, type: WidthType.DXA },
        }),
        new TableCell({
          children: [para([txt(`${fmtCHF(displayPrice)} ${item.unit}`, { size: 18 })], { alignment: AlignmentType.RIGHT })],
          ...cellStyle,
          margins: { top: 70, bottom: 70, left: 140, right: 140 },
          width: { size: 2000, type: WidthType.DXA },
        }),
        new TableCell({
          children: [para([txt(qtyLabel, { size: 18 })], { alignment: AlignmentType.CENTER })],
          ...cellStyle,
          margins: { top: 70, bottom: 70, left: 140, right: 140 },
          width: { size: 1600, type: WidthType.DXA },
        }),
        new TableCell({
          children: [para([txt(fmtCHF(itemTotal), { size: 18, bold: true })], { alignment: AlignmentType.RIGHT })],
          ...cellStyle,
          margins: { top: 70, bottom: 70, left: 140, right: 140 },
          width: { size: 1400, type: WidthType.DXA },
        }),
      ],
    })
  })

  const servicesTable = new Table({
    width: { size: TABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [4200, 2000, 1600, 1400],
    rows: [serviceHeaderRow, ...serviceRows],
  })

  // ─── Schedule Table ────────────────────────────────────────────────────────
  const scheduleTable = schedule?.length > 0 ? new Table({
    width: { size: TABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [1400, 3600, 2800, 1400],
    rows: [
      new TableRow({
        children: [
          headerCell(isDE ? 'Zeit'     : 'Time',     primaryHex),
          headerCell(isDE ? 'Was'      : 'Activity', primaryHex),
          headerCell(isDE ? 'Wo'       : 'Location', primaryHex),
          headerCell('PAX',                           primaryHex),
        ],
        tableHeader: true,
      }),
      ...schedule.map((row, idx) => {
        const fill = idx % 2 === 0 ? 'FFFFFF' : 'F9FAFB'
        const shade = { fill, type: ShadingType.CLEAR }
        const mkCell = (text, width) => new TableCell({
          children: [para([txt(text, { size: 18 })])],
          shading: shade,
          margins: { top: 60, bottom: 60, left: 140, right: 140 },
          width: { size: width, type: WidthType.DXA },
          borders: {
            top:    { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
            left:   { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
            right:  { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
          },
        })
        return new TableRow({
          children: [
            mkCell(row.time     || '', 1400),
            mkCell(row.activity || '', 3600),
            mkCell(row.location || '', 2800),
            mkCell(row.pax != null ? String(row.pax) : '', 1400),
          ],
        })
      }),
    ],
  }) : null

  // ─── Price Summary Table ───────────────────────────────────────────────────
  const priceRows = [
    [isDE ? 'Zwischentotal' : 'Subtotal', fmtCHF(subtotal), false],
    ...(surcharge > 0 ? [[isDE ? 'Agentur-Aufschlag' : 'Agency surcharge', fmtCHF(surcharge), false]] : []),
    [isDE ? 'GESAMTTOTAL (inkl. MWST)' : 'GRAND TOTAL (incl. VAT)', fmtCHF(total), true],
  ]

  const priceTable = new Table({
    width: { size: 5400, type: WidthType.DXA },
    columnWidths: [3600, 1800],
    rows: priceRows.map(([k, v, isLast]) => new TableRow({
      children: [
        new TableCell({
          children: [para([txt(k, { bold: isLast, size: isLast ? 20 : 18, color: isLast ? primaryHex : '333333' })])],
          shading: { fill: isLast ? 'F0F4F8' : 'F3F4F6', type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 140, right: 140 },
          borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' } },
        }),
        new TableCell({
          children: [para([txt(v, { bold: isLast, size: isLast ? 20 : 18, color: isLast ? primaryHex : '333333' })], { alignment: AlignmentType.RIGHT })],
          shading: { fill: isLast ? 'F0F4F8' : 'FFFFFF', type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 140, right: 140 },
          borders: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' } },
        }),
      ],
    })),
  })

  // ─── Payment Method Table (matches template format) ────────────────────────
  const isGesamtrechnung = !paymentType || paymentType === 'Gesamtrechnung'
  const paymentTable = new Table({
    width: { size: 5400, type: WidthType.DXA },
    columnWidths: [2800, 1300, 1300],
    rows: [
      new TableRow({
        children: [
          headerCell(isDE ? 'Leistung'           : 'Service',          primaryHex),
          headerCell(isDE ? 'Gesamtrechnung'     : 'Full invoice',     primaryHex),
          headerCell('payself',                                         primaryHex),
        ],
        tableHeader: true,
      }),
      new TableRow({
        children: [
          dataCell(isDE ? 'Seminarpauschale' : 'Seminar fee'),
          dataCell(isGesamtrechnung ? '✓' : '', { alignment: AlignmentType.CENTER }),
          dataCell(!isGesamtrechnung ? '✓' : '', { alignment: AlignmentType.CENTER }),

        ],
      }),
      new TableRow({
        children: [
          dataCell(isDE ? 'Getränke zu den Mahlzeiten' : 'Beverages with meals'),
          dataCell('✓', { alignment: AlignmentType.CENTER }),
          dataCell('', { alignment: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          dataCell(isDE ? 'Extras' : 'Extras'),
          dataCell('', { alignment: AlignmentType.CENTER }),
          dataCell('✓', { alignment: AlignmentType.CENTER }),
        ],
      }),
    ],
  })

  // ─── AGB ──────────────────────────────────────────────────────────────────
  const agbRaw = template.agbText || [
    isDE ? 'Stornobedingungen:' : 'Cancellation Policy:',
    isDE ? '• 0–5 Tage vor dem Anlass: 100% des Offerten-Betrages'   : '• 0–5 days before the event: 100%',
    isDE ? '• 6–14 Tage vor dem Anlass: 75% des Offerten-Betrages'   : '• 6–14 days: 75%',
    isDE ? '• 15–30 Tage vor dem Anlass: 50% des Offerten-Betrages'  : '• 15–30 days: 50%',
    isDE ? '• 31–60 Tage vor dem Anlass: 20% des Offerten-Betrages'  : '• 31–60 days: 20%',
  ].join('\n')

  const agbParagraphs = agbRaw.split('\n').map((line, i) =>
    para([txt(line, { size: 16, bold: i === 0, color: '555555' })], { spacing: { before: 40 } })
  )

  // ─── Booking confirmation note ─────────────────────────────────────────────
  const bookingNoteMap = {
    de: 'Gerne buche ich das Seminar und bin mit den Allgemeinen Geschäftsbedingungen einverstanden.',
    en: 'I hereby confirm the booking and agree to the general terms and conditions.',
    fr: 'Je confirme la réservation et accepte les conditions générales.',
    es: 'Confirmo la reserva y acepto las condiciones generales.',
  }
  const bookingNote = bookingNoteMap[lang] ?? bookingNoteMap.de

  // ─── Document ─────────────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 20 } },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1200, bottom: 1200, left: 1300, right: 1300 },
        },
      },
      children: [

        // ── Hotel header bar ─────────────────────────────────────────────
        new Table({
          width: { size: TABLE_WIDTH, type: WidthType.DXA },
          columnWidths: logoData ? [2000, 7200] : [TABLE_WIDTH],
          borders: ALL_NONE,
          rows: [new TableRow({
            children: [
              ...(logoData ? [new TableCell({
                children: [new Paragraph({
                  children: [new ImageRun({
                    type: 'png',
                    data: logoData,
                    transformation: { width: 90, height: 60 },
                    altText: { title: 'Logo', description: 'Hotel Logo', name: 'Logo' },
                  })],
                })],
                borders: ALL_NONE,
                verticalAlign: 'center',
                width: { size: 2000, type: WidthType.DXA },
              })] : []),
              new TableCell({
                children: [
                  para([txt(hotelInfo?.name || '', { bold: true, size: 28, color: primaryHex })]),
                  para([txt(`${hotelInfo?.address || ''} | ${hotelInfo?.phone || ''} | ${hotelInfo?.email || ''}`, { size: 15, color: '777777' })]),
                ],
                borders: ALL_NONE,
                width: { size: logoData ? 7200 : TABLE_WIDTH, type: WidthType.DXA },
              }),
            ],
          })],
        }),

        hr(primaryHex),

        // ── Offer title ──────────────────────────────────────────────────
        para([txt(offerTitle, { bold: true, size: 30, color: primaryHex })], {
          spacing: { before: 160, after: 80 },
        }),

        // ── Greeting + intro ─────────────────────────────────────────────
        para([txt(greeting, { size: 22, bold: true })], { spacing: { before: 200, after: 80 } }),
        ...(introText ? [para([txt(introText, { size: 20 })], { spacing: { after: 200 } })] : []),

        // ── Contact & Event details ──────────────────────────────────────
        sectionTitle(isDE ? 'Kontaktdaten & Anlass' : 'Contact & Event Details', primaryColor),
        detailTable,

        // ── Services ─────────────────────────────────────────────────────
        sectionTitle(isDE ? 'Gewählte Leistungen' : 'Selected Services', primaryColor),
        servicesTable,
        para([txt(isDE ? 'Getränke zu den Mahlzeiten werden separat in Rechnung gestellt.' : 'Beverages with meals will be invoiced separately.', { size: 16, italics: true, color: '777777' })], { spacing: { before: 80 } }),

        // ── Schedule ─────────────────────────────────────────────────────
        ...(scheduleTable ? [
          sectionTitle(isDE ? 'Tagesablauf' : 'Schedule', primaryColor),
          scheduleTable,
        ] : []),

        // ── Special requests ─────────────────────────────────────────────
        ...(specialRequests ? [
          spacer(160),
          para([
            txt(isDE ? 'Besondere Wünsche: ' : 'Special requests: ', { bold: true, size: 18 }),
            txt(specialRequests, { size: 18, italics: true, color: '555555' }),
          ]),
        ] : []),

        // ── Price summary ─────────────────────────────────────────────────
        sectionTitle(isDE ? 'Preisübersicht' : 'Price Summary', primaryColor),
        priceTable,

        // ── Payment method ────────────────────────────────────────────────
        sectionTitle(isDE ? 'Verrechnung' : 'Payment Method', primaryColor),
        paymentTable,

        // ── Option date ───────────────────────────────────────────────────
        spacer(160),
        para([
          txt(isDE ? 'Optionsdatum: ' : 'Valid until: ', { bold: true, size: 18 }),
          txt(optionDate ? fmtDate(optionDate, lang) : '—', { size: 18 }),
        ]),

        // ── AGB ───────────────────────────────────────────────────────────
        spacer(200),
        hr(),
        para([txt(isDE ? 'Allgemeine Geschäftsbedingungen' : 'Terms & Conditions', { bold: true, size: 18, color: primaryHex })], { spacing: { before: 120, after: 60 } }),
        ...agbParagraphs,

        // ── Closing ───────────────────────────────────────────────────────
        spacer(240),
        hr(),
        para([txt(isDE ? 'Wir freuen uns, dich und dein Team bald bei uns begrüssen zu dürfen.' : 'We look forward to welcoming you and your team.', { size: 18 })], { spacing: { before: 160, after: 120 } }),
        para([txt(closing, { size: 18 })]),
        spacer(80),
        para([txt(sigName,  { size: 18, bold: true })]),
        ...(sigTitle ? [para([txt(sigTitle, { size: 17, color: '555555' })])] : []),
        ...(sigPhone ? [para([txt(sigPhone, { size: 17, color: '555555' })])] : []),
        ...(sigEmail ? [para([txt(sigEmail, { size: 17, color: '555555' })])] : []),

        // ── Signature block ───────────────────────────────────────────────
        spacer(320),
        hr(),
        para([txt(isDE ? 'Buchungsbestätigung' : 'Booking Confirmation', { bold: true, size: 20, color: primaryHex })], { spacing: { before: 120, after: 80 } }),
        para([txt(bookingNote, { size: 18 })], { spacing: { after: 320 } }),

        new Table({
          width: { size: TABLE_WIDTH, type: WidthType.DXA },
          columnWidths: [2900, 3100, 3200],
          borders: ALL_NONE,
          rows: [new TableRow({
            children: [
              new TableCell({
                children: [
                  para([txt('________________________', { size: 18 })]),
                  para([txt(isDE ? 'Ort, Datum' : 'Place, Date', { size: 15, color: '888888' })]),
                ],
                borders: ALL_NONE,
              }),
              new TableCell({
                children: [
                  para([txt('________________________', { size: 18 })]),
                  para([txt(isDE ? 'Unterschrift Auftraggeber' : 'Client Signature', { size: 15, color: '888888' })]),
                ],
                borders: ALL_NONE,
              }),
              new TableCell({
                children: [
                  para([txt('________________________', { size: 18 })]),
                  para([txt(isDE ? `Unterschrift ${hotelInfo?.name || ''}` : `${hotelInfo?.name || ''} Signature`, { size: 15, color: '888888' })]),
                ],
                borders: ALL_NONE,
              }),
            ],
          })],
        }),

        // ── Footer note ───────────────────────────────────────────────────
        spacer(300),
        para(
          [txt(`${hotelInfo?.name || ''} | ${hotelInfo?.address || ''} | ${hotelInfo?.phone || ''} | ${hotelInfo?.email || ''}`, { size: 14, color: 'AAAAAA' })],
          { alignment: AlignmentType.CENTER }
        ),
      ],
    }],
  })

  const blob    = await Packer.toBlob(doc)
  const name    = `${firstName || ''}_${lastName || ''}`.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
  const dateStr = eventDate ? eventDate.replace(/-/g, '') : 'oDatum'
  saveAs(blob, `Offerte_${name || 'Gast'}_${dateStr}.docx`)
}
