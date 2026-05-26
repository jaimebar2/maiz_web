const BASE = import.meta.env.VITE_API_URL || '/api'

const req = async (url, opts = {}) => {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.mensaje || 'Error en la API')
  return data
}

export const api = {
  // Cultivos
  getCultivos:    () => req('/cultivos'),
  getCultivo:     (id) => req(`/cultivos/${id}`),
  crearCultivo:   (body) => req('/cultivos', { method: 'POST', body: JSON.stringify(body) }),
  actualizarCultivo: (id, body) => req(`/cultivos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  eliminarCultivo:(id) => req(`/cultivos/${id}`, { method: 'DELETE' }),

  // Mediciones
  getMediciones:     (id, params = '') => req(`/cultivos/${id}/mediciones${params}`),
  getUltimaMedicion: (id) => req(`/cultivos/${id}/mediciones/ultima`),
  getEstadisticas:   (id) => req(`/cultivos/${id}/mediciones/estadisticas`),
  crearMedicion:     (id, body) => req(`/cultivos/${id}/mediciones`, { method: 'POST', body: JSON.stringify(body) }),

  // Alertas
  getAlertas:     (id) => req(`/cultivos/${id}/alertas`),
  resolverAlerta: (id) => req(`/ia/alertas/${id}/resolver`, { method: 'PATCH' }),

  // IA
  analisisCompleto:  (body) => req('/ia/analisis-completo', { method: 'POST', body: JSON.stringify(body) }),
  predecirCosecha:   (body) => req('/ia/predecir-cosecha',  { method: 'POST', body: JSON.stringify(body) }),
  necesidadAgua:     (body) => req('/ia/necesidad-agua',    { method: 'POST', body: JSON.stringify(body) }),
  fechasSiembra:     () => req('/ia/fechas-siembra'),
  historialIA:       (id) => req(`/ia/historial/${id}`),
}
