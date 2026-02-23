const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Modelo de Usuario
 * 
 * Define la estructura de datos para los usuarios del sistema.
 * Incluye validaciones y métodos para encriptar contraseñas.
 */
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  rol: {
    type: String,
    enum: ['ciudadano', 'admin'],
    default: 'ciudadano'
  }
}, {
  timestamps: true // Agrega automáticamente createdAt y updatedAt
});

/**
 * Middleware pre-save: Encripta la contraseña antes de guardar
 * Solo se ejecuta si la contraseña fue modificada
 */
usuarioSchema.pre('save', async function(next) {
  // Si la contraseña no fue modificada, continuar
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generar salt y encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Método para comparar contraseñas
 * Permite verificar si una contraseña en texto plano coincide con la encriptada
 */
usuarioSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
