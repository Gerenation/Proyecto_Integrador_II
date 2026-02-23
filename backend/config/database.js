const mongoose = require('mongoose');

/**
 * Configuración de conexión a MongoDB
 * 
 * Se conecta a la base de datos MongoDB usando la URI del archivo .env
 * Maneja eventos de conexión y errores
 */
const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1); // Termina el proceso si no puede conectar
  }
};

module.exports = conectarDB;
