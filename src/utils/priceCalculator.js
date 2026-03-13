export function calcItemTotal(item, globalPax, globalDays) {
  if (!item.enabled) return 0
  const pax  = item.paxOverride  ?? globalPax  ?? 0
  const days = item.quantityOverride ?? globalDays ?? 1

  switch (item.type) {
    case 'per_person_per_day':
      return item.unitPrice * pax * days

    case 'per_person_per_day_min': {
      const perDay = item.unitPrice * pax
      const min    = item.minPrice ?? 0
      return Math.max(perDay, min) * days
    }

    case 'flat_per_day':
      return item.unitPrice * days

    case 'flat_per_unit':
      return item.unitPrice * (item.quantity ?? 1)

    case 'per_person':
      return item.unitPrice * pax

    case 'percentage':
      return 0 // handled separately

    default:
      return 0
  }
}

export function calcSubtotal(items, globalPax, globalDays) {
  return items
    .filter(i => i.enabled && i.type !== 'percentage')
    .reduce((sum, i) => sum + calcItemTotal(i, globalPax, globalDays), 0)
}

export function calcSurcharge(items, globalPax, globalDays) {
  const sub = calcSubtotal(items, globalPax, globalDays)
  const agency = items.find(i => i.id === 'agency_surcharge' && i.enabled)
  if (!agency) return 0
  return sub * (agency.unitPrice / 100)
}

export function calcTotal(items, globalPax, globalDays) {
  return calcSubtotal(items, globalPax, globalDays) + calcSurcharge(items, globalPax, globalDays)
}

export function fmtCHF(n) {
  if (typeof n !== 'number' || isNaN(n)) return '—'
  return 'CHF ' + n.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtDate(dateStr, lang = 'de') {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T12:00:00')
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'de-CH', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}
