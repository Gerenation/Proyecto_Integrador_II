import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormularioReporte from '../../components/reportes/FormularioReporte';
import ListaReportes from '../../components/reportes/ListaReportes';
import DashboardHeader from '../../components/layout/DashboardHeader';
import ProfilePanel from '../../components/layout/ProfilePanel';
import AdminUsuariosPanel from '../../components/admin/AdminUsuariosPanel';
import { DASHBOARD_NAV_SECTIONS } from '../../constants/dashboardNav';

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('crear');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [usuarioFiltroId, setUsuarioFiltroId] = useState('');
  const [usuarioFiltroNombre, setUsuarioFiltroNombre] = useState('');

  const navSections = useMemo(() => {
    if (usuario?.rol === 'admin') {
      return [
        ...DASHBOARD_NAV_SECTIONS,
        { id: 'admin', label: 'Administración' }
      ];
    }
    return DASHBOARD_NAV_SECTIONS;
  }, [usuario?.rol]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReporteCreado = () => {
    setRefreshCounter((n) => n + 1);
  };

  const limpiarFiltroUsuario = () => {
    setUsuarioFiltroId('');
    setUsuarioFiltroNombre('');
  };

  const handleVerReportesUsuario = (userId, nombre) => {
    setUsuarioFiltroId(userId);
    setUsuarioFiltroNombre(nombre || '');
    setActiveSection('crear');
  };

  const renderContent = () => {
    if (activeSection === 'perfil') {
      return <ProfilePanel usuario={usuario} />;
    }
    if (activeSection === 'admin' && usuario?.rol === 'admin') {
      return (
        <AdminUsuariosPanel
          onVerReportesUsuario={(id, nombre) => handleVerReportesUsuario(id, nombre)}
        />
      );
    }
    if (activeSection === 'atendidos') {
      return (
        <ListaReportes
          onlyAttended
          refreshTrigger={refreshCounter}
          usuarioFiltroId={usuarioFiltroId}
          usuarioFiltroNombre={usuarioFiltroNombre}
          onLimpiarFiltroUsuario={limpiarFiltroUsuario}
        />
      );
    }
    return (
      <>
        <FormularioReporte onReporteCreado={handleReporteCreado} />
        <ListaReportes
          refreshTrigger={refreshCounter}
          usuarioFiltroId={usuarioFiltroId}
          usuarioFiltroNombre={usuarioFiltroNombre}
          onLimpiarFiltroUsuario={limpiarFiltroUsuario}
        />
      </>
    );
  };

  return (
    <div className="app-shell">
      <DashboardHeader
        usuario={usuario}
        navSections={navSections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />

      <main className="dash-main">
        <section className="dash-hero">
          <h1 className="dash-hero__title">Hola, {usuario?.nombre}</h1>
          <p className="dash-hero__sub">
            Incidencias urbanas con apoyo de IA local (Ollama). Imágenes almacenadas de forma segura;
            el modelo solo procesa texto.
          </p>
        </section>
        {renderContent()}
      </main>
    </div>
  );
}
