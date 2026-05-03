const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const { usuarioPublico } = require('../utils/serializers');
const { bufferFromImageInput } = require('../utils/imageBuffer');
const { uploadBuffer, deleteFile } = require('../services/gridfsStore');

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const TIPOS_ID = ['CC', 'Pasaporte', 'Extranjeria'];

const registrar = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      rol,
      direccion,
      tipoIdentificacion,
      numeroIdentificacion,
      fotoPerfil
    } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: 'Por favor completa nombre, email y contraseña'
      });
    }

    if (!direccion || !String(direccion).trim()) {
      return res.status(400).json({ mensaje: 'La dirección es obligatoria' });
    }
    if (!tipoIdentificacion || !TIPOS_ID.includes(tipoIdentificacion)) {
      return res.status(400).json({
        mensaje: 'Tipo de identificación inválido (CC, Pasaporte o Extranjeria)'
      });
    }
    if (!numeroIdentificacion || String(numeroIdentificacion).trim().length < 5) {
      return res.status(400).json({
        mensaje: 'El número de identificación debe tener al menos 5 caracteres'
      });
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        mensaje: 'El email ya está registrado'
      });
    }

    const dupDoc = await Usuario.findOne({
      numeroIdentificacion: String(numeroIdentificacion).trim()
    });
    if (dupDoc) {
      return res.status(400).json({
        mensaje: 'El número de identificación ya está registrado'
      });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
      rol: rol || 'ciudadano',
      direccion: String(direccion).trim(),
      tipoIdentificacion,
      numeroIdentificacion: String(numeroIdentificacion).trim()
    });

    await nuevoUsuario.save();

    if (fotoPerfil && typeof fotoPerfil === 'string') {
      try {
        const parsed = bufferFromImageInput(fotoPerfil);
        nuevoUsuario.fotoPerfilFileId = await uploadBuffer(
          parsed.buffer,
          `perfil-${nuevoUsuario._id}-${Date.now()}`,
          parsed.contentType,
          { tipo: 'perfil', userId: String(nuevoUsuario._id) }
        );
        await nuevoUsuario.save();
      } catch (imgErr) {
        console.warn('Registro: foto de perfil omitida:', imgErr.message);
      }
    }

    const token = generarToken(nuevoUsuario._id);
    const fresh = await Usuario.findById(nuevoUsuario._id).select('-password');

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: usuarioPublico(fresh)
    });
  } catch (error) {
    console.error('Error en registro:', error);

    if (error.name === 'ValidationError') {
      const primerError = Object.values(error.errors)[0];
      const mensaje = primerError ? primerError.message : 'Datos inválidos';
      return res.status(400).json({ mensaje });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        mensaje: 'Email o número de identificación ya registrado'
      });
    }

    res.status(500).json({
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'Por favor ingresa email y contraseña'
      });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas'
      });
    }

    const passwordValida = await usuario.compararPassword(password);
    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas'
      });
    }

    const token = generarToken(usuario._id);

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: usuarioPublico(usuario)
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    const u = await Usuario.findById(req.usuario._id).select('-password');
    if (!u) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({
      usuario: usuarioPublico(u)
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      mensaje: 'Error al obtener perfil',
      error: error.message
    });
  }
};

/**
 * PATCH /api/auth/perfil — nombre, dirección y/o foto de perfil (base64).
 */
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, direccion, fotoPerfil } = req.body;
    const u = await Usuario.findById(req.usuario._id);
    if (!u) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (nombre !== undefined) {
      const nombreLimpio = String(nombre).trim();
      if (nombreLimpio.length < 2) {
        return res.status(400).json({ mensaje: 'El nombre debe tener al menos 2 caracteres' });
      }
      u.nombre = nombreLimpio;
    }

    if (direccion !== undefined) {
      u.direccion = String(direccion).trim();
      if (!u.direccion) {
        return res.status(400).json({ mensaje: 'La dirección no puede quedar vacía' });
      }
    }

    if (fotoPerfil && typeof fotoPerfil === 'string') {
      const parsed = bufferFromImageInput(fotoPerfil);
      if (u.fotoPerfilFileId) {
        await deleteFile(u.fotoPerfilFileId);
      }
      u.fotoPerfilFileId = await uploadBuffer(
        parsed.buffer,
        `perfil-${u._id}-${Date.now()}`,
        parsed.contentType,
        { tipo: 'perfil', userId: String(u._id) }
      );
    }

    await u.save();
    const fresh = await Usuario.findById(u._id).select('-password');
    res.json({
      mensaje: 'Perfil actualizado',
      usuario: usuarioPublico(fresh)
    });
  } catch (error) {
    console.error('actualizarPerfil:', error);
    if (
      error.message &&
      (error.message.includes('grande') ||
        error.message.includes('inválido') ||
        error.message.includes('vacía'))
    ) {
      return res.status(400).json({ mensaje: error.message });
    }
    res.status(500).json({
      mensaje: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

module.exports = {
  registrar,
  login,
  obtenerPerfil,
  actualizarPerfil
};
