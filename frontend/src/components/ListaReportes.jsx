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
const ListaReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { usuario } = useAuth();

  /**
   * Carga los reportes al montar el componente
   */
  useEffect(() => {
    cargarReportes();
  }, []);

  /**
   * Función para cargar los reportes desde el servidor
   */
  const cargarReportes = async () => {
    try {
      setCargando(true);
      const respuesta = await obtenerReportes();
      setReportes(respuesta.reportes || []);
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
    return <div style={styles.cargando}>Cargando reportes...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (reportes.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Reportes</h2>
        <p style={styles.vacio}>No hay reportes disponibles</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reportes ({reportes.length})</h2>

      <div style={styles.lista}>
        {reportes.map((reporte) => (
          <div key={reporte._id} style={styles.reporte}>
            <div style={styles.header}>
              <h3 style={styles.titulo}>{reporte.titulo}</h3>
              <span
                style={{
                  ...styles.estado,
                  backgroundColor: getEstadoColor(reporte.estado)
                }}
              >
                {reporte.estado}
              </span>
            </div>

            <div style={styles.info}>
              <p style={styles.categoria}>
                <strong>Categoría:</strong> {reporte.categoria}
              </p>
              <p style={styles.ubicacion}>
                <strong>Ubicación:</strong> {reporte.ubicacion}
              </p>
              <p style={styles.descripcion}>{reporte.descripcion}</p>
              <p style={styles.fecha}>
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
                <p style={styles.usuario}>
                  <strong>Reportado por:</strong> {reporte.usuarioId.nombre}
                </p>
              )}
            </div>

            {/* Solo los admins pueden cambiar el estado */}
            {usuario?.rol === 'admin' && (
              <div style={styles.acciones}>
                <label style={styles.labelAccion}>Cambiar estado:</label>
                <select
                  value={reporte.estado}
                  onChange={(e) => handleCambiarEstado(reporte._id, e.target.value)}
                  style={styles.selectEstado}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Estilos inline
const styles = {
  container: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '24px'
  },
  cargando: {
    textAlign: 'center',
    padding: '40px',
    color: '#7f8c8d'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '4px',
    textAlign: 'center'
  },
  vacio: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '40px'
  },
  lista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  reporte: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fafafa'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  titulo: {
    color: '#2c3e50',
    margin: 0,
    fontSize: '20px',
    flex: 1
  },
  estado: {
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  info: {
    marginBottom: '15px'
  },
  categoria: {
    margin: '8px 0',
    color: '#34495e'
  },
  ubicacion: {
    margin: '8px 0',
    color: '#34495e'
  },
  descripcion: {
    margin: '12px 0',
    color: '#555',
    lineHeight: '1.6'
  },
  fecha: {
    margin: '8px 0',
    color: '#7f8c8d',
    fontSize: '14px'
  },
  usuario: {
    margin: '8px 0',
    color: '#7f8c8d',
    fontSize: '14px'
  },
  acciones: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  labelAccion: {
    color: '#2c3e50',
    fontWeight: '500'
  },
  selectEstado: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  }
};

export default ListaReportes;
