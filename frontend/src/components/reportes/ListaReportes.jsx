import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, Filter, X } from 'lucide-react';
import { obtenerReportes, cambiarEstadoReporte } from '../../services/reporteService';
import { useAuth } from '../../context/AuthContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import Card from '../ui/Card';
import SelectField from '../ui/SelectField';
import Input from '../ui/Input';
import Button from '../ui/Button';

function nombreReportante(usuarioId) {
  if (usuarioId && typeof usuarioId === 'object' && 'nombre' in usuarioId) {
    return usuarioId.nombre;
  }
  return null;
}

function formatearFechaReporte(fecha) {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const estadoColors = {
  Pendiente: 'var(--brand-orange)',
  'En proceso': 'var(--brand-orange-muted)',
  Resuelto: 'var(--brand-green)'
};

function ReportCardInner({ reporte, usuario, onEstadoChange }) {
  const reportante = nombreReportante(reporte.usuarioId);
  const imgSrc = resolveMediaUrl(reporte.imagenUrl || reporte.imagen);
  const usuarioInfo = reporte.usuarioInfo || {};

  return (
    <>
      <div className="report-card__top">
        <h3 className="report-card__title">{reporte.titulo}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: estadoColors[reporte.estado] || '#868e96' }}
        >
          {reporte.estado}
        </span>
      </div>

      {imgSrc ? (
        <img src={imgSrc} alt="" className="report-image" loading="lazy" decoding="async" />
      ) : null}

      <div className="report-card__body">
        <p className="report-card__meta">
          <strong>Categoría:</strong> {reporte.categoria}
        </p>
        <p className="report-card__meta">
          <strong>Ubicación:</strong> {reporte.ubicacion}
        </p>
        <p className="report-card__desc">{reporte.descripcion}</p>
        <p className="ui-hint">
          <strong>Fecha:</strong> {formatearFechaReporte(reporte.fecha)}
        </p>
        {reportante || usuarioInfo.nombre ? (
          <p className="ui-hint">
            <strong>Reportado por:</strong> {usuarioInfo.nombre || reportante}
          </p>
        ) : null}
        {usuarioInfo.email ? (
          <p className="ui-hint">
            <strong>Correo:</strong> {usuarioInfo.email}
          </p>
        ) : null}
        {usuarioInfo.numeroIdentificacion ? (
          <p className="ui-hint">
            <strong>Documento:</strong> {usuarioInfo.tipoIdentificacion} · {usuarioInfo.numeroIdentificacion}
          </p>
        ) : null}
        {usuarioInfo.direccion ? (
          <p className="ui-hint">
            <strong>Dirección:</strong> {usuarioInfo.direccion}
          </p>
        ) : null}
      </div>

      {usuario?.rol === 'admin' ? (
        <div className="report-card__admin">
          <SelectField
            label="Estado"
            value={reporte.estado}
            onChange={(e) => onEstadoChange(reporte._id, e.target.value)}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Resuelto">Resuelto</option>
          </SelectField>
        </div>
      ) : null}
    </>
  );
}

