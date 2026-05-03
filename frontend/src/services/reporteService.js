import api from './api';

/**
 * Servicio de reportes (cliente HTTP hacia el backend).
 */

/**
 * Crear reporte con texto libre; el backend estructura campos con Ollama (local).
 *
 * El servidor espera: { mensaje: string }
 * Respuesta típica: { mensaje: "Reporte creado con IA", reporte: { ... } }
 *
 * @param {Object} datos - { mensaje: string }
 */
export const crearReporte = async (datos) => {
  const response = await api.post('/reportes', datos);
  return response.data;
};

/**
 * Alta manual (sin Ollama): mismos límites de imagen en servidor.
 */
export const crearReporteManual = async (datos) => {
  const response = await api.post('/reportes', { ...datos, modo: 'manual' });
  return response.data;
};

/**
 * @param {Record<string, string>} [params] q, estado, usuarioId, desde, hasta, nombreUsuario
 */
export const obtenerReportes = async (params = {}) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
  );
  const response = await api.get('/reportes', { params: cleaned });
  return response.data;
};

export const obtenerReportePorId = async (id) => {
  const response = await api.get(`/reportes/${id}`);
  return response.data;
};

export const cambiarEstadoReporte = async (id, estado) => {
  const response = await api.patch(`/reportes/${id}/estado`, { estado });
  return response.data;
};
