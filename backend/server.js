require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const reporteRoutes = require('./routes/reporteRoutes');

// Inicializar Express
const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Permite recibir datos de formularios

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/reportes', reporteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API de SIVU funcionando correctamente',
    version: '1.0.0'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    mensaje: 'Ruta no encontrada' 
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error desconocido'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
