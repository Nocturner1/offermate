// ─── Price Definitions ──────────────────────────────────────────────────────
export const PRICE_CATALOG = [
  // Räume
  { id: 'room_wattawis',    category: 'room',      name: 'Raum Wattawis',                         unitPrice: 38,   type: 'per_person_per_day_min', minPrice: 250, agencyUnitPrice: 42,  agencyMinPrice: 290, maxPax: 30, unit: 'p.P./Tag' },
  { id: 'room_weinkeller',  category: 'room',      name: 'Weinkeller',                             unitPrice: 150,  type: 'flat_per_day',           agencyUnitPrice: 170,                    maxPax: 8,  unit: '/Tag' },
  { id: 'room_buero',       category: 'room',      name: 'Kleines Büro',                           unitPrice: 100,  type: 'flat_per_day',           agencyUnitPrice: 120,                                unit: '/Tag' },
  { id: 'overnight_classic',   category: 'overnight', name: 'Übernachtung DZ Classic',             unitPrice: 150, type: 'per_person_per_day', unit: 'p.P./Nacht' },
  { id: 'overnight_premium',   category: 'overnight', name: 'Übernachtung DZ Premium',             unitPrice: 180, type: 'per_person_per_day', unit: 'p.P./Nacht' },
  { id: 'overnight_peak',      category: 'overnight', name: 'Übernachtung DZ (Peak-Saison)',       unitPrice: 200, type: 'per_person_per_day', unit: 'p.P./Nacht' },
  { id: 'overnight_ez',        category: 'overnight', name: 'Übernachtung Einzelzimmer',           unitPrice: 89,  type: 'per_person_per_day', unit: 'p.P./Nacht' },
  { id: 'overnight_comfort',   category: 'overnight', name: 'Übernachtung DZ Comfort',             unitPrice: 179, type: 'per_person_per_day', unit: 'p.P./Nacht' },
  { id: 'overnight_nostalgie', category: 'overnight', name: 'Übernachtung Nostalgie',              unitPrice: 159, type: 'per_person_per_day', unit: 'p.P./Nacht' },
  { id: 'overnight_suite',     category: 'overnight', name: 'Übernachtung Suite',                  unitPrice: 209, type: 'per_person_per_day', unit: 'p.P./Nacht' },
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
    logo:          '/logo-alpenblick.png',
    calendarRooms: [
      { id: 'room_wattawis',   short: 'Wattawis'   },
      { id: 'room_weinkeller', short: 'Weinkeller' },
      { id: 'room_buero',      short: 'Büro'       },
    ],
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
    template: { ...DEFAULT_TEMPLATE, primaryColor: '#8A1228', signatureTitle: 'Hotel Alpenblick Weggis', signatureEmail: 'info@alpenblick-weggis.ch', signaturePhone: '041 399 05 05' },
  }),
  createNewHotel({
    id:            'hotel_wetterhorn',
    name:          'Wetterhorn Hasliberg',
    address:       'Goldern 23, 6083 Hasliberg',
    phone:         '+41 33 972 90 90',
    email:         'info@wetterhorn-hasliberg.ch',
    website:       'www.wetterhorn-hasliberg.ch',
    contactPerson: 'Team Wetterhorn',
    logo:          '/logo-wetterhorn.png',
    calendarRooms: [
      { id: 'room_wattawis',   short: 'Wattawis'   },
      { id: 'room_weinkeller', short: 'Weinkeller' },
      { id: 'room_buero',      short: 'Büro'       },
    ],
    template: { ...DEFAULT_TEMPLATE, signatureTitle: 'Wetterhorn Hasliberg', signatureEmail: 'info@wetterhorn-hasliberg.ch', signaturePhone: '+41 33 972 90 90' },
  }),
  createNewHotel({
    id:            'hotel_3koenige',
    name:          'Landgasthof Drei Könige',
    address:       'Dorf 27, 6162 Entlebuch',
    phone:         '+41 41 480 12 27',
    email:         'info@3koenige-entlebuch.ch',
    website:       'www.3koenige-entlebuch.ch',
    contactPerson: 'Team Drei Könige',
    logo:          '/logo-dreikoenige.png',
    calendarRooms: [
      { id: 'room_wattawis',   short: 'Saal'    },
      { id: 'room_weinkeller', short: 'Separee' },
      { id: 'room_buero',      short: 'Meeting' },
    ],
    prices: {
      room_wattawis:    { customName: 'Drei Könige Saal (270m²)' },
      room_weinkeller:  { customName: 'Separee (Kleingruppen bis 8 PAX)' },
      room_buero:       { customName: 'Kleines Meetingzimmer' },
      overnight_classic:   { unitPrice: 99,  customName: 'DZ zur Einzelnutzung inkl. Frühstück (Nov–Apr)' },
      overnight_premium:   { unitPrice: 119, customName: 'DZ zur Einzelnutzung inkl. Frühstück (Mai–Okt)' },
      overnight_peak:      { unitPrice: 139, customName: 'DZ zur Einzelnutzung inkl. Frühstück (Jul–Aug)' },
      overnight_ez:        { unitPrice: 89,  customName: 'Einzelzimmer inkl. Frühstück' },
      overnight_comfort:   { unitPrice: 179, customName: 'Doppelzimmer Comfort inkl. Frühstück' },
      overnight_nostalgie: { unitPrice: 159, customName: 'Nostalgie-Zimmer inkl. Frühstück' },
      overnight_suite:     { unitPrice: 209, customName: 'Suite inkl. Frühstück' },
      welcome_coffee:   { customName: 'Begrüssungskaffee & Gipfeli' },
      lunch_veg:        { customName: 'Lunch 2-Gang (Vegi oder Fleisch)' },
      lunch_meat:       { unitPrice: 0, customName: 'Fleischoption (im Lunch-Preis inkl.)' },
      lunch_flammi:     { unitPrice: 54, customName: 'Abendessen Pizzeria Da Schibi 3-Gang' },
      lunch_sandwich:   { unitPrice: 65, customName: 'Abendessen Pizzeria Da Schibi 4-Gang' },
      lunch_dessert:    { customName: 'Dessert zum Lunch' },
      dinner:           { unitPrice: 79, customName: 'Abendessen Biosphäre Restaurant 3-Gang' },
      dinner_4gang:     { unitPrice: 89, customName: 'Abendessen Biosphäre Restaurant 4-Gang' },
      schokokick:       { customName: 'Nervennahrung im Raum (Schüssel)' },
      coffee_break_1:   { customName: '1× Kaffeepause inkl. Snacks' },
      coffee_break_2:   { customName: '2× Kaffeepausen inkl. Snacks' },
      smoothie:         { customName: 'Smoothie zur Kaffeepause' },
      aperitif:         { customName: 'Hausapéro' },
      pinboard:         { unitPrice: 30, customName: 'Zusätzliche Pinnwand / Whiteboard' },
      microphone:       { unitPrice: 30, customName: 'Mikrofon (zusätzlich)' },
      conference_tech:  { customName: 'Konferenz-Technik Set (Webcam + Mikros)' },
    },
    notes: `ALLGEMEIN (Landgasthof Drei Könige, Schüpfheim, Entlebuch):
• 22 Zimmer auf 2 Stockwerke, Frühstück 07:00–10:00 Uhr
• Parkplätze vor dem Haus (gelbe Felder 3K) oder Hinterhof
• Kein Rollstuhl-Hotel, keine Klimaanlage (nur Ventilatoren)
• Rezeption täglich ab 07:00 Uhr; Hinterhof-Code nach 23:00: 6162
• Max. 2 Zustellbetten + 2 Babybetten im Haus
• Hunde in einigen Zimmern erlaubt
• Taxi: Speedy Taxi 079 762 80 15
• Spezialfälle / Gruppen: nur in Absprache mit Mario & Mara

RESTAURANTS:
• Da Schibi (Pizzeria & Terrasse): FR, MO & DI 11:30–13:30 & ab 17:00; SA & SO ab 12:00; MI–DO geschlossen
• Kaspar (Gourmet Biosphäre Restaurant): FR–DI ab 17:00; MI–DO geschlossen
• Werkstatt: momentan nur als Eventlocation buchbar
• Warme Küche 11:30–21:00 Uhr; Nachmittagskarte 13:30–17:00 Uhr

ZIMMER:
• Doppelzimmer (Nr. 1,2,3,5,6,7,8,9,21,22): ab CHF 149, Twin- oder Boxspringbett, TV, Dusche, Haarföhn; Strassenseite: 1-3, Hinterhof: 5-9 & 21/22; 1-3 Pax (21&22: 1-2 Pax); Hunde erlaubt; Babybett möglich (ausser 21/22)
• Doppelzimmer Comfort (Nr. 11,12,13): ab CHF 179, Boxspring, Sofabett, TV, Kaffeemaschine, Kühlschrank (ausser 12/13), Badewanne (ausser 12), Balkon (ausser 11); 1-4 Pax
• Einzelzimmer (Nr. 4,10,14,18,19): ab CHF 89; 90cm Boxspring (Nr. 14: 140cm), TV, Dusche; kein Balkon; 19 = kleinstes Zimmer mit Dachfenster; 18 hat fixes Zustellbett (1-2 Pax)
• Suite (Nr. 20): ab CHF 209, Küche, Kühlschrank, Kaffeemaschine, Boxspringbett, Sofabett, 2 Balkone, Hinterhof; 1-4 Pax
• Nostalgie (Nr. 15,16,17): ab CHF 159; 17: Doppelbett; 15&16: 2x Einzelbett, Gemeinschaftsbad, kein TV, kein Zustellbett möglich; 1-2 Pax
• Frühstück: CHF 20 p.P. | Kurtaxe: CHF 1.20 (EZ) / CHF 2.40 (DZ) p.P.
• Zustellbett: CHF 50 | Haustier: CHF 15

ZIMMERPREISE nach Saison:
• EZ: ab CHF 89 | DZ: ab CHF 149 | DZ Comfort: ab CHF 179 | Nostalgie: ab CHF 159 | Suite: ab CHF 209

FIRMENRATEN (Code: 3Koenige):
• Elektrisola, Almatec, B. Braun Medical, Arag Bau: EZ CHF 95 / DZ CHF 125 / DZ zur EZ CHF 115

SEMINAR – DREI KÖNIGE SAAL (270m²):
• Kapazität: U-Form 40/60 PAX | Blocktisch 20-120 PAX | Parlament 60 | Konzert 180 | Ab 11 Personen Saalbuchung
• Infrastruktur inklusive: Moving Walls, Flipchart mit Papier & Stiften, Moderationskoffer, kabellose Mikrofone, Pinnwand, Beamer, grosse Leinwand, Soundanlage, Kaffeemaschine, WLAN, Studentenfutter, Früchtekorb, Block & Kugelschreiber, HDMI-Adapter; Saal abdunkelbar
• Moving Walls: Saal in separate Arbeitsbereiche unterteilbar (z.B. Plenum + Gruppenräume)
• Sitzungen lokaler Vereine aus Entlebuch: kostenlos (Separee), nur Konsumationen

SEMINARPREISE (Standardkunde):
• Seminarpauschale (inkl. Grundausstattung): CHF 38 p.P./Tag
• Begrüssungskaffee mit Gipfeli: CHF 6.50 p.P.
• 1x Kaffeepause inkl. Snacks: CHF 17 p.P.
• 2x Kaffeepausen inkl. Snacks: CHF 34 p.P.
• Smoothie bei Kaffeepause: CHF 4 p.P.
• Lunch 2-Gang (Vegi oder Fleisch): CHF 30 p.P.
• Dessert zum Lunch: CHF 6 p.P.
• Abendessen Biosphäre Restaurant 3-Gang: CHF 79 p.P.
• Abendessen Biosphäre Restaurant 4-Gang: CHF 89 p.P.
• Abendessen Pizzeria Da Schibi 3-Gang: CHF 54 p.P.
• Abendessen Pizzeria Da Schibi 4-Gang: CHF 65 p.P.
• Flipchart / Pinnwand / Whiteboard: CHF 30 p.Stück
• Mikrofon (zusätzlich): CHF 30 p.Stück
• Früchtekorb: CHF 10 p.Stück

SEMINAR-PAKETE (Standardkunde, inkl. Seminarpauschale):
• 3 Könige herzhaft Tag 1: CHF 80 p.P. (Kaffeemaschine, Gipfeli, Nervennahrung, Obstkorb, 1x Kaffeepause am Nachmittag, 2-Gang Lunch)
• 3 Könige herzhaft Tag 2: CHF 74 p.P. (Kaffeemaschine, Nervennahrung, Obstkorb, 1x Kaffeepause am Nachmittag, 2-Gang Lunch)

SEMINARPREISE (Agentur-Aufschlag):
• Seminarpauschale: CHF 42 p.P./Tag
• 3 Könige einfach (Kaffeemaschine, Gipfeli, Nervennahrung): CHF 29 p.P.
• 3 Könige Sinnvoll (+ Obstkorb, 2-Gang Lunch): CHF 69 p.P.
• 3 Könige herzhaft (+ Obstkorb, 2x Pausenstärkung, 2-Gang Lunch): CHF 109 p.P.

ÜBERNACHTUNG (Seminar, p.P. inkl. Frühstück):
• Juli / August: CHF 139 | Mai–Oktober: CHF 119 | November–April: CHF 99

EXTRAS & ZUSÄTZE:
• Goldgräber-Erlebnis (01.04–15.10): CHF 50 p.P. (Kind bis 16J: CHF 30)
• Savurando (15.04–15.10): CHF 49 p.P.
• Geräucherter Heuschnaps 5dl: CHF 69 | Heuschnaps 5dl: CHF 45 | Heuschnaps 2dl: CHF 23 | Heushot 2cl: CHF 5 | Heuschnaps 3l: CHF 290 | Heuschnaps Box 5dl: CHF 95 | Heuschnaps Box 2dl: CHF 50
• Romantische Deko: kostenlos | Champagne 0.375l aufs Zimmer: CHF 35 | Pralinen: CHF 15

GRUPPENERLEBNISSE:
• Krimi Zimmer Tatort (10–60 PAX): Apéro + 3-Gang-Nachtessen CHF 125 / Salat-Pizza a discrétion CHF 115 (je p.P.)
• Manuskript (20–80 PAX): Apéro + 3-Gang CHF 120 / Salat-Pizza CHF 99 (je p.P.)
• Aheu, Schnaps! – Heuschnapsdegustation (ab 10 PAX): Degustation + Apéro + 3-Gang Nachtessen CHF 150 p.P.

HOCHZEITEN:
• Restaurant Kaspar: 70 PAX (inkl. Separee), Audio, Musik bis 23:00, Mindestkonsumation CHF 50 p.P.
• Drei Könige Saal: 200 PAX (Tafeln) / 160 (Blöcke), Audio, Bar, Beamer, Bühne, Moving Walls
• Mindestkonsumation Restaurant exklusiv: CHF 4'500
• Verlängerung ab 00:00 bis max. 03:00: CHF 150/h
• Eventpauschale (Admin, Probeessen max. 4 PAX, Vorbereitung, Support): CHF 450 einmalig
• Weisse Tischdecken: CHF 1.50 p.P. | Zapfengeld Wein 75cl: CHF 35 / 150cl: CHF 65
• Champagner 75cl: CHF 55 | Spirituosen 75cl: CHF 60 | Schnittgeld Torte: CHF 2 p.P.
• Zimmer für Hochzeiten: 13 Zimmer / 24 Betten; EZ inkl. Frühstück: CHF 89 / DZ inkl. Frühstück: CHF 139

STORNOBEDINGUNGEN SEMINAR:
• 0–5 Tage vor Termin: 100% gemäss Auftragsbestätigung
• 6–14 Tage: 75% | 15–30 Tage: 50% | 31–60 Tage: 20%
• Bei Durchführung durch Dritte im selben Zeitraum: 10–30% Umtriebsentschädigung
• Führt Gast innerhalb des Jahres eine gleichwertige Veranstaltung durch: 50% Gutschrift

STORNIERUNGEN HOTEL:
• Booking.com / SimpleBooking Non Ref: keine Rückerstattung
• Normal bis 3 Tage vor Anreise: keine Rückerstattung
• Normal ab 4 Tage vor Anreise: volle Rückerstattung`,
    template: {
      ...DEFAULT_TEMPLATE,
      primaryColor:   '#8B1A1A',
      greeting:       'du',
      signatureTitle: 'Seminarberatung Landgasthof Drei Könige',
      signatureEmail: 'info@3koenige-entlebuch.ch',
      signaturePhone: '+41 41 480 12 27',
      agbText: `Stornobedingungen Seminar:
• 0–5 Tage vor dem Termin: 100% gemäss Auftragsbestätigung
• 6–14 Tage vor dem Termin: 75% gemäss Auftragsbestätigung
• 15–30 Tage vor dem Termin: 50% gemäss Auftragsbestätigung
• 31–60 Tage vor dem Termin: 20% gemäss Auftragsbestätigung

Im Falle der Durchführung einer gleichwertigen Veranstaltung durch Dritte während des vereinbarten Zeitraums entsteht dem Gast lediglich eine Umtriebs-Entschädigung von 10–30% (je nach Fristigkeit der Annullierung).

Führt der Gast innerhalb des Jahres eine Veranstaltung im ursprünglich vereinbarten Umfang im Hotel/Restaurant durch, so werden 50% des verbuchten Rechnungsbetrages/Annullierungskosten wieder gutgeschrieben.

Alle Preise verstehen sich inkl. MWST. Die Währung ist Schweizer Franken.

Mit der Buchungsbestätigung werden die Allgemeinen Geschäftsbedingungen des Landgasthofs Drei Könige akzeptiert.`,
    },
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
    customName:       customPrices[def.id]?.customName ?? null,
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
