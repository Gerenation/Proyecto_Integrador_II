import axios from 'axios';

/**
 * Configuración de Axios para las peticiones HTTP
 * 
 * Base URL: URL del backend
 * Headers: Configuración por defecto para enviar JSON
 */
// Usar ruta relativa para que Vite proxy envíe las peticiones al backend (evita CORS)
const API_URL = import.meta.env.DEV ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor de solicitudes: Agrega el token JWT a todas las peticiones
 * Si hay un token guardado en localStorage, lo agrega al header Authorization
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas: Maneja errores de autenticación
 * Si el token expiró o es inválido, redirige al login
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
