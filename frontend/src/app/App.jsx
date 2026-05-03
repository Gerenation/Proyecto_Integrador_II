import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Login from '../pages/auth/Login';
import Registro from '../pages/auth/Registro';
import Dashboard from '../pages/dashboard/Dashboard';

/**
 * Raíz de la aplicación: proveedores globales y definición de rutas.
 *
 * Capas:
 * - ThemeProvider: tema claro/oscuro (atributo data-theme en document.documentElement).
 * - AuthProvider: sesión JWT + usuario en memoria y localStorage.
 * - Router: rutas públicas (login, registro) y protegidas (dashboard).
 *
 * Rutas:
 * - /login, /registro — acceso sin token.
 * - /dashboard — envuelta en ProtectedRoute; requiere usuario autenticado.
 * - / y * — redirección según existencia de token en localStorage (comportamiento MVP).
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3800,
              style: {
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-fg, #1a1a1a)',
                border: '1px solid var(--toast-border, #e5e5e5)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)'
              }
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <Navigate
                  to={localStorage.getItem('token') ? '/dashboard' : '/login'}
                  replace
                />
              }
            />
            <Route
              path="*"
              element={
                <Navigate
                  to={localStorage.getItem('token') ? '/dashboard' : '/login'}
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