export default function ListaReportes({
  onlyAttended = false,
  refreshTrigger = 0,
  usuarioFiltroId = '',
  usuarioFiltroNombre = '',
  onLimpiarFiltroUsuario
}) {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { usuario } = useAuth();
  const reduceMotion = useReducedMotion();

  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');

  const [applied, setApplied] = useState({
    q: '',
    estado: '',
    desde: '',
    hasta: '',
    nombreUsuario: ''
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setCargando(true);
        const p = {};
        if (onlyAttended) {
          p.estado = 'Resuelto';
        } else if (applied.estado) {
          p.estado = applied.estado;
        }
        if (applied.q.trim()) p.q = applied.q.trim();
        if (applied.desde) p.desde = applied.desde;
        if (applied.hasta) p.hasta = applied.hasta;
        if (usuario?.rol === 'admin' && usuarioFiltroId) p.usuarioId = usuarioFiltroId;
        if (usuario?.rol === 'admin' && applied.nombreUsuario.trim()) {
          p.nombreUsuario = applied.nombreUsuario.trim();
        }

        const respuesta = await obtenerReportes(p);
        if (!cancelled) {
          setReportes(respuesta.reportes || []);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          const detalle =
            err.response?.data?.mensaje || err.message || 'No se pudo conectar con el servidor';
          setError(detalle);
        }
        console.error(err);
      } finally {
        if (!cancelled) setCargando(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshTrigger, applied, onlyAttended, usuarioFiltroId, usuario?.rol]);

  const aplicarBusqueda = (e) => {
    e?.preventDefault?.();
    setApplied({
      q,
      estado: onlyAttended ? '' : estado,
      desde,
      hasta,
      nombreUsuario
    });
  };

  const handleCambiarEstado = async (reporteId, nuevoEstado) => {
    try {
      await cambiarEstadoReporte(reporteId, nuevoEstado);
      toast.success('Estado actualizado');
      setApplied((a) => ({ ...a }));
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'Error al cambiar el estado');
    }
  };

  const listVariants = reduceMotion
    ? {}
    : {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
      };

  const itemVariants = reduceMotion
    ? {}
    : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  const toolbar = !onlyAttended && (
    <form className="report-search-bar" onSubmit={aplicarBusqueda}>
      <div className="report-search-bar__row">
        <div className="report-search-field report-search-field--grow">
          <Search size={18} className="report-search-icon" aria-hidden />
          <input
            className="report-search-input"
            placeholder="Buscar en título o descripción…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Buscar
        </Button>
      </div>
      {usuario?.rol === 'admin' ? (
        <div className="report-filters-grid">
          <SelectField label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Resuelto">Resuelto</option>
          </SelectField>
          <Input
            label="Nombre del reportante"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            placeholder="Coincidencia en nombre"
          />
          <Input type="date" label="Desde" value={desde} onChange={(e) => setDesde(e.target.value)} />
          <Input type="date" label="Hasta" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          <div className="report-filters-actions">
            <Button type="button" variant="secondary" size="md" onClick={aplicarBusqueda}>
              <Filter size={16} aria-hidden /> Aplicar filtros
            </Button>
          </div>
        </div>
      ) : null}
      {usuario?.rol === 'admin' && usuarioFiltroId ? (
        <div className="report-active-filter">
          <span>
            Filtrando por usuario: <strong>{usuarioFiltroNombre || usuarioFiltroId}</strong>
          </span>
          <Button type="button" variant="ghost" size="sm" onClick={onLimpiarFiltroUsuario}>
            <X size={16} aria-hidden /> Quitar
          </Button>
        </div>
      ) : null}
    </form>
  );

  const toolbarAtendidos = onlyAttended && usuario?.rol === 'admin' && usuarioFiltroId && (
    <div className="report-active-filter">
      <span>
        Filtrando por usuario: <strong>{usuarioFiltroNombre || usuarioFiltroId}</strong>
      </span>
      <Button type="button" variant="ghost" size="sm" onClick={onLimpiarFiltroUsuario}>
        <X size={16} aria-hidden /> Quitar
      </Button>
    </div>
  );

  if (cargando && reportes.length === 0) {
    return (
      <Card elevated className="report-list-card">
        {toolbar}
        {toolbarAtendidos}
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--short" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevated className="report-list-card">
        {toolbar}
        {toolbarAtendidos}
        <h2 className="report-list-title">{onlyAttended ? 'Reportes atendidos' : 'Reportes'}</h2>
        <p className="feedback error">{error}</p>
      </Card>
    );
  }

  if (reportes.length === 0) {
    return (
      <Card elevated className="report-list-card">
        {toolbar}
        {toolbarAtendidos}
        <h2 className="report-list-title">{onlyAttended ? 'Reportes atendidos' : 'Reportes'}</h2>
        <p className="ui-hint">No hay reportes con estos criterios.</p>
      </Card>
    );
  }

  return (
    <Card elevated className="report-list-card">
      {toolbar}
      {toolbarAtendidos}
      <h2 className="report-list-title">
        {onlyAttended ? 'Reportes atendidos' : 'Reportes'} ({reportes.length})
      </h2>
      <motion.div
        className="report-list-grid"
        variants={listVariants}
        initial={reduceMotion ? false : 'hidden'}
        animate={reduceMotion ? false : 'show'}
      >
        {reportes.map((reporte) =>
          reduceMotion ? (
            <article key={reporte._id} className="report-card report-card--modern">
              <ReportCardInner
                reporte={reporte}
                usuario={usuario}
                onEstadoChange={handleCambiarEstado}
              />
            </article>
          ) : (
            <motion.article
              key={reporte._id}
              className="report-card report-card--modern"
              variants={itemVariants}
              layout
            >
              <ReportCardInner
                reporte={reporte}
                usuario={usuario}
                onEstadoChange={handleCambiarEstado}
              />
            </motion.article>
          )
        )}
      </motion.div>
    </Card>
  );
}
