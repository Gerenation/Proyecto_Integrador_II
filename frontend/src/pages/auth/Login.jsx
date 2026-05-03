import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import EmvariasLogo from '../../components/branding/EmvariasLogo';
import ThemeToggle from '../../components/layout/ThemeToggle';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

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

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: [0.2, 0.65, 0.3, 1] }
      };

  return (
    <div className="auth-shell">
      <div className="auth-shell__bg" aria-hidden />
      <header className="auth-shell__top">
        <ThemeToggle />
      </header>

      <motion.div className="auth-shell__center" {...motionProps}>
        <div className="auth-brand-block">
          <EmvariasLogo />
          <p className="auth-tagline">Incidencias urbanas · Valle de Aburrá</p>
        </div>

        <div className="auth-card">
          <h2 className="auth-heading">Iniciar sesión</h2>
          <p className="ui-hint auth-sub">Accede con tu cuenta registrada</p>

          {error ? <div className="feedback error">{error}</div> : null}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="nombre@correo.com"
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <Button type="submit" variant="primary" disabled={cargando} className="auth-submit-btn">
              {cargando ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>

          <p className="auth-footer-link">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="auth-inline-link">
              Regístrate
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
