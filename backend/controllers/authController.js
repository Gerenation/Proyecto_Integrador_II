const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT para el usuario
 */
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // El token expira en 30 días
  });
};

/**
 * Controlador para registrar un nuevo usuario
 * POST /api/auth/registro
 */
const registrar = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: 'Por favor completa todos los campos requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        mensaje: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    // Solo permitir rol 'admin' si se especifica explícitamente (en producción debería ser más restrictivo)
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
      rol: rol || 'ciudadano'
    });

    await nuevoUsuario.save();

    // Generar token y enviar respuesta
    const token = generarToken(nuevoUsuario._id);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);

    // Errores de validación de Mongoose (ej: email duplicado, formato inválido)
    if (error.name === 'ValidationError') {
      const primerError = Object.values(error.errors)[0];
      const mensaje = primerError ? primerError.message : 'Datos inválidos';
      return res.status(400).json({ mensaje });
    }

    // Error de índice único (email duplicado)
    if (error.code === 11000) {
      return res.status(400).json({
        mensaje: 'El email ya está registrado'
      });
    }

    res.status(500).json({
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};

/**
 * Controlador para iniciar sesión
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'Por favor ingresa email y contraseña'
      });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValida = await usuario.compararPassword(password);
    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas'
      });
    }

    // Generar token y enviar respuesta
    const token = generarToken(usuario._id);

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * Controlador para obtener el perfil del usuario autenticado
 * GET /api/auth/perfil
 * Requiere autenticación
 */
const obtenerPerfil = async (req, res) => {
  try {
    // El usuario ya está disponible en req.usuario gracias al middleware de autenticación
    res.json({
      usuario: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        rol: req.usuario.rol
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      mensaje: 'Error al obtener perfil',
      error: error.message
    });
  }
};

module.exports = {
  registrar,
  login,
  obtenerPerfil
};
