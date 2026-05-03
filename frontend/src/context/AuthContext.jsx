import { createContext, useState, useEffect, useContext } from 'react';
import { loginUsuario, registrarUsuario, obtenerPerfil } from '../services/authService';

/**
 * Sesión de usuario (JWT + datos mínimos del perfil).
 *
 * Responsabilidades:
 * - Restaurar sesión desde localStorage al cargar la app (token + usuario serializado).
 * - Exponer login / registro / logout y banderas `cargando`, `estaAutenticado`.
 * - Los servicios HTTP añaden el Bearer token vía `services/api.js`.
 */
const AuthContext = createContext();

/**
 * Hook personalizado para usar el contexto de autenticación
 * Facilita el acceso al contexto desde cualquier componente
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación
 * 
 * Maneja:
 * - Estado del usuario autenticado
 * - Token JWT
 * - Funciones de login y registro
 * - Persistencia en localStorage
 */
export const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado
  const [usuario, setUsuario] = useState(null);
  // Estado de carga (para saber si ya verificó el token)
  const [cargando, setCargando] = useState(true);

  /**
   * Efecto que se ejecuta al cargar la aplicación
   * Verifica si hay un token guardado y restaura la sesión
   */
  useEffect(() => {
    let cancelled = false;

    async function restaurarSesion() {
      const token = localStorage.getItem('token');
      const usuarioGuardado = localStorage.getItem('usuario');

      if (!token) {
        if (!cancelled) setCargando(false);
        return;
      }

      if (usuarioGuardado) {
        try {
          setUsuario(JSON.parse(usuarioGuardado));
        } catch (error) {
          console.error('Error al parsear usuario guardado:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          if (!cancelled) setCargando(false);
          return;
        }
      }

      try {
        const { usuario: u } = await obtenerPerfil();
        if (!cancelled && u) {
          setUsuario(u);
          localStorage.setItem('usuario', JSON.stringify(u));
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        if (!cancelled) setUsuario(null);
      } finally {
        if (!cancelled) setCargando(false);
      }
    }

    restaurarSesion();
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Función para registrar un nuevo usuario
   */
  const registro = async (datosUsuario) => {
    try {
      const respuesta = await registrarUsuario(datosUsuario);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', respuesta.token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
      
      // Actualizar estado
      setUsuario(respuesta.usuario);
      
      return { exito: true, datos: respuesta };
    } catch (error) {
      // Sin respuesta = problema de red o backend no disponible
      if (!error.response) {
        return {
          exito: false,
          error: 'No se pudo conectar con el servidor. ¿Está el backend en marcha?'
        };
      }
      const data = error.response.data;
      return {
        exito: false,
        error: data?.mensaje || data?.error || 'Error al registrar usuario'
      };
    }
  };

  /**
   * Función para iniciar sesión
   */
  const login = async (credenciales) => {
    try {
      const respuesta = await loginUsuario(credenciales);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', respuesta.token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
      
      // Actualizar estado
      setUsuario(respuesta.usuario);
      
      return { exito: true, datos: respuesta };
    } catch (error) {
      if (!error.response) {
        return {
          exito: false,
          error: 'No se pudo conectar con el servidor. ¿Está el backend en marcha?'
        };
      }
      const data = error.response.data;
      return {
        exito: false,
        error: data?.mensaje || data?.error || 'Error al iniciar sesión'
      };
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  /**
   * Sincroniza usuario con GET /auth/perfil (tras editar perfil o datos nuevos en servidor).
   */
  const refreshUsuario = async () => {
    try {
      const { usuario: u } = await obtenerPerfil();
      if (u) {
        setUsuario(u);
        localStorage.setItem('usuario', JSON.stringify(u));
      }
    } catch (e) {
      console.error('refreshUsuario:', e);
    }
  };

  const valor = {
    usuario,
    login,
    registro,
    logout,
    refreshUsuario,
    cargando,
    estaAutenticado: !!usuario
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
};
