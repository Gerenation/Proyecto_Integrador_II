import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import FormularioReporte from '../components/FormularioReporte';
import ListaReportes from '../components/ListaReportes';
import MainNavigation from '../components/MainNavigation';
import ProfilePanel from '../components/ProfilePanel';
import ChatbotPlaceholder from '../components/ChatbotPlaceholder';

/**
 * Página Dashboard
 * 
 * Página principal después del login.
 * Muestra el formulario para crear reportes y la lista de reportes.
 * Solo accesible para usuarios autenticados.
 */
const Dashboard = () => {
  const { usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('crear');
  const [refreshCounter, setRefreshCounter] = useState(0);

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReporteCreado = () => {
    setRefreshCounter((currentValue) => currentValue + 1);
  };

  const renderContent = () => {
    if (activeSection === 'perfil') {
      return <ProfilePanel usuario={usuario} />;
    }

    if (activeSection === 'chatbot') {
      return <ChatbotPlaceholder />;
    }

    if (activeSection === 'atendidos') {
      return <ListaReportes onlyAttended refreshTrigger={refreshCounter} />;
    }

    return (
      <>
        <FormularioReporte onReporteCreado={handleReporteCreado} />
        <ListaReportes refreshTrigger={refreshCounter} />
      </>
    );
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <div className="dashboard-nav-content">
          <h1 className="dashboard-brand">SIVUR</h1>
          <MainNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
          <div className="dashboard-actions">
            <span className="helper-text">
              {usuario?.nombre} ({usuario?.rol})
            </span>
            <button type="button" onClick={toggleTheme} className="dashboard-button primary">
              {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            </button>
            <button type="button" onClick={handleLogout} className="dashboard-button danger">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <section className="panel">
          <h2>Bienvenido, {usuario?.nombre}</h2>
          <p className="helper-text">
            Gestiona incidencias urbanas con una navegación modular y preparada para escalar.
          </p>
        </section>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
