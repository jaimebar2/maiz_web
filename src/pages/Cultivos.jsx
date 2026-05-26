import { useState } from 'react'
import { api } from '../services/api'
import { useFetch } from '../hooks/useFetch'

function Modal({ onClose, onSaved }) {
  const [form, setForm] = useState({ nombre: '', variedad: '', hectareas: '', ubicacion: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!form.nombre || !form.hectareas) return setError('Nombre y hectáreas son obligatorios.')
    setSaving(true); setError(null)
    try {
      await api.crearCultivo(form)
      onSaved()
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: 420, boxShadow: 'var(--shadow-md)' }}>
        <h3 style={{ marginBottom: 20 }}>Nuevo cultivo</h3>
        {error && <div style={{ color: 'var(--rojo)', marginBottom: 12, fontSize: 13 }}>{error}</div>}
        {[
          { label: 'Nombre del lote *', key: 'nombre', placeholder: 'Ej: Lote Norte' },
          { label: 'Variedad de maíz', key: 'variedad', placeholder: 'Ej: Maíz amarillo' },
          { label: 'Hectáreas *', key: 'hectareas', placeholder: 'Ej: 5.5', type: 'number' },
          { label: 'Ubicación', key: 'ubicacion', placeholder: 'Ej: Montería, Córdoba' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: 'var(--gris-4)', display: 'block', marginBottom: 4 }}>{f.label}</label>
            <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving} style={{ flex: 1 }}>
            {saving ? 'Guardando...' : '+ Crear cultivo'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

export default function Cultivos({ cultivoId, setCultivoId }) {
  const { data, loading, refetch } = useFetch(() => api.getCultivos(), [])
  const [showModal, setShowModal] = useState(false)

  const cultivos = Array.isArray(data) ? data : data?.data || []

  const handleEliminar = async (id) => {
    if (!confirm('¿Desactivar este cultivo?')) return
    await api.eliminarCultivo(id)
    refetch()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ color: 'var(--gris-4)', fontSize: 13 }}>{cultivos.length} cultivo(s) registrado(s)</p>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nuevo cultivo</button>
      </div>

      {loading && <div className="spinner" />}

      {!loading && cultivos.length === 0 && (
        <div className="empty">No hay cultivos registrados aún.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {cultivos.map(c => (
          <div key={c.id} className="card fade-up" style={{
            borderLeft: cultivoId === c.id ? '4px solid var(--verde)' : '4px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }} onClick={() => setCultivoId(c.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{c.nombre}</div>
                {c.variedad && <span className="badge badge-verde" style={{ marginBottom: 10 }}>{c.variedad}</span>}
              </div>
              {cultivoId === c.id && <span className="badge badge-verde">Activo</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--gris-4)' }}>📐 {c.hectareas} ha</div>
              <div style={{ fontSize: 12, color: 'var(--gris-4)' }}>📍 {c.ubicacion || '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--gris-4)' }}>📊 {c.total_mediciones || 0} mediciones</div>
              <div style={{ fontSize: 12, color: 'var(--gris-4)' }}>
                {c.ultima_medicion ? new Date(c.ultima_medicion).toLocaleDateString('es-CO') : 'Sin datos'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setCultivoId(c.id) }}>
                Seleccionar
              </button>
              <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); handleEliminar(c.id) }}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); refetch() }} />}
    </div>
  )
}
