import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import EmvariasLogo from '../../components/branding/EmvariasLogo';
import ThemeToggle from '../../components/layout/ThemeToggle';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SelectField from '../../components/ui/SelectField';
import { TIPOS_IDENTIFICACION } from '../../constants/tipoIdentificacion';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipoIdentificacion, setTipoIdentificacion] = useState('CC');
  const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
  const [fotoDataUrl, setFotoDataUrl] = useState('');
  const [error, setError] = useState('');
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(false);
  const { registro } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFotoDataUrl('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setFotoDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!direccion.trim()) {
      setError('La dirección es obligatoria');
      return;
    }
    if (numeroIdentificacion.trim().length < 5) {
      setError('El número de identificación debe tener al menos 5 caracteres');
      return;
    }
    setCargando(true);
    const payload = {
      nombre,
      email,
      password,
      rol: esAdmin ? 'admin' : 'ciudadano',
      direccion: direccion.trim(),
      tipoIdentificacion,
      numeroIdentificacion: numeroIdentificacion.trim()
    };
    if (fotoDataUrl) payload.fotoPerfil = fotoDataUrl;

    const resultado = await registro(payload);
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
          <p className="auth-tagline">Crea tu cuenta ciudadana o administrativa</p>
        </div>

        <div className="auth-card auth-card--wide">
          <h2 className="auth-heading">Registro</h2>
          <p className="ui-hint auth-sub">Datos obligatorios según normativa del sistema</p>

          {error ? <div className="feedback error">{error}</div> : null}

          <form onSubmit={handleSubmit} className="auth-form auth-form--grid">
            <Input
              label="Nombre completo"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Tu nombre"
            />

            <div className="auth-role-card auth-span-2">
              <label className="auth-checkbox-row">
                <input
                  type="checkbox"
                  checked={esAdmin}
                  onChange={(e) => setEsAdmin(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>Registrar como administrador</span>
              </label>
              <p className="ui-hint">Solo para cuentas de gestión interna.</p>
            </div>

            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nombre@correo.com"
            />

            <Input
              label="Dirección"
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
              placeholder="Calle, barrio, ciudad"
            />

            <SelectField
              label="Tipo de identificación"
              value={tipoIdentificacion}
              onChange={(e) => setTipoIdentificacion(e.target.value)}
              required
            >
              {TIPOS_IDENTIFICACION.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectField>

            <Input
              label="Número de identificación"
              value={numeroIdentificacion}
              onChange={(e) => setNumeroIdentificacion(e.target.value)}
              required
              minLength={5}
              placeholder="Sin puntos ni espacios"
            />

            <div className="ui-field auth-span-2">
              <label className="ui-label">Foto de perfil (opcional)</label>
              <input type="file" accept="image/*" className="ui-file" onChange={handleFoto} />
              {fotoDataUrl ? (
                <img src={fotoDataUrl} alt="" className="reg-foto-preview" />
              ) : null}
            </div>

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
              placeholder="Repite la contraseña"
            />

            <Button type="submit" variant="primary" disabled={cargando} className="auth-submit-btn auth-span-2">
              {cargando ? 'Creando cuenta…' : 'Registrarse'}
            </Button>
          </form>

          <p className="auth-footer-link">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-inline-link">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
