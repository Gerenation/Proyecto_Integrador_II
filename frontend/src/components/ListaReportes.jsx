import { useState, useEffect } from 'react';
import { obtenerReportes, cambiarEstadoReporte } from '../services/reporteService';
import { useAuth } from '../context/AuthContext';

/**
 * Componente ListaReportes
 * 
 * Muestra una lista de todos los reportes.
 * Los ciudadanos ven solo sus reportes, los admins ven todos.
 * Los admins pueden cambiar el estado de los reportes.
 */
const ListaReportes = ({ onlyAttended = false, refreshTrigger = 0 }) => {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { usuario } = useAuth();

  /**
   * Carga los reportes al montar el componente
   */
  useEffect(() => {
    cargarReportes();
  }, [refreshTrigger]);

  /**
   * Función para cargar los reportes desde el servidor
   */
  const cargarReportes = async () => {
    try {
      setCargando(true);
      const respuesta = await obtenerReportes();
      const reportesRecibidos = respuesta.reportes || [];
      const reportesFiltrados = onlyAttended
        ? reportesRecibidos.filter((reporte) => reporte.estado === 'Resuelto')
        : reportesRecibidos;
      setReportes(reportesFiltrados);
      setError('');
    } catch (error) {
      setError('Error al cargar los reportes');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Función para cambiar el estado de un reporte (solo admins)
   */
  const handleCambiarEstado = async (reporteId, nuevoEstado) => {
    try {
      await cambiarEstadoReporte(reporteId, nuevoEstado);
      // Recargar la lista de reportes
      cargarReportes();
    } catch (error) {
      alert(error.response?.data?.mensaje || 'Error al cambiar el estado');
    }
  };

  /**
   * Obtiene el color según el estado del reporte
   */
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return '#e74c3c';
      case 'En proceso':
        return '#f39c12';
      case 'Resuelto':
        return '#27ae60';
      default:
        return '#7f8c8d';
    }
  };

  if (cargando) {
    return <div className="panel">Cargando reportes...</div>;
  }

  if (error) {
    return <div className="panel feedback error">{error}</div>;
  }

  if (reportes.length === 0) {
    return (
      <section className="panel">
        <h2>{onlyAttended ? 'Reportes atendidos' : 'Reportes'}</h2>
        <p className="helper-text">No hay reportes disponibles para este filtro.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>{onlyAttended ? 'Reportes atendidos' : 'Reportes'} ({reportes.length})</h2>
      <div>
        {reportes.map((reporte) => (
          <article key={reporte._id} className="report-card">
            <div>
              <h3>{reporte.titulo}</h3>
              <span
                className="status-badge"
                style={{ backgroundColor: getEstadoColor(reporte.estado) }}
              >
                {reporte.estado}
              </span>
            </div>

            {(reporte.imagenUrl || JSON.parse(localStorage.getItem('reportImageMap') || '{}')[reporte._id]) && (
              <img
                src={reporte.imagenUrl || JSON.parse(localStorage.getItem('reportImageMap') || '{}')[reporte._id]}
                alt={`Imagen del reporte ${reporte.titulo}`}
                className="report-image"
              />
            )}

            <div>
              <p>
                <strong>Categoría:</strong> {reporte.categoria}
              </p>
              <p>
                <strong>Ubicación:</strong> {reporte.ubicacion}
              </p>
              <p>{reporte.descripcion}</p>
              <p className="helper-text">
                <strong>Fecha:</strong>{' '}
                {new Date(reporte.fecha).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {reporte.usuarioId && (
                <p className="helper-text">
                  <strong>Reportado por:</strong> {reporte.usuarioId.nombre}
                </p>
              )}
            </div>

            {/* Solo los admins pueden cambiar el estado */}
            {usuario?.rol === 'admin' && (
              <div className="form-field">
                <label>Cambiar estado</label>
                <select
                  value={reporte.estado}
                  onChange={(e) => handleCambiarEstado(reporte._id, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ListaReportes;
