import { useState } from 'react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',   icon: '◈' },
  { id: 'cultivos',  label: 'Cultivos',    icon: '🌽' },
  { id: 'mediciones',label: 'Mediciones',  icon: '📊' },
  { id: 'ia',        label: 'Análisis IA', icon: '🤖' },
  { id: 'alertas',   label: 'Alertas',     icon: '🚨' },
  { id: 'siembra',   label: 'Siembra',     icon: '📅' },
]

export default function Layout({ page, setPage, children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 60 : 220,
        background: 'var(--gris-6)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {collapsed ? (
            <div style={{ textAlign: 'center', fontSize: 22 }}>🌽</div>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', fontWeight: 600 }}>MaízIA</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Sistema de monitoreo</div>
            </>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '10px 0' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 8,
              background: page === n.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: page === n.id ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: 13,
              marginBottom: 2,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              borderLeft: page === n.id ? '3px solid var(--verde-md)' : '3px solid transparent',
            }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {!collapsed && <span>{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse btn */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'transparent',
          color: 'rgba(255,255,255,0.3)',
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: 18,
          cursor: 'pointer',
          border: 'none',
        }}>{collapsed ? '›' : '‹'}</button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Topbar */}
        <div style={{
          background: 'var(--gris-0)',
          borderBottom: '1px solid var(--gris-2)',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>
            {NAV.find(n => n.id === page)?.icon} {NAV.find(n => n.id === page)?.label}
          </h2>
          <div style={{ fontSize: 12, color: 'var(--gris-4)' }}>
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div style={{ padding: '28px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
