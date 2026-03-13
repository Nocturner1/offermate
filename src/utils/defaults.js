// ─── Price Definitions ──────────────────────────────────────────────────────
export const PRICE_CATALOG = [
  // Räume
  { id: 'room_wattawis',    category: 'room',      name: 'Raum Wattawis',                         unitPrice: 38,   type: 'per_person_per_day_min', minPrice: 250, agencyUnitPrice: 42,  agencyMinPrice: 290, maxPax: 30, unit: 'p.P./Tag' },
  { id: 'room_weinkeller',  category: 'room',      name: 'Weinkeller',                             unitPrice: 150,  type: 'flat_per_day',           agencyUnitPrice: 170,                    maxPax: 8,  unit: '/Tag' },
  { id: 'room_buero',       category: 'room',      name: 'Kleines Büro',                           unitPrice: 100,  type: 'flat_per_day',           agencyUnitPrice: 120,                                unit: '/Tag' },
  { id: 'overnight_classic',category: 'overnight', name: 'Übernachtung DZ Classic',                unitPrice: 150,  type: 'per_person',             unit: 'p.P./Nacht' },
  { id: 'overnight_premium',category: 'overnight', name: 'Übernachtung DZ Premium',                unitPrice: 180,  type: 'per_person',             unit: 'p.P./Nacht' },
  { id: 'welcome_coffee',   category: 'fb',        name: 'Begrüssungskaffee + Gipfeli',            unitPrice: 6.50, type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'lunch_veg',        category: 'fb',        name: 'Lunch 2-Gang vegetarisch',               unitPrice: 30,   type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'lunch_meat',       category: 'fb',        name: 'Fleischoption Lunch (+)',                unitPrice: 8,    type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'lunch_flammi',     category: 'fb',        name: 'Lunch Kleingruppe Flammi + kalte Platte',unitPrice: 20,   type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'lunch_sandwich',   category: 'fb',        name: 'Lunch Kleingruppe Sandwich + Suppe',    unitPrice: 18,   type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'lunch_dessert',    category: 'fb',        name: 'Dessert zum Lunch',                      unitPrice: 6,    type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'dinner',           category: 'fb',        name: 'Dinner 3-Gang',                          unitPrice: 65,   type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'dinner_4gang',     category: 'fb',        name: 'Dinner 4-Gang',                          unitPrice: 75,   type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'schokokick',       category: 'fb',        name: 'Schokokick (Balistoriegel)',              unitPrice: 15,   type: 'flat_per_day',           unit: '/Schüssel' },
  { id: 'coffee_break_1',   category: 'fb',        name: 'Kaffeepause 1x',                         unitPrice: 17,   type: 'per_person_per_day',     agencyUnitPrice: 19, unit: 'p.P.' },
  { id: 'coffee_break_2',   category: 'fb',        name: 'Kaffeepause 2x',                         unitPrice: 34,   type: 'per_person_per_day',     agencyUnitPrice: 38, unit: 'p.P.' },
  { id: 'smoothie',         category: 'fb',        name: 'Smoothie zur Kaffeepause',               unitPrice: 4,    type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'aperitif',         category: 'fb',        name: 'Hausapéro',                              unitPrice: 14,   type: 'per_person_per_day',     unit: 'p.P.' },
  { id: 'pinboard',         category: 'equipment', name: 'Zusätzliche Pinnwand/Flipchart',         unitPrice: 30,   type: 'flat_per_unit',          unit: '/Stück' },
  { id: 'microphone',       category: 'equipment', name: 'Mikrophon',                              unitPrice: 150,  type: 'flat_per_day',           unit: '/Tag' },
  { id: 'conference_tech',  category: 'equipment', name: 'Konferenz-Technik (Webcam + 3 Mikro)',  unitPrice: 350,  type: 'flat_per_day',           unit: '/Tag' },
]

export const CATEGORY_LABELS = {
  room:      'Räume',
  overnight: 'Übernachtung',
  fb:        'Verpflegung',
  equipment: 'Technik & Equipment',
}

// ─── Default AGB text ─────────────────────────────────────────────────────
export const DEFAULT_AGB = `Stornobedingungen:
• 0–5 Tage vor dem Anlass: 100% des Offerten-Betrages
• 6–14 Tage vor dem Anlass: 75% des Offerten-Betrages
• 15–30 Tage vor dem Anlass: 50% des Offerten-Betrages
• 31–60 Tage vor dem Anlass: 20% des Offerten-Betrages

Mit der Buchungsbestätigung werden die Allgemeinen Geschäftsbedingungen des Hotels akzeptiert.`

