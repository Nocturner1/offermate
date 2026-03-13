import { useState, useRef } from 'react'
import { PRICE_CATALOG, CATEGORY_LABELS, createNewHotel, DEFAULT_TEMPLATE, DEFAULT_AGB } from '../utils/defaults.js'

// ─── Template preview ─────────────────────────────────────────────────────
function TemplatePreview({ hotel }) {
  const t = hotel.template ?? DEFAULT_TEMPLATE
  const color = t.primaryColor || '#2D5016'
  const greeting = t.greeting === 'Sie' ? 'Guten Tag Max Mustermann,' : 'Hallo Max,'

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden text-xs">
      {/* Header image */}
      {t.headerImage && (
        <img src={t.headerImage} alt="Header" className="w-full h-16 object-cover" />
      )}
      {/* Hotel bar */}
      <div className="px-4 py-3 flex items-start justify-between" style={{ backgroundColor: color }}>
        <div>
          {hotel.logo
            ? <img src={hotel.logo} alt="" className="h-6 object-contain mb-1" />
            : <p className="font-bold text-white text-sm">{hotel.name || 'Hotelname'}</p>
          }
          <p className="text-white/70 text-xs">{hotel.address || 'Adresse'}</p>
        </div>
        <div className="text-right text-white/70 text-xs">
          <p className="text-white font-medium">Offerte</p>
          <p>{new Date().toLocaleDateString('de-CH')}</p>
        </div>
      </div>
      {/* Body preview */}
      <div className="px-4 py-3 bg-white space-y-2">
        <p className="font-semibold text-gray-800 text-xs">{greeting}</p>
        <p className="text-gray-500 text-xs italic">Herzlichen Dank für deine Seminaranfrage...</p>
        <div className="pt-2 border-t border-gray-100">
          {t.signatureName && <p className="font-medium text-gray-700">{t.signatureName}</p>}
          {t.signatureTitle && <p className="text-gray-500">{t.signatureTitle}</p>}
          {t.signaturePhone && <p className="text-gray-500">{t.signaturePhone}</p>}
          {t.signatureEmail && <p className="text-gray-500">{t.signatureEmail}</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Per-hotel price editor ───────────────────────────────────────────────
function HotelPrices({ hotel, onUpdateHotel }) {
  const prices = hotel.prices || {}
  const getPrice = (id, field) => prices[id]?.[field] ?? PRICE_CATALOG.find(p => p.id === id)?.[field]
  const setPrice = (id, field, value) =>
    onUpdateHotel(hotel.id, { prices: { ...prices, [id]: { ...prices[id], [field]: Number(value) } } })
  const reset = () => { if (confirm('Alle Preise zurücksetzen?')) onUpdateHotel(hotel.id, { prices: {} }) }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">Abweichungen vom Katalog werden amber markiert.</p>
        <button onClick={reset} className="text-xs text-red-500 hover:text-red-700 underline">Reset</button>
      </div>
      {Object.entries(CATEGORY_LABELS).map(([catId, catLabel]) => (
        <div key={catId}>
          <p className="section-title mb-2">{catLabel}</p>
          <div className="space-y-1">
            {PRICE_CATALOG.filter(p => p.category === catId).map(item => {
              const isCustom = !!prices[item.id]
              return (
                <div key={item.id} className={`px-2 py-1.5 rounded-lg ${isCustom ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-xs text-gray-700 truncate">{item.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-gray-400">CHF</span>
                      <input type="number" step="0.5" min="0"
                        value={getPrice(item.id, 'unitPrice') ?? item.unitPrice}
                        onChange={e => setPrice(item.id, 'unitPrice', e.target.value)}
                        className="input-field text-xs text-right" style={{ width: '5rem' }}/>
                      <span className="text-xs text-gray-400" style={{ minWidth: '3.5rem' }}>{item.unit}</span>
                    </div>
                    {item.minPrice !== undefined && (
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-gray-400">Min.</span>
                        <input type="number" step="10" min="0"
                          value={getPrice(item.id, 'minPrice') ?? item.minPrice}
                          onChange={e => setPrice(item.id, 'minPrice', e.target.value)}
                          className="input-field text-xs text-right" style={{ width: '5rem' }}/>
                      </div>
                    )}
                  </div>
                  {/* Agency price row */}
                  {item.agencyUnitPrice !== undefined && (
                    <div className="flex items-center gap-2 mt-1 pt-1 border-t border-dashed border-amber-200">
                      <span className="flex-1 text-xs text-amber-700 truncate">↳ Agentur</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-gray-400">CHF</span>
                        <input type="number" step="0.5" min="0"
                          value={getPrice(item.id, 'agencyUnitPrice') ?? item.agencyUnitPrice}
                          onChange={e => setPrice(item.id, 'agencyUnitPrice', e.target.value)}
                          className="input-field text-xs text-right bg-amber-50" style={{ width: '5rem' }}/>
                        <span className="text-xs text-gray-400" style={{ minWidth: '3.5rem' }}>{item.unit}</span>
                      </div>
                      {item.agencyMinPrice !== undefined && (
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-xs text-gray-400">Min.</span>
                          <input type="number" step="10" min="0"
                            value={getPrice(item.id, 'agencyMinPrice') ?? item.agencyMinPrice}
                            onChange={e => setPrice(item.id, 'agencyMinPrice', e.target.value)}
                            className="input-field text-xs text-right bg-amber-50" style={{ width: '5rem' }}/>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Hotel form ───────────────────────────────────────────────────────────
function HotelForm({ hotel, onUpdateHotel, onDelete, canDelete }) {
  const [section, setSection] = useState('info')
  const logoRef   = useRef(null)
  const headerRef = useRef(null)
  const update = patch => onUpdateHotel(hotel.id, patch)
  const updateTemplate = patch => update({ template: { ...(hotel.template ?? DEFAULT_TEMPLATE), ...patch } })
  const t = hotel.template ?? DEFAULT_TEMPLATE

  const handleLogo   = e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => update({ logo: ev.target.result }); r.readAsDataURL(f) }
  const handleHeader = e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => updateTemplate({ headerImage: ev.target.result }); r.readAsDataURL(f) }

  const SECTIONS = [['info','Infos & Logo'],['template','Template'],['prices','Preisliste']]

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Hotel card header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-200" style={{ backgroundColor: `${t.primaryColor}18` }}>
        {hotel.logo
          ? <img src={hotel.logo} alt="" className="h-8 w-14 object-contain rounded" />
          : <div className="h-8 w-14 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-400">Logo</span>
            </div>
        }
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{hotel.name || <span className="text-gray-400 italic">Neues Hotel</span>}</p>
          <p className="text-xs text-gray-400 truncate">{hotel.address || '—'}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: t.primaryColor }} title="Primärfarbe" />
          {canDelete && (
            <button onClick={() => { if (confirm(`"${hotel.name}" löschen?`)) onDelete(hotel.id) }} className="text-red-400 hover:text-red-600 p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {SECTIONS.map(([id, label]) => (
          <button key={id} onClick={() => setSection(id)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              section === id ? 'text-sg-700 border-b-2 border-sg-600 bg-sg-50' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white">

        {/* ── Info & Logo ── */}
        {section === 'info' && (
          <div className="space-y-3">
            {/* Logo */}
            <div>
              <label className="label">Logo</label>
              <div className="flex items-center gap-3">
                {hotel.logo
                  ? <img src={hotel.logo} alt="" className="h-12 max-w-32 object-contain rounded border border-gray-200 p-1" />
                  : <div className="h-12 w-20 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">kein Logo</div>
                }
                <div className="flex gap-2">
                  <button onClick={() => logoRef.current?.click()} className="btn-secondary text-xs py-1 px-2">{hotel.logo ? 'Ersetzen' : 'Hochladen'}</button>
                  {hotel.logo && <button onClick={() => update({ logo: null })} className="text-xs text-red-400 hover:text-red-600 underline">Entfernen</button>}
                </div>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </div>
            </div>
            {[
              ['name','Hotel-Name','Hotel Alpenblick Weggis'],
              ['address','Adresse','Luzernerstrasse 31, 6353 Weggis'],
              ['phone','Telefon','041 399 05 05'],
              ['email','E-Mail','info@hotel.ch'],
              ['website','Website','www.hotel.ch'],
              ['contactPerson','Kontaktperson','Team Alpenblick'],
            ].map(([key, label, placeholder]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input value={hotel[key] || ''} onChange={e => update({ [key]: e.target.value })} placeholder={placeholder} className="input-field text-sm"/>
              </div>
            ))}
            <div>
              <label className="label">Notizen / Hausinfos</label>
              <p className="text-xs text-gray-400 mb-1">Zimmer, Extras, Regeln, Pakete — Referenz für das Team.</p>
              <textarea
                value={hotel.notes || ''}
                onChange={e => update({ notes: e.target.value })}
                rows={8}
                placeholder="Zimmertypen, Extras, wichtige Regeln…"
                className="input-field text-xs font-mono resize-y"
              />
            </div>
          </div>
        )}

        {/* ── Template ── */}
        {section === 'template' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
              {/* Color */}
              <div>
                <label className="label">Primärfarbe</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={t.primaryColor || '#2D5016'} onChange={e => updateTemplate({ primaryColor: e.target.value })}
                    className="h-9 w-16 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"/>
                  <input value={t.primaryColor || '#2D5016'} onChange={e => updateTemplate({ primaryColor: e.target.value })}
                    placeholder="#2D5016" className="input-field w-32 font-mono text-sm uppercase"/>
                  <div className="flex gap-2">
                    {['#2D5016','#1a3a5c','#7c2d12','#1e3a5f','#4a1942'].map(c => (
                      <button key={c} onClick={() => updateTemplate({ primaryColor: c })}
                        className="w-7 h-7 rounded-full border-2 border-white shadow ring-1 ring-gray-200 hover:ring-sg-500 transition-all"
                        style={{ backgroundColor: c }} title={c}/>
                    ))}
                  </div>
                </div>
              </div>

              {/* Greeting style */}
              <div>
                <label className="label">Anredeform</label>
                <div className="flex gap-2">
                  {['du','Sie'].map(g => (
                    <button key={g} onClick={() => updateTemplate({ greeting: g })}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        t.greeting === g ? 'border-sg-600 bg-sg-50 text-sg-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      {g === 'du' ? '👋 du-Form' : '🤝 Sie-Form'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature */}
              <div>
                <label className="label">Signatur</label>
                <div className="space-y-2">
                  {[
                    ['signatureName',  'Name',       'Max Muster'],
                    ['signatureTitle', 'Funktion',   'Seminarberatung'],
                    ['signaturePhone', 'Telefon',    '+41 41 390 11 61'],
                    ['signatureEmail', 'E-Mail',     'events@hotel.ch'],
                  ].map(([key, label, placeholder]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-16 shrink-0">{label}</span>
                      <input value={t[key] || ''} onChange={e => updateTemplate({ [key]: e.target.value })}
                        placeholder={placeholder} className="input-field text-sm flex-1"/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Header image */}
              <div>
                <label className="label">Header-Bild (Offerte)</label>
                <div className="flex items-center gap-3">
                  {t.headerImage
                    ? <img src={t.headerImage} alt="" className="h-12 w-28 object-cover rounded border border-gray-200"/>
                    : <div className="h-12 w-28 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">kein Bild</div>
                  }
                  <div className="flex gap-2">
                    <button onClick={() => headerRef.current?.click()} className="btn-secondary text-xs py-1 px-2">{t.headerImage ? 'Ersetzen' : 'Hochladen'}</button>
                    {t.headerImage && <button onClick={() => updateTemplate({ headerImage: null })} className="text-xs text-red-400 underline">Entfernen</button>}
                  </div>
                  <input ref={headerRef} type="file" accept="image/*" className="hidden" onChange={handleHeader}/>
                </div>
              </div>

              {/* AGB */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="label mb-0">AGB / Stornobedingungen</label>
                  <button onClick={() => updateTemplate({ agbText: DEFAULT_AGB })} className="text-xs text-gray-400 hover:text-gray-600 underline">Standard</button>
                </div>
                <textarea value={t.agbText || ''} onChange={e => updateTemplate({ agbText: e.target.value })}
                  rows={6} className="input-field text-xs font-mono resize-y"/>
              </div>
            </div>

            {/* Live preview */}
            <div>
              <label className="label">Vorschau</label>
              <TemplatePreview hotel={hotel} />
            </div>
          </div>
        )}

        {/* ── Prices ── */}
        {section === 'prices' && <HotelPrices hotel={hotel} onUpdateHotel={onUpdateHotel} />}
      </div>
    </div>
  )
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────
export default function AdminPanel({ isOpen, onClose, hotels, setHotels, onUpdateHotel, apiKey, setApiKey, serverHasKey }) {
  const [activeTab, setActiveTab] = useState('hotels')
  const [showKey,   setShowKey]   = useState(false)

  if (!isOpen) return null

  const addHotel   = () => setHotels(prev => [...prev, createNewHotel()])
  const deleteHotel = id => setHotels(prev => prev.filter(h => h.id !== id))

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose}/>
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-sg-700 text-white shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="font-semibold">Einstellungen</span>
          </div>
          <button onClick={onClose} className="hover:text-sg-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b shrink-0 bg-gray-50">
          {[['hotels','Hotels'],['api','API-Key']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === id ? 'text-sg-700 border-b-2 border-sg-600 bg-white' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {label}
              {id === 'hotels' && <span className="ml-1.5 text-xs bg-sg-100 text-sg-700 rounded-full px-1.5 py-0.5">{hotels.length}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {activeTab === 'hotels' && (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Eigenes Branding, Preisliste und Offerten-Template pro Betrieb.</p>
                <button onClick={addHotel} className="btn-primary text-xs py-1.5 px-3">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  Hotel hinzufügen
                </button>
              </div>
              {hotels.map(hotel => (
                <HotelForm key={hotel.id} hotel={hotel} onUpdateHotel={onUpdateHotel}
                  onDelete={deleteHotel} canDelete={hotels.length > 1}/>
              ))}
            </>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              {serverHasKey ? (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <div>
                    <p className="font-medium">Server-Key aktiv</p>
                    <p className="text-xs mt-0.5 text-green-700">ANTHROPIC_API_KEY ist als Umgebungsvariable konfiguriert. Kein lokaler Key nötig.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <p className="font-medium mb-1">Anthropic Claude API-Key</p>
                  <p className="text-xs">Wird nur lokal im Browser gespeichert. Alternativ: ANTHROPIC_API_KEY als Server-Umgebungsvariable setzen.</p>
                </div>
              )}
              {!serverHasKey && (
                <div>
                  <label className="label">API-Key (lokal)</label>
                  <div className="relative">
                    <input type={showKey ? 'text' : 'password'} value={apiKey || ''} onChange={e => setApiKey(e.target.value)}
                      placeholder="sk-ant-…" className="input-field pr-10 font-mono text-sm" autoComplete="off"/>
                    <button onClick={() => setShowKey(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showKey
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        }/>
                      </svg>
                    </button>
                  </div>
                  {apiKey && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      API-Key gespeichert
                    </div>
                  )}
                </div>
              )}
              <div className="text-xs text-gray-400 space-y-1">
                <p>Modell: claude-haiku-4-5 · ~CHF 0.001 pro Analyse</p>
                <p>Keys: console.anthropic.com</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t bg-gray-50 shrink-0">
          <button onClick={onClose} className="btn-primary w-full justify-center">Schliessen</button>
        </div>
      </div>
    </div>
  )
}
