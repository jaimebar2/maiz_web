import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

function MetricCard({ label, value, sub, color = 'var(--verde)' }) {
  return (
    <div className="card fade-up" style={{ borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 11, color: 'var(--gris-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--gris-6)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--gris-4)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard({ cultivoId }) {
  const [stats, setStats] = useState(null)
  const [mediciones, setMediciones] = useState([])
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cultivoId) { setLoading(false); return }
    Promise.all([
      api.getEstadisticas(cultivoId),
      api.getMediciones(cultivoId, '?limit=20'),
      api.getAlertas(cultivoId),
    ]).then(([s, m, a]) => {
      setStats(s.data)
      setMediciones((m.data || []).reverse())
      setAlertas(a.data || [])
    }).finally(() => setLoading(false))
  }, [cultivoId])

  if (!cultivoId) return (
    <div className="card" style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🌽</div>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Bienvenido a MaízIA</h2>
      <p style={{ color: 'var(--gris-4)' }}>Selecciona un cultivo en la sección "Cultivos" para ver el dashboard.</p>
    </div>
  )

  if (loading) return <div className="spinner" />

  const chartData = mediciones.slice(-10).map((m, i) => ({
    i: i + 1,
    humedad: Number(m.humedad_suelo),
    temp: Number(m.temperatura),
    lluvia: Number(m.lluvia_mm),
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Alertas activas */}
      {alertas.length > 0 && (
        <div style={{ background: 'var(--rojo-cl)', border: '1px solid #f5c6c2', borderRadius: 'var(--radius)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>🚨</span>
          <div>
            <strong style={{ color: 'var(--rojo)' }}>{alertas.length} alerta{alertas.length > 1 ? 's' : ''} activa{alertas.length > 1 ? 's' : ''}</strong>
            <div style={{ fontSize: 12, color: 'var(--rojo)', opacity: 0.8 }}>{alertas[0]?.mensaje}</div>
          </div>
        </div>
      )}

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        <MetricCard label="Registros" value={stats?.total_registros ?? '—'} sub="mediciones totales" />
        <MetricCard label="Humedad prom." value={stats?.humedad_promedio ? `${stats.humedad_promedio}%` : '—'} sub="del suelo" color="var(--azul)" />
        <MetricCard label="Temperatura" value={stats?.temperatura_promedio ? `${stats.temperatura_promedio}°C` : '—'} sub="promedio" color="var(--amarillo)" />
        <MetricCard label="Lluvia total" value={stats?.lluvia_total_mm ? `${stats.lluvia_total_mm} mm` : '—'} sub="acumulada" color="var(--azul)" />
        <MetricCard label="pH promedio" value={stats?.ph_promedio ?? '—'} sub="del suelo" color="var(--tierra)" />
      </div>

      {/* Gráficas */}
      {chartData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14, color: 'var(--gris-5)' }}>Humedad y Temperatura</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="i" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="humedad" stroke="var(--azul)" dot={false} strokeWidth={2} name="Humedad %" />
                <Line type="monotone" dataKey="temp" stroke="var(--amarillo)" dot={false} strokeWidth={2} name="Temp °C" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14, color: 'var(--gris-5)' }}>Lluvia (mm)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="i" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="lluvia" fill="var(--azul)" radius={[4,4,0,0]} name="Lluvia mm" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
