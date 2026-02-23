const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Middleware de autenticación JWT
 * 
 * Verifica que el usuario esté autenticado mediante un token JWT válido.
 * El token debe venir en el header Authorization como: "Bearer <token>"
 * 
 * Si el token es válido, agrega el usuario al objeto req para uso en rutas
 */
const autenticar = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Verificar que existe el token
    if (!token) {
      return res.status(401).json({ 
        mensaje: 'No hay token, acceso denegado' 
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findById(decoded.id).select('-password');
    
    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Token no válido, usuario no encontrado' 
      });
    }

    // Agregar el usuario al objeto request para uso en las rutas
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ 
      mensaje: 'Token no válido',
      error: error.message 
    });
  }
};

/**
 * Middleware para verificar si el usuario es administrador
 * Debe usarse después del middleware de autenticación
 */
const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      mensaje: 'Acceso denegado. Se requieren permisos de administrador' 
    });
  }
};

module.exports = { autenticar, esAdmin };
