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
    id:            'hotel_3koenige',
    name:          'Landgasthof Drei Könige',
    address:       'Hauptstrasse 12, 6170 Schüpfheim',
    phone:         '+41 41 485 70 70',
    email:         'info@3koenige-entlebuch.ch',
    website:       'www.3koenige-entlebuch.ch',
    contactPerson: 'Team Drei Könige',
    logo:          'data:image/jpeg;base64,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',
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
