import { useState } from 'react'
import { api } from '../services/api'

const CAMPOS = [
  { key: 'humedad_suelo',   label: 'Humedad suelo (%)',   placeholder: '0-100',  default: 65 },
  { key: 'temperatura',     label: 'Temperatura (°C)',     placeholder: '10-42',  default: 27 },
  { key: 'lluvia_mm',       label: 'Lluvia (mm)',          placeholder: '0-200',  default: 8  },
  { key: 'ph_suelo',        label: 'pH del suelo',         placeholder: '5.0-8.0',default: 6.5},
  { key: 'fertilizante_kg', label: 'Fertilizante (kg/ha)', placeholder: '0-100',  default: 22 },
  { key: 'radiacion_solar', label: 'Radiación solar (MJ)', placeholder: '8-30',   default: 20 },
  { key: 'dias_siembra',    label: 'Días desde siembra',   placeholder: '1-180',  default: 90 },
]

function ResultCard({ icon, title, children, color = 'var(--verde)' }) {
  return (
    <div className="card fade-up" style={{ borderTop: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3 style={{ fontSize: 15 }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function NivelBadge({ nivel }) {
  const map = {
    excelente: 'badge-verde', bueno: 'badge-verde',
    regular: 'badge-amarillo', bajo: 'badge-rojo',
    alta: 'badge-rojo', media: 'badge-amarillo', baja: 'badge-verde',
    óptimo: 'badge-verde', 'no recomendado': 'badge-rojo',
  }
  return <span className={`badge ${map[nivel] || 'badge-gris'}`}>{nivel}</span>
}

export default function AnalisisIA({ cultivoId }) {
  const initForm = Object.fromEntries(CAMPOS.map(c => [c.key, c.default]))
  const [form, setForm]       = useState(initForm)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const analizar = async () => {
    setLoading(true); setError(null)
    try {
      const payload = { ...form }
      if (cultivoId) payload.cultivo_id = cultivoId
      const res = await api.analisisCompleto(payload)
      setResultado(res.data)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>
      {/* Formulario */}
      <div className="card" style={{ position: 'sticky', top: 80 }}>
        <h3 style={{ marginBottom: 4, fontSize: 16 }}>Datos del cultivo</h3>
        <p style={{ fontSize: 12, color: 'var(--gris-4)', marginBottom: 16 }}>Ingresa las condiciones actuales para el análisis IA.</p>
        {error && <div style={{ color: 'var(--rojo)', marginBottom: 10, fontSize: 13 }}>{error}</div>}
        {CAMPOS.map(f => (
          <div key={f.key} style={{ marginBottom: 11 }}>
            <label style={{ fontSize: 11, color: 'var(--gris-4)', display: 'block', marginBottom: 3 }}>{f.label}</label>
            <input type="number" placeholder={f.placeholder} value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <button className="btn btn-primary" onClick={analizar} disabled={loading} style={{ width: '100%', marginTop: 10 }}>
          {loading ? 'Analizando...' : '🤖 Analizar con IA'}
        </button>
      </div>

      {/* Resultados */}
      <div>
        {!resultado && !loading && (
          <div className="empty card" style={{ padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
            <p>Ajusta los valores y presiona <strong>Analizar con IA</strong> para ver los resultados.</p>
          </div>
        )}
        {loading && <div className="spinner" />}

        {resultado && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Cosecha */}
            <ResultCard icon="🌽" title="Predicción de cosecha" color="var(--verde)">
              <div style={{ display: 'flex', align: 'center', gap: 16, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: 'var(--verde)' }}>
                  {resultado.cosecha.prediccion_kg} kg
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--gris-4)' }}>por hectárea</div>
                  <NivelBadge nivel={resultado.cosecha.nivel} />
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gris-5)', background: 'var(--gris-1)', padding: '10px 14px', borderRadius: 8 }}>
                💡 {resultado.cosecha.recomendacion}
              </p>
            </ResultCard>

            {/* Agua */}
            <ResultCard icon="💧" title="Necesidad de agua" color={resultado.agua.necesita_agua ? 'var(--rojo)' : 'var(--azul)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: resultado.agua.necesita_agua ? 'var(--rojo-cl)' : 'var(--azul-cl)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                }}>
                  {resultado.agua.necesita_agua ? '⚠️' : '✅'}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>
                    {resultado.agua.necesita_agua ? 'Necesita riego' : 'Sin necesidad de riego'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gris-4)' }}>
                    Probabilidad de estrés hídrico: <strong>{resultado.agua.probabilidad}%</strong> — <NivelBadge nivel={resultado.agua.urgencia} />
                  </div>
                </div>
              </div>
              {/* Barra de probabilidad */}
              <div style={{ height: 8, background: 'var(--gris-2)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${resultado.agua.probabilidad}%`,
                  background: resultado.agua.probabilidad > 60 ? 'var(--rojo)' : resultado.agua.probabilidad > 35 ? 'var(--amarillo)' : 'var(--verde-md)',
                  transition: 'width 0.5s'
                }} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--gris-5)', background: 'var(--gris-1)', padding: '10px 14px', borderRadius: 8 }}>
                💡 {resultado.agua.recomendacion}
              </p>
            </ResultCard>

            {/* Alertas */}
            <ResultCard icon="🚨" title="Alertas del sistema" color={resultado.alertas.length > 0 ? 'var(--rojo)' : 'var(--verde)'}>
              {resultado.alertas.length === 0 ? (
                <div style={{ color: 'var(--verde)', fontSize: 14 }}>✅ Todo en rango óptimo. Sin alertas activas.</div>
              ) : (
                resultado.alertas.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 8, marginBottom: 8,
                    background: a.nivel === 'critico' ? 'var(--rojo-cl)' : '#fef9e7',
                    border: `1px solid ${a.nivel === 'critico' ? '#f5c6c2' : '#fde68a'}`,
                  }}>
                    <span>{a.nivel === 'critico' ? '🔴' : '🟡'}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{a.variable}</div>
                      <div style={{ fontSize: 12, color: 'var(--gris-4)' }}>{a.mensaje}</div>
                    </div>
                    <NivelBadge nivel={a.nivel} />
                  </div>
                ))
              )}
            </ResultCard>

          </div>
        )}
      </div>
    </div>
  )
}
