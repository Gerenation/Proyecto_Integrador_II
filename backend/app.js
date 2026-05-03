// Si ejecutas tests importando solo app.js, aquí también cargamos variables de entorno.
// En arranque normal, server.js ya llamó a dotenv antes de require('./app').
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reporteRoutes = require('./routes/reporteRoutes');

/**
 * Aplicación Express: middlewares, montaje de rutas y manejadores de error.
 *
 * Prefijos de API (alineados con el cliente en frontend/src/services):
 * - /api/auth   → registro, login, perfil
 * - /api/reportes → CRUD parcial de reportes urbanos (todas las rutas JWT salvo las definidas en auth)
 *
 * Exporta `app` para tests o para que server.js solo se encargue del listen + BD.
 */
const app = express();

app.use(cors());
/** Límite alto para permitir imagen en base64 en POST /api/reportes (el controlador limita ~5MB del campo). */
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true, limit: '8mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reportes', reporteRoutes);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de SIVUR funcionando correctamente',
    version: '1.0.0'
  });
});

app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error desconocido'
  });
});

module.exports = app;
