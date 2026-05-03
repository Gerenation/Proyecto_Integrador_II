const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
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
    },
    direccion: {
      type: String,
      trim: true,
      default: ''
    },
    tipoIdentificacion: {
      type: String,
      enum: ['CC', 'Pasaporte', 'Extranjeria'],
      default: 'CC'
    },
    numeroIdentificacion: {
      type: String,
      trim: true,
      default: ''
    },
    fotoPerfilFileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  {
    timestamps: true
  }
);

usuarioSchema.index(
  { numeroIdentificacion: 1 },
  {
    unique: true,
    partialFilterExpression: {
      numeroIdentificacion: { $exists: true, $type: 'string', $gt: '' }
    }
  }
);

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

usuarioSchema.methods.compararPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
