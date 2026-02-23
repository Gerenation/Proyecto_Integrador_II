const mongoose = require('mongoose');

/**
 * Modelo de Reporte
 * 
 * Define la estructura de datos para los reportes urbanos.
 * Cada reporte está asociado a un usuario y tiene un estado.
 */
const reporteSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['Basura', 'Alumbrado', 'Hueco', 'Inseguridad', 'Otro'],
    default: 'Otro'
  },
  ubicacion: {
    type: String,
    required: [true, 'La ubicación es obligatoria'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'En proceso', 'Resuelto'],
    default: 'Pendiente'
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El reporte debe estar asociado a un usuario']
  }
}, {
  timestamps: true // Agrega automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Reporte', reporteSchema);
