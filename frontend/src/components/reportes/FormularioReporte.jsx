import { useState } from 'react';
import toast from 'react-hot-toast';
import { Sparkles, Mic, PenLine, MicOff } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import SelectField from '../ui/SelectField';
import { crearReporte, crearReporteManual } from '../../services/reporteService';
import { REPORTE_CATEGORIAS } from '../../constants/reporteCategories';
import { useVoiceDictation } from '../../hooks/useVoiceDictation';

const MODES = [
  { id: 'ia', label: 'Texto + IA', desc: 'Describe el caso; Llama local estructura el reporte.', icon: Sparkles },
  { id: 'voice', label: 'Voz + IA', desc: 'Dicta en español; puedes editar antes de enviar.', icon: Mic },
  { id: 'manual', label: 'Formulario', desc: 'Completa los campos sin usar el modelo.', icon: PenLine }
];

function VoiceTextareaBlock({ mensaje, setMensaje, cargando }) {
  const {
    listening,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition
  } = useVoiceDictation(mensaje, setMensaje);

  return (
    <>
      <div className="voice-toolbar">
        {!browserSupportsSpeechRecognition ? (
          <p className="feedback warning voice-toolbar__warn">
            Tu navegador no permite reconocimiento de voz. Prueba Chrome o Edge en escritorio.
          </p>
        ) : (
          <>
            <Button
              type="button"
              variant={listening ? 'danger' : 'primary'}
              size="md"
              disabled={cargando}
              onClick={() => (listening ? stopListening() : startListening())}
              className="voice-toolbar__btn"
            >
              {listening ? (
                <>
                  <MicOff size={18} /> Detener
                </>
              ) : (
                <>
                  <Mic size={18} /> Hablar
                </>
              )}
            </Button>
            <span className={`voice-pill ${listening ? 'voice-pill--live' : ''}`}>
              {listening ? 'Escuchando…' : 'Listo para dictar'}
            </span>
          </>
        )}
      </div>

      <Textarea
        label="Texto (editable, se actualiza al dictar)"
        name="mensaje"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        required
        minLength={10}
        rows={6}
        placeholder="Ej.: Acumulación de residuos en la Carrera 70 con Calle 44, frente al parque…"
        disabled={cargando}
      />
    </>
  );
}

