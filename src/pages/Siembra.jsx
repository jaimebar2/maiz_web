import { api } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLOR = (score) =>
  score >= 80 ? '#1a6b3c' : score >= 65 ? '#2d9e5f' : score >= 50 ? '#e8b84b' : '#c0392b'

const REC_BADGE = {
  'óptimo':         'badge-verde',
  'bueno':          'badge-verde',
  'regular':        'badge-amarillo',
  'no recomendado': 'badge-rojo',
}

export default function Siembra() {
  const { data, loading } = useFetch(() => api.fechasSiembra(), [])
  const ranking = data?.ranking || []
  const mejor   = data?.mejor_mes

  return (
    <div>
      {loading && <div className="spinner" />}

      {!loading && mejor && (
        <>
          {/* Banner mejor mes */}
          <div className="card fade-up" style={{
            background: 'linear-gradient(135deg, var(--verde) 0%, var(--verde-md) 100%)',
            color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20
          }}>
            <div style={{ fontSize: 56 }}>📅</div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Mejor mes para sembrar maíz
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600 }}>
                {mejor.nombre_mes} — Score {mejor.score}/100
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                Condiciones óptimas de temperatura, humedad y lluvia para Colombia
              </div>
            </div>
          </div>

          {/* Gráfica */}
          <div className="card fade-up" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 16 }}>Score por mes</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[...ranking].sort((a, b) => a.mes - b.mes)} margin={{ left: -10 }}>
                <XAxis dataKey="nombre_mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip formatter={(v) => [`${v} pts`, 'Score']} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {[...ranking].sort((a, b) => a.mes - b.mes).map((entry, i) => (
                    <Cell key={i} fill={COLOR(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla ranking */}
          <div className="card fade-up">
            <h3 style={{ fontSize: 15, marginBottom: 16 }}>Ranking completo</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--gris-2)' }}>
                  {['#', 'Mes', 'Score', 'Recomendación'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--gris-4)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => (
                  <tr key={r.mes} style={{ borderBottom: '1px solid var(--gris-2)', background: i % 2 === 0 ? 'transparent' : 'var(--gris-1)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--gris-4)', fontWeight: 500 }}>#{i + 1}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{r.nombre_mes}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 8, background: 'var(--gris-2)', borderRadius: 99, overflow: 'hidden', maxWidth: 120 }}>
                          <div style={{ height: '100%', width: `${r.score}%`, background: COLOR(r.score), borderRadius: 99 }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{r.score}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className={`badge ${REC_BADGE[r.recomendacion] || 'badge-gris'}`}>{r.recomendacion}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
