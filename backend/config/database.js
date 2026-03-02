const mongoose = require('mongoose');
const os = require('os');

/**
 * Obtiene una URI de MongoDB por defecto que NO depende de rutas absolutas
 * ni del nombre de la máquina.
 *
 * - Host: siempre localhost
 * - Puerto: 27017 (por defecto de MongoDB)
 * - Nombre de BD: sivu_<usuario>, así cada usuario de Windows tiene su propia BD
 */
const getDefaultMongoUri = () => {
  const userInfo = os.userInfo();
  const rawUsername = userInfo.username || 'dev';
  const safeUsername = rawUsername.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'dev';
  const dbName = `sivu_${safeUsername}`;
  return `mongodb://127.0.0.1:27017/${dbName}`;
};

/**
 * Configuración de conexión a MongoDB
 *
 * - Si existe process.env.MONGODB_URI, se usa tal cual.
 * - Si NO existe, se usa una URI relativa por usuario (getDefaultMongoUri).
 */
const conectarDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || getDefaultMongoUri();

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`   Usando base de datos: ${conn.connection.name}`);
    console.log(`   URI efectiva: ${mongoUri}`);
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1); // Termina el proceso si no puede conectar
  }
};

module.exports = conectarDB;
