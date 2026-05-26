import { api } from '../services/api'
import { useFetch } from '../hooks/useFetch'

export default function Alertas({ cultivoId }) {
  const { data, loading, refetch } = useFetch(
    () => cultivoId ? api.getAlertas(cultivoId) : Promise.resolve({ data: [] }),
    [cultivoId]
  )

  const alertas = data?.data || data || []

  const resolver = async (id) => {
    await api.resolverAlerta(id)
    refetch()
  }

  if (!cultivoId) return <div className="empty">Selecciona un cultivo en la sección "Cultivos".</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ color: 'var(--gris-4)', fontSize: 13 }}>
          {alertas.length} alerta{alertas.length !== 1 ? 's' : ''} activa{alertas.length !== 1 ? 's' : ''}
        </p>
        <button className="btn btn-ghost btn-sm" onClick={refetch}>↺ Actualizar</button>
      </div>

      {loading && <div className="spinner" />}

      {!loading && alertas.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h3 style={{ marginBottom: 8 }}>Sin alertas activas</h3>
          <p style={{ color: 'var(--gris-4)', fontSize: 13 }}>El cultivo está en condiciones normales.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {alertas.map(a => (
          <div key={a.id} className="card fade-up" style={{
            borderLeft: `4px solid ${a.nivel === 'critico' ? 'var(--rojo)' : 'var(--amarillo)'}`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ fontSize: 28 }}>{a.nivel === 'critico' ? '🔴' : '🟡'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{a.variable || a.tipo}</span>
                <span className={`badge ${a.nivel === 'critico' ? 'badge-rojo' : 'badge-amarillo'}`}>{a.nivel}</span>
                {a.valor && <span className="badge badge-gris">Valor: {a.valor}</span>}
              </div>
              <p style={{ fontSize: 13, color: 'var(--gris-5)' }}>{a.mensaje}</p>
              <p style={{ fontSize: 11, color: 'var(--gris-4)', marginTop: 4 }}>
                {new Date(a.created_at).toLocaleString('es-CO')}
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => resolver(a.id)}>
              ✓ Resolver
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