// ─── Hotel template ───────────────────────────────────────────────────────
export const DEFAULT_TEMPLATE = {
  primaryColor:   '#2D5016',
  greeting:       'du',          // 'du' | 'Sie'
  signatureName:  '',
  signatureTitle: 'Seminarberatung',
  signaturePhone: '',
  signatureEmail: '',
  agbText:        DEFAULT_AGB,
  headerImage:    null,          // base64 data-URL
}

// ─── Multi-Hotel ──────────────────────────────────────────────────────────
export function createNewHotel(partial = {}) {
  return {
    id:            `hotel_${Date.now()}`,
    name:          '',
    address:       '',
    phone:         '',
    email:         '',
    website:       '',
    contactPerson: '',
    logo:          null,
    prices:        {},
    notes:         '',
    template:      { ...DEFAULT_TEMPLATE },
    ...partial,
  }
}

export const DEFAULT_HOTELS = [
  createNewHotel({
    id:            'hotel_alpenblick',
    name:          'Hotel Alpenblick Weggis',
    address:       'Luzernerstrasse 31, 6353 Weggis',
    phone:         '041 399 05 05',
    email:         'info@alpenblick-weggis.ch',
    website:       'alpenblick-weggis.ch',
    contactPerson: 'Team Alpenblick',
    notes: `ZIMMER (30 Zimmer, 52 Betten):
• EZ Dorfblick (102,115,202,215): ab CHF 79, 90cm Bett, kein Balkon
• EZ Seeblick (103,114,203,214): ab CHF 99, 140cm Bett, Balkon
• DZ Dorfblick (101,201): ab CHF 159, Kingsize, kein Balkon
• DZ Classic Seeblick (104,113,204,213,109-112): ab CHF 189, Balkon
• DZ Premium Seeblick (105-108,205-212): ab CHF 219, Balkon, Alpenchic
Inkl.: TV, Kühlschrank, Wasserkocher, Kaffeemaschine, Tiefgarage
Frühstück: CHF 20 p.P. | Kurtaxe: CHF 3.50 p.P.
Max. 4 Zustellbetten + 4 Babybetten im Haus

SEMINARRÄUME:
• Wattawis (96m²): U-Form 26 PAX / Seminar 46 PAX
• Weinkeller (38m²): max. 8 PAX Blocktisch
• Kleines Büro (16m²): max. 4 PAX
• Lokale Vereine (Weggis/Greppen/Vitznau): kostenlos, nur Konsumationen

WICHTIGE REGELN:
• Wattawis ohne Raumpauschale = Raum nicht garantiert
• Frühstück Restaurant: Mo–Sa 07:00–10:00, Sa+So ab 07:30
• Hallenbad: 07:00–21:30 (Mi Reinigung)
• Kein Rollstuhl-Hotel (ausser Zimmer 109–112)
• Klimaanlage: keine, nur Ventilatoren
• Gruppenpreise und Spezialfälle: nur mit Karin oder Marco

EXTRAS:
• Sauna: CHF 10 p.P.
• E-Bike Halbtag: CHF 39 / Ganztag: CHF 55
• Bootsrundfahrt 2 PAX: CHF 160 / 4 PAX: CHF 200
• Segeln 1h: CHF 160
• Wellness Rigi Kaltbad: CHF 88 p.P.
• Taxi Steiner: 041 390 15 33

GRUPPENERLEBNISSE (inkl. Apéro + 3-Gang-Nachtessen):
• Staatsgeheimnis (4–24 PAX): CHF 109 p.P.
• Manuskript (20–60 PAX): CHF 132 p.P.
• Krimi Zimmer Tatort (10–45 PAX): CHF 139 p.P.
• Die Verschwörung (20–40 PAX): CHF 126 p.P.
• Fondue-Variante: CHF 3–6 günstiger je Erlebnis
• Übernachtung bei Erlebnissen: DZ CHF 160 / EZ CHF 99

HOCHZEITEN:
• Wattawis: 50 PAX sitzend / 80 PAX stehend, Musik bis 23:00
• Restaurant: 80 PAX sitzend, Musik bis 02:00
• Terrasse: 70 PAX sitzend / 100 PAX stehend, bis 22:30
• Freie Trauung: CHF 600 | Mindestkonsumation exklusiv: CHF 8'500
• Eventpauschale: CHF 800 einmalig | Verlängerung ab 00:00: CHF 375/h

PACKAGES (je 2 PAX):
• Romantik + Wellness Rigi Kaltbad: CHF 449
• Seebrise + Bootsrundfahrt: CHF 399
• Fondue Plausch: CHF 199
• Wellness-Hopping 2 Nächte: CHF 689
• Candlelight-Dinner Weinkeller: CHF 140 p.P.

STORNIERUNG HOTEL:
• Non Ref (Booking/SimpleBooking): keine Rückerstattung
• Normal bis 3 Tage vor Anreise: keine Rückerstattung
• Normal ab 4 Tage vor Anreise: volle Rückerstattung`,
    template: { ...DEFAULT_TEMPLATE, signatureTitle: 'Hotel Alpenblick Weggis', signatureEmail: 'info@alpenblick-weggis.ch', signaturePhone: '041 399 05 05' },
  }),
  createNewHotel({
    id:            'hotel_wetterhorn',
    name:          'Wetterhorn Hasliberg',
    address:       'Goldern 23, 6083 Hasliberg',
    phone:         '+41 33 972 90 90',
    email:         'info@wetterhorn-hasliberg.ch',
    website:       'www.wetterhorn-hasliberg.ch',
    contactPerson: 'Team Wetterhorn',
    template: { ...DEFAULT_TEMPLATE, signatureTitle: 'Wetterhorn Hasliberg', signatureEmail: 'info@wetterhorn-hasliberg.ch', signaturePhone: '+41 33 972 90 90' },
  }),
  createNewHotel({
    id:            'hotel_3koenige',
    name:          '3 Könige Entlebuch',
    address:       'Hauptstrasse 12, 6170 Schüpfheim',
    phone:         '+41 41 485 70 70',
    email:         'info@3koenige-entlebuch.ch',
    website:       'www.3koenige-entlebuch.ch',
    contactPerson: 'Team 3 Könige',
    template: { ...DEFAULT_TEMPLATE, signatureTitle: '3 Könige Entlebuch', signatureEmail: 'info@3koenige-entlebuch.ch', signaturePhone: '+41 41 485 70 70' },
  }),
]

