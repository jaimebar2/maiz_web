import { useState } from 'react'
import { api } from '../services/api'
import { useFetch } from '../hooks/useFetch'

const CAMPOS = [
  { key: 'humedad_suelo',   label: 'Humedad suelo (%)',   placeholder: '0-100' },
  { key: 'temperatura',     label: 'Temperatura (°C)',     placeholder: '10-42' },
  { key: 'lluvia_mm',       label: 'Lluvia (mm)',          placeholder: '0-200' },
  { key: 'ph_suelo',        label: 'pH del suelo',         placeholder: '5.0-8.0' },
  { key: 'fertilizante_kg', label: 'Fertilizante (kg/ha)', placeholder: '0-100' },
  { key: 'radiacion_solar', label: 'Radiación solar (MJ)', placeholder: '8-30' },
  { key: 'dias_siembra',    label: 'Días desde siembra',   placeholder: '1-180' },
]

export default function Mediciones({ cultivoId }) {
  const { data, loading, refetch } = useFetch(
    () => cultivoId ? api.getMediciones(cultivoId, '?limit=30') : Promise.resolve({ data: [] }),
    [cultivoId]
  )
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const mediciones = data?.data || data || []

  const handleSubmit = async () => {
    if (!cultivoId) return setError('Selecciona un cultivo primero.')
    setSaving(true); setError(null); setSuccess(false)
    try {
      await api.crearMedicion(cultivoId, { ...form, fuente: 'manual' })
      setForm({})
      setSuccess(true)
      refetch()
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (!cultivoId) return <div className="empty">Selecciona un cultivo en la sección "Cultivos".</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
      {/* Formulario */}
      <div className="card" style={{ position: 'sticky', top: 80 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>Registrar medición</h3>
        {error   && <div style={{ color: 'var(--rojo)', marginBottom: 10, fontSize: 13 }}>{error}</div>}
        {success && <div style={{ color: 'var(--verde)', marginBottom: 10, fontSize: 13 }}>✅ Medición registrada correctamente.</div>}
        {CAMPOS.map(f => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: 'var(--gris-4)', display: 'block', marginBottom: 4 }}>{f.label}</label>
            <input type="number" placeholder={f.placeholder} value={form[f.key] || ''}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving} style={{ width: '100%', marginTop: 8 }}>
          {saving ? 'Guardando...' : '+ Registrar medición'}
        </button>
      </div>

      {/* Tabla */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16 }}>Historial de mediciones</h3>
          <span style={{ fontSize: 12, color: 'var(--gris-4)' }}>{mediciones.length} registros</span>
        </div>
        {loading && <div className="spinner" />}
        {!loading && mediciones.length === 0 && <div className="empty">Sin mediciones aún.</div>}
        {mediciones.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gris-2)' }}>
                {['Fecha', 'Humedad%', 'Temp°C', 'Lluvia', 'pH', 'Fert.', 'Días', 'Fuente'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--gris-4)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mediciones.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--gris-2)', background: i % 2 === 0 ? 'transparent' : 'var(--gris-1)' }}>
                  <td style={{ padding: '8px 10px' }}>{new Date(m.fecha).toLocaleDateString('es-CO')}</td>
                  <td style={{ padding: '8px 10px' }}>{m.humedad_suelo ?? '—'}</td>
                  <td style={{ padding: '8px 10px' }}>{m.temperatura ?? '—'}</td>
                  <td style={{ padding: '8px 10px' }}>{m.lluvia_mm ?? '—'}</td>
                  <td style={{ padding: '8px 10px' }}>{m.ph_suelo ?? '—'}</td>
                  <td style={{ padding: '8px 10px' }}>{m.fertilizante_kg ?? '—'}</td>
                  <td style={{ padding: '8px 10px' }}>{m.dias_siembra ?? '—'}</td>
                  <td style={{ padding: '8px 10px' }}>
                    <span className={`badge ${m.fuente === 'manual' ? 'badge-gris' : 'badge-azul'}`}>{m.fuente}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
