import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente de ruta protegida
 * 
 * Verifica si el usuario está autenticado antes de permitir el acceso.
 * Si no está autenticado, redirige al login.
 * 
 * @param {ReactNode} children - Componentes hijos a renderizar si está autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { estaAutenticado, cargando } = useAuth();

  // Mostrar nada mientras se verifica la autenticación
  if (cargando) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirigir al login
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el contenido
  return children;
};

export default ProtectedRoute;
