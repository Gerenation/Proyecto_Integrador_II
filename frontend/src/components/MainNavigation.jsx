const sections = [
  { id: 'crear', label: 'Crear reportes' },
  { id: 'atendidos', label: 'Ver reportes atendidos' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'chatbot', label: 'Chatbot (próximamente)' }
];

const MainNavigation = ({ activeSection, onSectionChange }) => {
  return (
    <div className="dashboard-nav-links">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          className={`dashboard-nav-button ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => onSectionChange(section.id)}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
};

export default MainNavigation;

