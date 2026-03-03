## SIVUR - Sistema Integrado de Vigilancia Urbana y Responsabilidad Ambiental

Sistema alineado con el ODS 12 - Ciudades y Comunidades Sostenibles.

## Objetivo del Sprint 1 (MVP)

Sistema funcional que permite:
- Registro y login de usuarios
- Crear reportes urbanos
- Listar reportes
- Cambiar estado de reportes (solo administradores)

## Tecnologías

- **Backend**: Node.js + Express
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT
- **Frontend**: React (Vite)
- **Arquitectura**: Cliente-Servidor

## Estructura del Proyecto

```
SIVUR/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración de MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Controladores de autenticación
│   │   └── reporteController.js # Controladores de reportes
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticación JWT
│   ├── models/
│   │   ├── Usuario.js           # Modelo de Usuario
│   │   └── Reporte.js           # Modelo de Reporte
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   └── reporteRoutes.js     # Rutas de reportes
│   ├── .env.example             # Ejemplo de variables de entorno
│   ├── package.json
│   └── server.js                # Servidor Express
│
├── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FormularioReporte.jsx  # Formulario para crear reportes
    │   │   ├── ListaReportes.jsx      # Lista de reportes
    │   │   └── ProtectedRoute.jsx     # Componente de ruta protegida
    │   ├── context/
    │   │   └── AuthContext.jsx        # Contexto de autenticación
    │   ├── pages/
    │   │   ├── Login.jsx              # Página de login
    │   │   ├── Registro.jsx           # Página de registro
    │   │   └── Dashboard.jsx          # Página principal
    │   ├── services/
    │   │   ├── api.js                 # Configuración de Axios
    │   │   ├── authService.js         # Servicios de autenticación
    │   │   └── reporteService.js      # Servicios de reportes
    │   ├── App.jsx                     # Componente principal
    │   └── main.jsx                    # Punto de entrada
    ├── index.html
    ├── package.json
    └── vite.config.js
├── run_project.bat          # Script para iniciar backend y frontend
└── README.md
```

## Instalación y Configuración (Los pasos siguientes están automatizados gracias a run_project.bat)

### Prerrequisitos

- Node.js (v16 o superior)
- **MongoDB** en el puerto 27017 (ver sección [MongoDB](#mongodb) más abajo)

### Ejecución rápida (Windows)

1. Asegúrate de tener MongoDB ejecutándose (local o Atlas, ver sección [MongoDB](#mongodb)).
2. En Windows, ve a la carpeta raíz del proyecto `SIVUR` y ejecuta:
   ```powershell
   cd ruta\al\proyecto\SIVUR
   .\run_project.bat
   ```
3. Se abrirán dos ventanas de consola: una para el backend y otra para el frontend.
4. Cuando terminen de iniciar, abre en el navegador: `http://localhost:5173/`.

Si prefieres levantar los servicios manualmente, puedes seguir los pasos de Backend y Frontend a continuación.

### Backend

1. Navegar a la carpeta backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

4. Editar `.env` con tus configuraciones:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sivu
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
```

5. Iniciar el servidor:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Frontend

1. Navegar a la carpeta frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

### MongoDB

Necesitas MongoDB corriendo en **localhost:27017** para que el backend guarde usuarios y reportes.

**Opción A – Instalación local (Windows, con Chocolatey)**

1. Abre **PowerShell como Administrador** (clic derecho en PowerShell → "Ejecutar como administrador").
2. Navega al proyecto y ejecuta:
   ```powershell
   cd "RUTA\AL\PROYECTO\SIVUR"
   .\scripts\Instalar-MongoDB.ps1
   ```
3. Si MongoDB ya está instalado pero no corre, en una terminal normal:
   ```powershell
   .\scripts\Iniciar-MongoDB.ps1
   ```

**Opción B – MongoDB Atlas (sin instalar nada, gratis)**

1. Entra en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) y crea una cuenta.
2. Crea un cluster gratuito (M0).
3. En "Database Access" crea un usuario de base de datos.
4. En "Network Access" añade `0.0.0.0/0` (o tu IP) para poder conectar.
5. En "Connect" copia la cadena de conexión (ej: `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/`).
6. En `backend/.env` pon:
   ```
   MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/sivu?retryWrites=true&w=majority
   ```
   (sustituye usuario, password y la parte del cluster por los tuyos).

##  Modelos de Datos

### Usuario
- `_id`: ObjectId
- `nombre`: String (requerido)
- `email`: String (requerido, único)
- `password`: String (requerido, encriptado con bcrypt)
- `rol`: String (enum: 'ciudadano', 'admin', default: 'ciudadano')
- `createdAt`: Date
- `updatedAt`: Date

### Reporte
- `_id`: ObjectId
- `titulo`: String (requerido)
- `descripcion`: String (requerido)
- `categoria`: String (enum: 'Basura', 'Alumbrado', 'Hueco', 'Inseguridad', 'Otro')
- `ubicacion`: String (requerido)
- `estado`: String (enum: 'Pendiente', 'En proceso', 'Resuelto', default: 'Pendiente')
- `fecha`: Date (default: Date.now)
- `usuarioId`: ObjectId (referencia a Usuario)
- `createdAt`: Date
- `updatedAt`: Date

## Roles y Permisos

### Ciudadano
- Puede crear reportes
- Puede ver solo sus propios reportes
- No puede cambiar el estado de los reportes

### Admin
- Puede crear reportes
- Puede ver todos los reportes
- Puede cambiar el estado de cualquier reporte

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/registro` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/perfil` - Obtener perfil (requiere autenticación)

### Reportes
- `POST /api/reportes` - Crear reporte (requiere autenticación)
- `GET /api/reportes` - Listar reportes (requiere autenticación)
- `GET /api/reportes/:id` - Obtener reporte por ID (requiere autenticación)
- `PATCH /api/reportes/:id/estado` - Cambiar estado (requiere autenticación y rol admin)

## Explicación del Código

### Backend

#### Arquitectura MVC
- **Models**: Definen la estructura de datos (Usuario.js, Reporte.js)
- **Controllers**: Contienen la lógica de negocio (authController.js, reporteController.js)
- **Routes**: Definen las rutas y conectan con los controladores (authRoutes.js, reporteRoutes.js)

#### Autenticación JWT
- El usuario se autentica con email/password
- El servidor genera un token JWT
- El token se envía en el header `Authorization: Bearer <token>`
- El middleware `auth.js` verifica el token en cada petición protegida

#### Seguridad
- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración
- Validaciones en modelos y controladores

### Frontend

#### Context API
- `AuthContext` maneja el estado global de autenticación
- Proporciona funciones `login`, `registro`, `logout`
- Persiste el token en localStorage

#### Componentes
- **Páginas**: Login, Registro, Dashboard
- **Componentes reutilizables**: FormularioReporte, ListaReportes
- **ProtectedRoute**: Protege rutas que requieren autenticación

#### Servicios
- `api.js`: Configuración centralizada de Axios
- `authService.js`: Funciones para autenticación
- `reporteService.js`: Funciones para gestión de reportes

## Notas Académicas

Este proyecto implementa:
- Arquitectura cliente-servidor
- RESTful API
- Autenticación basada en tokens
- Separación de responsabilidades (MVC)
- Manejo de estado en React
- Protección de rutas
- Validación de datos
- Manejo de errores

## Próximos Pasos (Fuera del Sprint 1)

- Subida de imágenes para reportes
- Geolocalización en mapas
- Notificaciones por email
- Dashboard de estadísticas
- Filtros y búsqueda avanzada
- Comentarios en reportes

## Licencia

Proyecto académico - Uso educativo
