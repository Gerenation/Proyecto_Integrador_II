import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Shield, UserRound, Pencil, MapPin, IdCard } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { actualizarPerfil } from '../../services/authService';
import { TIPOS_IDENTIFICACION } from '../../constants/tipoIdentificacion';
import UserAvatar from './UserAvatar';

const labelTipo = (v) => TIPOS_IDENTIFICACION.find((t) => t.value === v)?.label || v;

export default function ProfilePanel({ usuario }) {
  const { refreshUsuario } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [direccion, setDireccion] = useState(usuario?.direccion || '');
  const [fotoPreview, setFotoPreview] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFotoPreview('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona una imagen');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = {};
      if (nombre.trim() !== usuario?.nombre) {
        payload.nombre = nombre.trim();
      }
      if (direccion.trim() !== usuario?.direccion) {
        payload.direccion = direccion.trim();
      }
      if (fotoPreview) payload.fotoPerfil = fotoPreview;
      
      if (Object.keys(payload).length === 0) {
        toast.error('No hay cambios para guardar');
        setGuardando(false);
        return;
      }

      const { usuario: u } = await actualizarPerfil(payload);
      if (u) {
        localStorage.setItem('usuario', JSON.stringify(u));
        await refreshUsuario();
      }
      toast.success('Perfil actualizado');
      setEditOpen(false);
      setFotoPreview('');
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card className="profile-card">
      <div className="profile-card__header">
        <UserAvatar usuario={usuario} size={72} />
        <div>
          <h2 className="profile-card__title">Tu perfil</h2>
          <p className="ui-hint">Datos de tu cuenta</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-row">
          <span className="profile-row__icon">
            <UserRound size={18} />
          </span>
          <div>
            <span className="profile-row__label">Nombre</span>
            <span className="profile-row__value">{usuario?.nombre || '—'}</span>
          </div>
        </div>
        <div className="profile-row">
          <span className="profile-row__icon">
            <Mail size={18} />
          </span>
          <div>
            <span className="profile-row__label">Correo</span>
            <span className="profile-row__value">{usuario?.email || '—'}</span>
          </div>
        </div>
        <div className="profile-row">
          <span className="profile-row__icon">
            <Shield size={18} />
          </span>
          <div>
            <span className="profile-row__label">Rol</span>
            <span className="profile-row__value">
              {usuario?.rol === 'admin' ? 'Administrador' : 'Ciudadano'}
            </span>
          </div>
        </div>
        <div className="profile-row">
          <span className="profile-row__icon">
            <MapPin size={18} />
          </span>
          <div>
            <span className="profile-row__label">Dirección</span>
            <span className="profile-row__value">{usuario?.direccion || '—'}</span>
          </div>
        </div>
        <div className="profile-row">
          <span className="profile-row__icon">
            <IdCard size={18} />
          </span>
          <div>
            <span className="profile-row__label">Identificación</span>
            <span className="profile-row__value">
              {labelTipo(usuario?.tipoIdentificacion)} · {usuario?.numeroIdentificacion || '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-card__footer">
        <Button
          type="button"
          variant="outline"
          className="profile-edit-btn"
          onClick={() => {
            setNombre(usuario?.nombre || '');
            setDireccion(usuario?.direccion || '');
            setFotoPreview('');
            setEditOpen(true);
          }}
        >
          <Pencil size={16} aria-hidden />
          Editar perfil
        </Button>
      </div>

      <Modal open={editOpen} title="Editar perfil" onClose={() => setEditOpen(false)}>
        <form onSubmit={guardarPerfil} className="profile-edit-form">
          <p className="ui-hint modal-intro">
            El tipo y número de documento no se pueden cambiar aquí. Contacta a un administrador si hay
            un error.
          </p>
          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            minLength={2}
            required
          />
          <Input
            label="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
          <div className="ui-field">
            <label className="ui-label">Nueva foto de perfil</label>
            <input type="file" accept="image/*" className="ui-file" onChange={handleFoto} />
            <span className="ui-hint">Opcional · máx. 5 MB</span>
            {fotoPreview ? (
              <img src={fotoPreview} alt="" className="profile-foto-preview" />
            ) : null}
          </div>
          <div className="profile-edit-actions">
            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
