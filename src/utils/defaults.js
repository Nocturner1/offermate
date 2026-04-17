// ─── Price Definitions ──────────────────────────────────────────────────────
export const PRICE_CATALOG = [
  // Räume
  { id: 'room_wattawis',    category: 'room',      name: 'Raum Wattawis',                         unitPrice: 38,   type: 'per_person_per_day_min', minPrice: 250, agencyUnitPrice: 42,  agencyMinPrice: 290, maxPax: 30, unit: 'p.P./Tag' },
  { id: 'room_weinkeller',  category: 'room',      name: 'Weinkeller',                             unitPrice: 150,  type: 'flat_per_day',           agencyUnitPrice: 170,                    maxPax: 8,  unit: '/Tag' },
  { id: 'room_buero',       category: 'room',      name: 'Kleines Büro',                           unitPrice: 100,  type: 'flat_per_day',           agencyUnitPrice: 120,                                unit: '/Tag' },
  { id: 'overnight_classic',   category: 'overnight', name: 'Übernachtung DZ Classic',             unitPrice: 150, type: 'per_person', unit: 'p.P./Nacht' },
  { id: 'overnight_premium',   category: 'overnight', name: 'Übernachtung DZ Premium',             unitPrice: 180, type: 'per_person', unit: 'p.P./Nacht' },
  { id: 'overnight_peak',      category: 'overnight', name: 'Übernachtung DZ (Peak-Saison)',       unitPrice: 200, type: 'per_person', unit: 'p.P./Nacht' },
  { id: 'overnight_ez',        category: 'overnight', name: 'Übernachtung Einzelzimmer',           unitPrice: 89,  type: 'per_person', unit: 'p.P./Nacht' },
  { id: 'overnight_comfort',   category: 'overnight', name: 'Übernachtung DZ Comfort',             unitPrice: 179, type: 'per_person', unit: 'p.P./Nacht' },
  { id: 'overnight_nostalgie', category: 'overnight', name: 'Übernachtung Nostalgie',              unitPrice: 159, type: 'per_person', unit: 'p.P./Nacht' },
  { id: 'overnight_suite',     category: 'overnight', name: 'Übernachtung Suite',                  unitPrice: 209, type: 'per_person', unit: 'p.P./Nacht' },
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
    'data:image/png;base64,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',
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
      signaturePhone: '+41 41 485 70 70',
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
