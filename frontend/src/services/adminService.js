import api from './api';

/**
 * @param {{ rol?: 'admin' | 'ciudadano' }} params
 */
export const listarUsuarios = async (params = {}) => {
  const response = await api.get('/admin/usuarios', { params });
  return response.data;
};
