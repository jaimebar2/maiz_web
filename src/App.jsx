import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard   from './pages/Dashboard'
import Cultivos    from './pages/Cultivos'
import Mediciones  from './pages/Mediciones'
import AnalisisIA  from './pages/AnalisisIA'
import Alertas     from './pages/Alertas'
import Siembra     from './pages/Siembra'

export default function App() {
  const [page, setPage]         = useState('dashboard')
  const [cultivoId, setCultivoId] = useState(null)

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <Dashboard  cultivoId={cultivoId} />
      case 'cultivos':   return <Cultivos   cultivoId={cultivoId} setCultivoId={id => { setCultivoId(id); setPage('dashboard') }} />
      case 'mediciones': return <Mediciones cultivoId={cultivoId} />
      case 'ia':         return <AnalisisIA cultivoId={cultivoId} />
      case 'alertas':    return <Alertas    cultivoId={cultivoId} />
      case 'siembra':    return <Siembra />
      default:           return <Dashboard  cultivoId={cultivoId} />
    }
  }

  return (
    <Layout page={page} setPage={setPage}>
      {cultivoId && page !== 'cultivos' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 16, fontSize: 12, color: 'var(--gris-4)'
        }}>
          <span>Cultivo activo:</span>
          <span className="badge badge-verde">ID #{cultivoId}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setCultivoId(null)} style={{ fontSize: 11 }}>
            × Cambiar
          </button>
        </div>
      )}
      {renderPage()}
    </Layout>
  )
}
