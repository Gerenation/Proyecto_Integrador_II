import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Página de Login
 * 
 * Permite a los usuarios iniciar sesión en el sistema.
 * Redirige al dashboard después de un login exitoso.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const resultado = await login({ email, password });

    if (resultado.exito) {
      navigate('/dashboard');
    } else {
      setError(resultado.error);
    }

    setCargando(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">SIVUR</h1>
        <h2 className="auth-subtitle">Iniciar sesión</h2>

        {error && (
          <div className="feedback error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid auth-form-grid">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="dashboard-button primary auth-submit"
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="auth-link-text">
          ¿No tienes cuenta? <Link to="/registro" className="auth-link">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
