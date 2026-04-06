import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';

/**
 * Componente principal de la aplicación
 * 
 * Configura las rutas y el contexto de autenticación.
 * 
 * Rutas:
 * - /login: Página de inicio de sesión (pública)
 * - /registro: Página de registro (pública)
 * - /dashboard: Página principal (protegida, requiere autenticación)
 * - /: Redirige a /dashboard si está autenticado, sino a /login
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Ruta pública: Login */}
            <Route path="/login" element={<Login />} />

            {/* Ruta pública: Registro */}
            <Route path="/registro" element={<Registro />} />

            {/* Ruta protegida: Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Ruta por defecto: Redirige según autenticación */}
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    localStorage.getItem('token') ? '/dashboard' : '/login'
                  }
                  replace
                />
              }
            />

            {/* Ruta 404: Redirige al dashboard o login */}
            <Route
              path="*"
              element={
                <Navigate
                  to={
                    localStorage.getItem('token') ? '/dashboard' : '/login'
                  }
                  replace
                />
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
