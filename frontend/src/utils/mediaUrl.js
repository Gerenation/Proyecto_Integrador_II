/**
 * Resuelve rutas /api/files/... o data URLs para <img src>.
 * En desarrollo, rutas relativas pasan por el proxy de Vite.
 */
export function resolveMediaUrl(path) {
  if (!path) return null;
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = import.meta.env.DEV ? '' : import.meta.env.VITE_API_ORIGIN || 'http://localhost:5001';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
