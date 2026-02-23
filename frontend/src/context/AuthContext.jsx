import { createContext, useState, useEffect, useContext } from 'react';
import { loginUsuario, registrarUsuario } from '../services/authService';

/**
 * Contexto de autenticación
 * 
 * Proporciona el estado de autenticación y funciones de login/registro
 * a todos los componentes de la aplicación mediante React Context
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
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (token && usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    setCargando(false);
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
          error: 'No se pudo conectar con el servidor. ¿Está el backend en marcha en http://localhost:5000?'
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

  // Valores que se proporcionan a través del contexto
  const valor = {
    usuario,
    login,
    registro,
    logout,
    cargando,
    estaAutenticado: !!usuario
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
};