function ImageField({ imagenDataUrl, onFileChange, onClear, disabled }) {
  return (
    <div className="ui-field report-image-field">
      <label className="ui-label">Foto (opcional)</label>
      <input type="file" accept="image/*" onChange={onFileChange} disabled={disabled} className="ui-file" />
      <p className="ui-hint">Máx. 5 MB · no se envía a la IA</p>
      {imagenDataUrl ? (
        <div className="image-preview-container">
          <img src={imagenDataUrl} alt="Vista previa" className="report-image" />
          <button type="button" className="remove-image-btn" onClick={onClear} disabled={disabled}>
            ✕
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function FormularioReporte({ onReporteCreado }) {
  const [mode, setMode] = useState('ia');

  const [mensaje, setMensaje] = useState('');
  const [imagenDataUrl, setImagenDataUrl] = useState('');

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Otro');
  const [ubicacion, setUbicacion] = useState('');
  const [manualErrors, setManualErrors] = useState({});

  const [cargando, setCargando] = useState(false);

  const handleImagenChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setImagenDataUrl('');
      return;
    }
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Selecciona un archivo de imagen');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagenDataUrl(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const appendPayloadImagen = (payload) => {
    if (imagenDataUrl) payload.imagen = imagenDataUrl;
  };

  const validateManual = () => {
    const err = {};
    if (!titulo.trim() || titulo.trim().length < 3) err.titulo = 'Mínimo 3 caracteres';
    if (!descripcion.trim() || descripcion.trim().length < 10) {
      err.descripcion = 'Mínimo 10 caracteres';
    }
    if (!ubicacion.trim()) err.ubicacion = 'Indica la ubicación';
    setManualErrors(err);
    return Object.keys(err).length === 0;
  };

  const submitIaOrVoice = async () => {
    if (!mensaje.trim()) {
      toast.error('Escribe o dicta una descripción del problema');
      return;
    }
    if (mensaje.trim().length < 10) {
      toast.error('Añade un poco más de detalle (mínimo 10 caracteres)');
      return;
    }
    setCargando(true);
    try {
      const payload = { mensaje: mensaje.trim() };
      appendPayloadImagen(payload);
      const response = await crearReporte(payload);
      const iaOk = response?.iaDisponible !== false;
      if (!iaOk) {
        toast(
          'Reporte guardado. La IA local no respondió; revisa Ollama si quieres clasificación automática.',
          { icon: '⚠️' }
        );
      } else {
        toast.success(response?.mensaje || 'Reporte registrado');
      }
      setMensaje('');
      setImagenDataUrl('');
      onReporteCreado?.(response?.reporte?._id);
    } catch (err) {
      const data = err.response?.data;
      const msg =
        data?.mensaje ||
        data?.error ||
        (err.response?.status === 413 ? 'La petición es demasiado grande (prueba sin imagen).' : null);
      toast.error(msg || 'No se pudo crear el reporte');
    } finally {
      setCargando(false);
    }
  };

  const submitManual = async () => {
    if (!validateManual()) {
      toast.error('Revisa los campos marcados');
      return;
    }
    setCargando(true);
    try {
      const payload = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria,
        ubicacion: ubicacion.trim()
      };
      appendPayloadImagen(payload);
      const response = await crearReporteManual(payload);
      toast.success(response?.mensaje || 'Reporte manual creado');
      setTitulo('');
      setDescripcion('');
      setCategoria('Otro');
      setUbicacion('');
      setImagenDataUrl('');
      setManualErrors({});
      onReporteCreado?.(response?.reporte?._id);
    } catch (err) {
      const data = err.response?.data;
      toast.error(data?.mensaje || data?.error || 'Error al guardar');
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'manual') submitManual();
    else submitIaOrVoice();
  };

  return (
    <Card className="report-create-card" elevated>
      <div className="report-create-head">
        <div>
          <h2 className="report-create-title">Nuevo reporte</h2>
          <p className="ui-lead">
            Elige cómo quieres cargar la incidencia. La integración con <strong>Llama (Ollama)</strong>{' '}
            solo se usa en modos de texto o voz.
          </p>
        </div>
      </div>

      <div className="report-mode-tabs" role="tablist" aria-label="Modo de reporte">
        {MODES.map(({ id, label, desc, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={`report-mode-tab ${mode === id ? 'report-mode-tab--active' : ''}`}
            onClick={() => setMode(id)}
          >
            <Icon size={20} strokeWidth={2} aria-hidden />
            <span className="report-mode-tab__label">{label}</span>
            <span className="report-mode-tab__desc">{desc}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="report-create-form">
        {(mode === 'ia' || mode === 'voice') && (
          <>
            {mode === 'voice' ? (
              <VoiceTextareaBlock mensaje={mensaje} setMensaje={setMensaje} cargando={cargando} />
            ) : (
              <Textarea
                label="Describe el problema"
                name="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
                minLength={10}
                rows={6}
                placeholder="Ej.: Acumulación de residuos en la Carrera 70 con Calle 44, frente al parque…"
                disabled={cargando}
              />
            )}

            <ImageField
              imagenDataUrl={imagenDataUrl}
              onFileChange={handleImagenChange}
              onClear={() => setImagenDataUrl('')}
              disabled={cargando}
            />
          </>
        )}

        {mode === 'manual' && (
          <>
            <Input
              label="Título"
              name="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              error={manualErrors.titulo}
              maxLength={100}
              disabled={cargando}
            />
            <Textarea
              label="Descripción"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              error={manualErrors.descripcion}
              rows={5}
              minLength={10}
              disabled={cargando}
            />
            <SelectField
              label="Categoría"
              name="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              disabled={cargando}
            >
              {REPORTE_CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </SelectField>
            <Input
              label="Ubicación"
              name="ubicacion"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              error={manualErrors.ubicacion}
              placeholder="Barrio, dirección o punto de referencia"
              disabled={cargando}
            />
            <ImageField
              imagenDataUrl={imagenDataUrl}
              onFileChange={handleImagenChange}
              onClear={() => setImagenDataUrl('')}
              disabled={cargando}
            />
          </>
        )}

        <div className="report-create-actions">
          <Button type="submit" variant="primary" disabled={cargando}>
            {cargando ? 'Guardando…' : mode === 'manual' ? 'Enviar reporte manual' : 'Enviar reporte'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
