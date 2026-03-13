const NAV_ITEMS = [
  {
    id: 'offer',
    label: 'Neue Offerte',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4v16m8-8H4"/>
      </svg>
    ),
  },
  {
    id: 'inquiries',
    label: 'Anfragen',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
  },
  {
    id: 'calendar',
    label: 'Verfügbarkeit',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    ),
  },
]

export default function Sidebar({ view, setView, setAdminOpen, inquiryBadge }) {
  return (
    <aside className="sidebar fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-sg-700 select-none">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sg-600">
        <div className="w-8 h-8 rounded-lg bg-sg-500 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-5 8Z"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">OfferMate</p>
          <p className="text-sg-300 text-xs">Sinnvoll Gastro</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="section-title text-sg-400 px-3 mb-3">Navigation</p>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`nav-item w-full text-left ${view === item.id ? 'nav-item-active' : 'nav-item-inactive'}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.id === 'inquiries' && inquiryBadge > 0 && (
              <span className="ml-auto bg-orange-400 text-white text-xs font-bold rounded-full px-1.5 leading-5 min-w-5 text-center">
                {inquiryBadge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-4 border-t border-sg-600 pt-3">
        <button
          onClick={() => setAdminOpen(true)}
          className="nav-item nav-item-inactive w-full text-left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>Einstellungen</span>
        </button>
      </div>
    </aside>
  )
}