export function hotelToInfo(hotel) {
  return {
    name:          hotel.name,
    address:       hotel.address,
    phone:         hotel.phone,
    email:         hotel.email,
    website:       hotel.website,
    contactPerson: hotel.contactPerson,
    logo:          hotel.logo ?? null,
    notes:         hotel.notes ?? '',
    template:      hotel.template ?? { ...DEFAULT_TEMPLATE },
  }
}

// ─── Items ────────────────────────────────────────────────────────────────
export function buildItems(customPrices = {}) {
  return PRICE_CATALOG.map(def => ({
    ...def,
    unitPrice:        customPrices[def.id]?.unitPrice       ?? def.unitPrice,
    minPrice:         customPrices[def.id]?.minPrice        ?? def.minPrice,
    agencyUnitPrice:  customPrices[def.id]?.agencyUnitPrice ?? def.agencyUnitPrice,
    agencyMinPrice:   customPrices[def.id]?.agencyMinPrice  ?? def.agencyMinPrice,
    enabled:          false,
    quantityOverride: null,
    paxOverride:      null,
    quantity:         1,
    customName:       null,
  }))
}

export function applyDetectedServices(items, requestedIds) {
  return items.map(item => ({ ...item, enabled: requestedIds.includes(item.id) }))
}

export function getOptionDate() {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().split('T')[0]
}

export const EMPTY_SCHEDULE_ROW = () => ({
  id:       crypto.randomUUID(),
  time:     '',
  activity: '',
  location: '',
  pax:      null,
})

// Keep for backward-compat
export const DEFAULT_HOTEL_INFO = {
  name:          'Hotel Alpenblick Weggis',
  address:       'Seestrasse 3, 6353 Weggis',
  phone:         '+41 41 390 11 61',
  email:         'info@alpenblick-weggis.ch',
  website:       'www.alpenblick-weggis.ch',
  contactPerson: 'Team Alpenblick',
  template:      { ...DEFAULT_TEMPLATE },
}
