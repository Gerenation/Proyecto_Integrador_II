import { useState } from 'react';
import { crearReporte } from '../services/reporteService';

/**
 * Componente FormularioReporte
 * 
 * Permite crear un nuevo reporte urbano.
 * Incluye validación de campos y manejo de errores.
 * 
 * @param {Function} onReporteCreado - Callback que se ejecuta después de crear un reporte
 */
const FormularioReporte = ({ onReporteCreado }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Otro',
    ubicacion: ''
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const categorias = ['Basura', 'Alumbrado', 'Hueco', 'Inseguridad', 'Otro'];

  /**
   * Maneja los cambios en los campos del formulario
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      await crearReporte(formData);
      setExito('Reporte creado exitosamente');
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: 'Otro',
        ubicacion: ''
      });

      // Notificar al componente padre
      if (onReporteCreado) {
        onReporteCreado();
      }
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al crear el reporte');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Crear Nuevo Reporte</h2>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {exito && (
        <div style={styles.exito}>
          {exito}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Título:</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Ej: Basura acumulada en la esquina"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Categoría:</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            style={styles.select}
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Ej: Calle Principal #123, Colonia Centro"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            style={styles.textarea}
            placeholder="Describe el problema en detalle..."
            rows="4"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={styles.button}
        >
          {cargando ? 'Creando...' : 'Crear Reporte'}
        </button>
      </form>
    </div>
  );
};

// Estilos inline
const styles = {
  container: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  title: {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '24px'
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
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
    backgroundColor: 'white'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
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
  exito: {
    backgroundColor: '#efe',
    color: '#3c3',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center'
  }
};

export default FormularioReporte;
