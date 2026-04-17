export function calcItemTotal(item, globalPax, globalDays, isAgency = false) {
  if (!item.enabled) return 0
  const pax  = item.paxOverride      ?? globalPax  ?? 0
  const days = item.quantityOverride ?? globalDays ?? 1

  // Use agency-specific prices when isAgency=true and they exist on the item
  const unitPrice = (isAgency && item.agencyUnitPrice != null) ? item.agencyUnitPrice : item.unitPrice
  const minPrice  = (isAgency && item.agencyMinPrice  != null) ? item.agencyMinPrice  : (item.minPrice ?? 0)

  switch (item.type) {
    case 'per_person_per_day':
      return unitPrice * pax * days

    case 'per_person_per_day_min': {
      const perDay = unitPrice * pax
      return Math.max(perDay, minPrice) * days
    }

    case 'flat_per_day':
      return unitPrice * days

    case 'flat_per_unit':
      return unitPrice * (item.quantity ?? 1)

    case 'per_person':
      return unitPrice * pax

    case 'percentage':
      return 0 // legacy: handled by calcSurcharge for old stored offers

    default:
      return 0
  }
}

export function calcSubtotal(items, globalPax, globalDays, isAgency = false) {
  return items
    .filter(i => i.enabled && i.type !== 'percentage')
    .reduce((sum, i) => sum + calcItemTotal(i, globalPax, globalDays, isAgency), 0)
}

// Kept for backward compat — legacy stored offers may still have agency_surcharge item
export function calcSurcharge(items, globalPax, globalDays, isAgency = false) {
  const sub    = calcSubtotal(items, globalPax, globalDays, isAgency)
  const agency = items.find(i => i.id === 'agency_surcharge' && i.enabled)
  if (!agency) return 0
  return sub * (agency.unitPrice / 100)
}

export function calcTotal(items, globalPax, globalDays, isAgency = false) {
  return calcSubtotal(items, globalPax, globalDays, isAgency)
       + calcSurcharge(items, globalPax, globalDays, isAgency)
}

export function fmtCHF(n) {
  if (typeof n !== 'number' || isNaN(n)) return '—'
  return 'CHF ' + n.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtDate(dateStr, lang = 'de') {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T12:00:00')
  if (isNaN(d)) return dateStr
  if (lang === 'en') {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}
