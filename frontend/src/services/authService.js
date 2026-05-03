import api from './api';

/**
 * Servicio de autenticación
 * 
 * Contiene todas las funciones para interactuar con el backend
 * relacionadas con autenticación y usuarios
 */

/**
 * Registrar un nuevo usuario
 * @param {Object} datosUsuario - { nombre, email, password, rol? }
 * @returns {Promise} Respuesta del servidor con token y datos del usuario
 */
export const registrarUsuario = async (datosUsuario) => {
  const response = await api.post('/auth/registro', datosUsuario);
  return response.data;
};

/**
 * Iniciar sesión
 * @param {Object} credenciales - { email, password }
 * @returns {Promise} Respuesta del servidor con token y datos del usuario
 */
export const loginUsuario = async (credenciales) => {
  const response = await api.post('/auth/login', credenciales);
  return response.data;
};

/**
 * Obtener el perfil del usuario autenticado
 * @returns {Promise} Datos del usuario
 */
export const obtenerPerfil = async () => {
  const response = await api.get('/auth/perfil');
  return response.data;
};

/**
 * @param {{ direccion?: string, fotoPerfil?: string }} datos
 */
export const actualizarPerfil = async (datos) => {
  const response = await api.patch('/auth/perfil', datos);
  return response.data;
};
