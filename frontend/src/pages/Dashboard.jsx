import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormularioReporte from '../components/FormularioReporte';
import ListaReportes from '../components/ListaReportes';

/**
 * Página Dashboard
 * 
 * Página principal después del login.
 * Muestra el formulario para crear reportes y la lista de reportes.
 * Solo accesible para usuarios autenticados.
 */
const Dashboard = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Barra de navegación */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h1 style={styles.logo}>SIVU</h1>
          <div style={styles.userInfo}>
            <span style={styles.userName}>
              {usuario?.nombre} ({usuario?.rol})
            </span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div style={styles.content}>
        <div style={styles.welcome}>
          <h2>Bienvenido, {usuario?.nombre}</h2>
          <p>Gestiona y reporta incidencias urbanas en tu comunidad</p>
        </div>

        {/* Formulario para crear reportes */}
        <FormularioReporte onReporteCreado={() => {
          // El componente ListaReportes se actualizará automáticamente
          // cuando se cree un nuevo reporte gracias al callback
        }} />

        {/* Lista de reportes */}
        <ListaReportes />
      </div>
    </div>
  );
};

// Estilos inline
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  userName: {
    fontSize: '16px'
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  welcome: {
    marginBottom: '30px',
    textAlign: 'center'
  }
};

export default Dashboard;
