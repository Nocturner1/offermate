import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle,
  ShadingType, Header, ImageRun,
} from 'docx'
import { saveAs } from 'file-saver'
import { calcItemTotal, calcSubtotal, calcSurcharge, calcTotal, fmtCHF, fmtDate } from './priceCalculator.js'
import { CATEGORY_LABELS } from './defaults.js'

const ALPINE_GREEN = '1e6f53'
const LIGHT_GREEN  = 'e8f4ef'
const GRAY         = 'f3f4f6'
const BORDER_NONE  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const ALL_NONE     = { top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_NONE }

function txt(text, opts = {}) {
  return new TextRun({ text: text ?? '', ...opts })
}

function cell(children, opts = {}) {
  const paragraphs = Array.isArray(children) ? children : [
    new Paragraph({ children: Array.isArray(children) ? children : [children] })
  ]
  return new TableCell({
    children: Array.isArray(paragraphs[0]) ? paragraphs : paragraphs,
    ...opts,
  })
}

function headerCell(text, shading = ALPINE_GREEN) {
  return new TableCell({
    children: [new Paragraph({
      children: [txt(text, { bold: true, color: 'FFFFFF', size: 18 })],
    })],
    shading: { fill: shading, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  })
}

function dataCell(text, opts = {}) {
  return new TableCell({
    children: [new Paragraph({
      children: [txt(String(text ?? ''), { size: 18, ...opts })],
    })],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
  })
}

function section(title) {
  return new Paragraph({
    children: [txt(title, { bold: true, size: 22, color: ALPINE_GREEN })],
    spacing: { before: 300, after: 100 },
  })
}

function hr() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'cccccc' } },
    spacing: { before: 100, after: 100 },
    children: [],
  })
}

