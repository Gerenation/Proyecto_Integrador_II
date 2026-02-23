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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>SIVU</h1>
        <h2 style={styles.subtitle}>Iniciar Sesión</h2>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="tu@email.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={styles.button}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={styles.linkText}>
          ¿No tienes cuenta? <Link to="/registro" style={styles.link}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

// Estilos inline (en producción usarías CSS modules o styled-components)
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '10px',
    fontSize: '32px',
    fontWeight: 'bold'
  },
  subtitle: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: '30px',
    fontSize: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#2c3e50',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  button: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  linkText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#7f8c8d'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500'
  }
};

export default Login;
