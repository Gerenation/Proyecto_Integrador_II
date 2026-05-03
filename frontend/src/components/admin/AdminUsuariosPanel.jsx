import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { listarUsuarios } from '../../services/adminService';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Panel admin: listado de usuarios y atajo para filtrar reportes por usuario.
 */
export default function AdminUsuariosPanel({ onVerReportesUsuario }) {
  const [rolTab, setRolTab] = useState('todos');
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargar();
  }, [rolTab]);

  const cargar = async () => {
    try {
      setCargando(true);
      const params = {};
      if (rolTab === 'admin') params.rol = 'admin';
      if (rolTab === 'ciudadano') params.rol = 'ciudadano';
      const data = await listarUsuarios(params);
      setLista(data.usuarios || []);
    } catch (e) {
      toast.error(e.response?.data?.mensaje || 'No se pudo cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Card className="admin-users-card" elevated>
      <h2 className="report-list-title">Gestión de usuarios</h2>
      <p className="ui-hint admin-users-lead">
        Lista de cuentas registradas. Puedes abrir los reportes filtrados por ciudadano.
      </p>

      <div className="admin-rol-tabs">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'admin', label: 'Administradores' },
          { id: 'ciudadano', label: 'Ciudadanos' }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-rol-tab ${rolTab === t.id ? 'admin-rol-tab--active' : ''}`}
            onClick={() => setRolTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <p className="ui-hint">Cargando…</p>
      ) : (
        <ul className="admin-user-list">
          {lista.map((u) => (
            <li key={u.id} className="admin-user-row">
              <div className="admin-user-main">
                <strong>{u.nombre}</strong>
                <span className="ui-hint">{u.email}</span>
                <span className={`admin-user-badge admin-user-badge--${u.rol}`}>{u.rol}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onVerReportesUsuario(u.id, u.nombre);
                  toast.success(`Filtro: reportes de ${u.nombre}`);
                }}
              >
                Ver reportes
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
