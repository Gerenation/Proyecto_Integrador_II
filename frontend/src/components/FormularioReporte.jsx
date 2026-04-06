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
  const [imagenDataUrl, setImagenDataUrl] = useState('');
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
   * Maneja el archivo de imagen para previsualizarlo en la UI.
   * Este flujo es mock y desacoplado para integrarlo luego con backend/cloud storage.
   */
  const handleImagenChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setImagenDataUrl('');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagenDataUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
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
      const response = await crearReporte(formData);
      const reporteCreado = response?.reporte;

      // Guardar imagen localmente en un mock para futura integración backend.
      if (reporteCreado?._id && imagenDataUrl) {
        const existingImageMap = JSON.parse(localStorage.getItem('reportImageMap') || '{}');
        existingImageMap[reporteCreado._id] = imagenDataUrl;
        localStorage.setItem('reportImageMap', JSON.stringify(existingImageMap));
      }

      setExito('Reporte creado exitosamente');
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: 'Otro',
        ubicacion: ''
      });
      setImagenDataUrl('');

      // Notificar al componente padre
      if (onReporteCreado) {
        onReporteCreado(reporteCreado?._id);
      }
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al crear el reporte');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="panel">
      <h2>Crear nuevo reporte</h2>
      <p className="helper-text">
        Puedes adjuntar una imagen como evidencia. En este sprint se guarda de forma local (mock) para preparar la integración backend.
      </p>

      {error && (
        <div className="feedback error">
          {error}
        </div>
      )}

      {exito && (
        <div className="feedback success">
          {exito}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid report-form-grid">
        <div className="form-field">
          <label>Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Ej: Basura acumulada en la esquina"
          />
        </div>

        <div className="form-field">
          <label>Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-field report-field-wide">
          <label>Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            required
            placeholder="Ej: Calle Principal #123, Colonia Centro"
          />
        </div>

        <div className="form-field report-field-wide">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            placeholder="Describe el problema en detalle..."
            rows="4"
          />
        </div>

        <div className="form-field report-field-wide">
          <label>Imagen del reporte (opcional)</label>
          <input type="file" accept="image/*" onChange={handleImagenChange} />
          <span className="helper-text">Soporta JPG, PNG, WEBP y otros formatos de imagen.</span>
          {imagenDataUrl && (
            <img
              src={imagenDataUrl}
              alt="Vista previa del reporte"
              className="report-image"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={cargando}
            className="dashboard-button primary report-submit"
        >
          {cargando ? 'Creando...' : 'Crear Reporte'}
        </button>
      </form>
    </section>
  );
};

export default FormularioReporte;
