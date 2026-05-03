import { LogOut } from 'lucide-react';
import EmvariasLogo from '../branding/EmvariasLogo';
import MainNavigation from './MainNavigation';
import ThemeToggle from './ThemeToggle';
import UserAvatar from './UserAvatar';
import Button from '../ui/Button';

export default function DashboardHeader({
  usuario,
  navSections,
  activeSection,
  onSectionChange,
  onLogout
}) {
  return (
    <header className="dash-header">
      <div className="dash-header__inner">
        <div className="dash-header__brand">
          <EmvariasLogo compact />
          <div className="dash-header__titles">
            <span className="dash-header__product">SIVUR</span>
            <span className="dash-header__tagline">Incidencias urbanas</span>
          </div>
        </div>

        <MainNavigation sections={navSections} activeSection={activeSection} onSectionChange={onSectionChange} />

        <div className="dash-header__actions">
          <div className="dash-header__user dash-header__user--with-avatar" title={`${usuario?.nombre} · ${usuario?.rol}`}>
            <UserAvatar usuario={usuario} size={40} />
            <div className="dash-header__user-text">
              <span className="dash-header__user-name">{usuario?.nombre}</span>
              <span className="dash-header__user-role">{usuario?.rol}</span>
            </div>
          </div>
          <ThemeToggle />
          <Button
            type="button"
            variant="danger"
            size="sm"
            className="dash-header__logout"
            onClick={onLogout}
          >
            <LogOut size={16} aria-hidden />
            <span className="dash-header__logout-text">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
