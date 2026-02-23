import api from './api';

/**
 * Servicio de reportes
 * 
 * Contiene todas las funciones para interactuar con el backend
 * relacionadas con reportes urbanos
 */

/**
 * Crear un nuevo reporte
 * @param {Object} datosReporte - { titulo, descripcion, categoria, ubicacion }
 * @returns {Promise} Respuesta del servidor con el reporte creado
 */
export const crearReporte = async (datosReporte) => {
  const response = await api.post('/reportes', datosReporte);
  return response.data;
};

/**
 * Obtener todos los reportes
 * Los ciudadanos ven solo sus reportes, los admins ven todos
 * @returns {Promise} Lista de reportes
 */
export const obtenerReportes = async () => {
  const response = await api.get('/reportes');
  return response.data;
};

/**
 * Obtener un reporte por ID
 * @param {String} id - ID del reporte
 * @returns {Promise} Datos del reporte
 */
export const obtenerReportePorId = async (id) => {
  const response = await api.get(`/reportes/${id}`);
  return response.data;
};

/**
 * Cambiar el estado de un reporte
 * Solo los admins pueden cambiar el estado
 * @param {String} id - ID del reporte
 * @param {String} estado - Nuevo estado (Pendiente, En proceso, Resuelto)
 * @returns {Promise} Respuesta del servidor con el reporte actualizado
 */
export const cambiarEstadoReporte = async (id, estado) => {
  const response = await api.patch(`/reportes/${id}/estado`, { estado });
  return response.data;
};
