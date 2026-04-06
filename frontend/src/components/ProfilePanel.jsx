const ProfilePanel = ({ usuario }) => {
  return (
    <section className="panel">
      <h2>Perfil del usuario</h2>
      <p className="helper-text">Datos cargados de la sesión actual (mock para futuras mejoras).</p>

      <div className="form-grid">
        <div className="form-field">
          <label>Nombre</label>
          <input value={usuario?.nombre || ''} readOnly />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input value={usuario?.email || ''} readOnly />
        </div>
        <div className="form-field">
          <label>Rol</label>
          <input value={usuario?.rol || 'ciudadano'} readOnly />
        </div>
      </div>
    </section>
  );
};

export default ProfilePanel;