export async function generateDocx(offer) {
  const {
    firstName, lastName, email, phone, company,
    eventTitle, eventDate, eventEndDate, numberOfDays, pax,
    billingAddress, invoiceEmail, paymentType, optionDate,
    language, isAgency, items, schedule, hotelInfo, specialRequests,
  } = offer

  const lang = language === 'en' ? 'en' : 'de'
  const isDE = lang === 'de'
  const gPax  = pax || 0
  const gDays = numberOfDays || 1

  const greetingMap = { de: `Hallo ${firstName || ''}`, en: `Dear ${firstName || ''},`, fr: `Bonjour ${firstName || ''},`, es: `Estimado/a ${firstName || ''},` }
  const greeting    = greetingMap[lang] ?? greetingMap.de
  const introText   = offer.introText || ''

  const subtotal  = calcSubtotal(items, gPax, gDays)
  const surcharge = calcSurcharge(items, gPax, gDays)
  const total     = calcTotal(items, gPax, gDays)

  const enabledItems = items.filter(i => i.enabled && i.type !== 'percentage')
  const agencyItem   = items.find(i => i.id === 'agency_surcharge' && i.enabled)

  // ─── Event Details Table ───
  const eventRows = [
    [isDE ? 'Anlass' : 'Event', eventTitle || '—'],
    [isDE ? 'Datum' : 'Date', eventDate ? fmtDate(eventDate, lang) + (eventEndDate ? ` – ${fmtDate(eventEndDate, lang)}` : '') : '—'],
    [isDE ? 'Anzahl Tage' : 'Days', String(numberOfDays || 1)],
    [isDE ? 'Anzahl Personen' : 'Persons', String(pax || '—')],
    [isDE ? 'Rechnungsadresse' : 'Billing Address', billingAddress || '—'],
    [isDE ? 'E-Mail Rechnung' : 'Invoice Email', invoiceEmail || email || '—'],
  ]

  const detailTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: eventRows.map(([k, v]) => new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [txt(k, { bold: true, size: 18 })] })],
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { fill: GRAY, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
        }),
        dataCell(v),
      ],
    })),
  })

  // ─── Services Table ───
  const serviceHeaderRow = new TableRow({
    children: [
      headerCell(isDE ? 'Leistung' : 'Service'),
      headerCell(isDE ? 'Einzelpreis' : 'Unit Price'),
      headerCell(isDE ? 'Menge/PAX' : 'Qty/PAX'),
      headerCell('Total CHF'),
    ],
    tableHeader: true,
  })

  const serviceRows = enabledItems.map((item, idx) => {
    const total = calcItemTotal(item, gPax, gDays)
    const effectivePax  = item.paxOverride ?? gPax
    const effectiveDays = item.quantityOverride ?? gDays

    let qtyLabel = ''
    switch (item.type) {
      case 'per_person_per_day':
      case 'per_person_per_day_min':
        qtyLabel = `${effectivePax} Pers. × ${effectiveDays} Tag(e)`
        break
      case 'flat_per_day':
        qtyLabel = `${effectiveDays} Tag(e)`
        break
      case 'flat_per_unit':
        qtyLabel = `${item.quantity ?? 1} Stück`
        break
      case 'per_person':
        qtyLabel = `${effectivePax} Pers.`
        break
    }

    const fill = idx % 2 === 0 ? 'FFFFFF' : 'f9fafb'
    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [txt(item.customName || item.name, { size: 18 })] })],
          shading: { fill, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
        }),
        dataCell(`${item.unitPrice.toFixed(2)} ${item.unit}`),
        dataCell(qtyLabel),
        dataCell(total.toFixed(2), { bold: true }),
      ],
    })
  })

  const servicesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [serviceHeaderRow, ...serviceRows],
  })

  // ─── Schedule Table ───
  const scheduleRows = schedule.length > 0 ? [
    new TableRow({
      children: [
        headerCell(isDE ? 'Zeit' : 'Time'),
        headerCell(isDE ? 'Was' : 'Activity'),
        headerCell(isDE ? 'Wo' : 'Location'),
        headerCell('PAX'),
      ],
      tableHeader: true,
    }),
    ...schedule.map((row, idx) => new TableRow({
      children: [
        dataCell(row.time),
        dataCell(row.activity),
        dataCell(row.location),
        dataCell(row.pax != null ? String(row.pax) : ''),
      ],
    })),
  ] : null

  // ─── Price Summary ───
  const priceRows = [
    [isDE ? 'Zwischentotal' : 'Subtotal', fmtCHF(subtotal)],
    ...(agencyItem ? [[`Agentur-Aufschlag ${agencyItem.unitPrice}%`, fmtCHF(surcharge)]] : []),
    [isDE ? 'GESAMTTOTAL (inkl. MWST)' : 'GRAND TOTAL (incl. VAT)', fmtCHF(total)],
  ]

  const priceTable = new Table({
    width: { size: 60, type: WidthType.PERCENTAGE },
    rows: priceRows.map(([k, v], idx) => {
      const isLast = idx === priceRows.length - 1
      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [txt(k, { bold: isLast, size: isLast ? 20 : 18, color: isLast ? ALPINE_GREEN : '000000' })] })],
            shading: { fill: isLast ? LIGHT_GREEN : GRAY, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [txt(v, { bold: isLast, size: isLast ? 20 : 18, color: isLast ? ALPINE_GREEN : '000000' })],
              alignment: AlignmentType.RIGHT,
            })],
            shading: { fill: isLast ? LIGHT_GREEN : 'FFFFFF', type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
          }),
        ],
      })
    }),
  })

  // ─── AGB ───
  const agbLines = isDE ? [
    'Stornobedingungen:',
    '• 0–5 Tage vor dem Anlass: 100% des Offerten-Betrages',
    '• 6–14 Tage vor dem Anlass: 75% des Offerten-Betrages',
    '• 15–30 Tage vor dem Anlass: 50% des Offerten-Betrages',
    '• 31–60 Tage vor dem Anlass: 20% des Offerten-Betrages',
  ] : [
    'Cancellation Policy:',
    '• 0–5 days before the event: 100% of the offer amount',
    '• 6–14 days before the event: 75% of the offer amount',
    '• 15–30 days before the event: 50% of the offer amount',
    '• 31–60 days before the event: 20% of the offer amount',
  ]

  // ─── Document ───
  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 } },
      },
      children: [
        // Header: Hotel name
        new Paragraph({
          children: [txt(hotelInfo.name, { bold: true, size: 28, color: ALPINE_GREEN })],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [txt(`${hotelInfo.address} | ${hotelInfo.phone} | ${hotelInfo.email}`, { size: 16, color: '666666' })],
        }),
        hr(),

        // Greeting
        new Paragraph({ children: [txt(greeting, { size: 24, bold: true })], spacing: { before: 200, after: 100 } }),
        new Paragraph({ children: [txt(introText, { size: 20 })], spacing: { after: 300 } }),

        // Event Details
        section(isDE ? 'Veranstaltungsdetails' : 'Event Details'),
        detailTable,

        // Services
        new Paragraph({ spacing: { before: 300, after: 100 }, children: [] }),
        section(isDE ? 'Gewählte Leistungen' : 'Selected Services'),
        servicesTable,

        // Schedule
        ...(scheduleRows ? [
          new Paragraph({ spacing: { before: 300, after: 100 }, children: [] }),
          section(isDE ? 'Tagesablauf' : 'Schedule'),
          new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: scheduleRows }),
        ] : []),

        // Special requests
        ...(specialRequests ? [
          new Paragraph({ spacing: { before: 200, after: 60 }, children: [] }),
          new Paragraph({ children: [txt(isDE ? `Besondere Wünsche: ${specialRequests}` : `Special requests: ${specialRequests}`, { size: 18, italics: true, color: '555555' })] }),
        ] : []),

        // Price summary
        new Paragraph({ spacing: { before: 300, after: 100 }, children: [] }),
        section(isDE ? 'Preisübersicht' : 'Price Summary'),
        priceTable,

        // Payment & Option
        new Paragraph({ spacing: { before: 300, after: 60 }, children: [] }),
        new Paragraph({ children: [txt(`${isDE ? 'Verrechnungsart' : 'Payment method'}: ${paymentType}`, { size: 18 })] }),
        new Paragraph({ children: [txt(`${isDE ? 'Diese Offerte ist gültig bis' : 'This offer is valid until'}: ${fmtDate(optionDate, lang)}`, { size: 18 })] }),

        // AGB
        new Paragraph({ spacing: { before: 300, after: 100 }, children: [] }),
        hr(),
        ...agbLines.map((line, i) => new Paragraph({
          children: [txt(line, { size: 16, bold: i === 0, color: '555555' })],
          spacing: { before: 40 },
        })),

        // Signature
        hr(),
        new Paragraph({ spacing: { before: 300 }, children: [] }),
        new Paragraph({ children: [txt(isDE ? 'Buchungsbestätigung' : 'Booking Confirmation', { bold: true, size: 20 })] }),
        new Paragraph({ children: [txt(isDE ? 'Mit meiner Unterschrift bestätige ich die Buchung sowie die AGB.' : 'By signing, I confirm the booking and the terms and conditions.', { size: 18 })] }),
        new Paragraph({ spacing: { before: 400 }, children: [] }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_NONE, insideH: BORDER_NONE, insideV: BORDER_NONE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({ children: [txt('________________________', { size: 18 })] }),
                    new Paragraph({ children: [txt(isDE ? 'Ort, Datum' : 'Place, Date', { size: 16, color: '888888' })] }),
                  ],
                  borders: ALL_NONE,
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [txt('________________________', { size: 18 })] }),
                    new Paragraph({ children: [txt(isDE ? 'Unterschrift Kunde' : 'Client Signature', { size: 16, color: '888888' })] }),
                  ],
                  borders: ALL_NONE,
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [txt('________________________', { size: 18 })] }),
                    new Paragraph({ children: [txt(isDE ? `Unterschrift ${hotelInfo.name}` : `${hotelInfo.name} Signature`, { size: 16, color: '888888' })] }),
                  ],
                  borders: ALL_NONE,
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ spacing: { before: 300 }, children: [] }),
        new Paragraph({
          children: [txt(`${hotelInfo.contactPerson} | ${hotelInfo.phone} | ${hotelInfo.email} | ${hotelInfo.website}`, { size: 14, color: '888888' })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  const safeName = (firstName || 'Offerte').replace(/[^a-zA-Z0-9]/g, '_')
  const dateStr  = eventDate ? eventDate.replace(/-/g, '') : 'oD'
  saveAs(blob, `Offerte_${safeName}_${dateStr}.docx`)
}
