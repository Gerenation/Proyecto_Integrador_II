const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema(
  {
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
      enum: [
        'Basura',
        'Alumbrado',
        'Hueco',
        'Inseguridad',
        'Otro',
        'Ruido',
        'Contaminacion',
        'Seguridad'
      ],
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
    },
    /** @deprecated Legado: base64 embebido. Preferir imagenFileId + GridFS. */
    imagen: {
      type: String,
      default: null
    },
    imagenFileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reporte', reporteSchema);
