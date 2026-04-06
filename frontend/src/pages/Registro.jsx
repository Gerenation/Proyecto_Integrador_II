import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Página de Registro
 * 
 * Permite a los usuarios crear una nueva cuenta en el sistema.
 * Redirige al dashboard después de un registro exitoso.
 */
const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(false);

  const { registro } = useAuth();
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de registro
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas coincidan
    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);

    const resultado = await registro({ 
      nombre, 
      email, 
      password,
      rol: esAdmin ? 'admin' : 'ciudadano'
    });

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
        <h2 className="auth-subtitle">Crear cuenta</h2>

        {error && (
          <div className="feedback error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid auth-form-grid">
          <div className="form-field">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="auth-role-option">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={esAdmin}
                onChange={(e) => setEsAdmin(e.target.checked)}
                className="auth-checkbox"
              />
              Registrarme como administrador
            </label>
            <p className="helper-text">
              Usa esta opción solo para crear cuentas de administrador.
            </p>
          </div>

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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-field">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
              placeholder="Repite tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="dashboard-button primary auth-submit"
          >
            {cargando ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-link-text">
          ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
