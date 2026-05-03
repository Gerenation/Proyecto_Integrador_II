import { ClipboardList, CheckCircle2, UserRound, Shield } from 'lucide-react';
import { DASHBOARD_NAV_SECTIONS } from '../../constants/dashboardNav';

const ICONS = {
  crear: ClipboardList,
  atendidos: CheckCircle2,
  perfil: UserRound,
  admin: Shield
};

export default function MainNavigation({ sections, activeSection, onSectionChange }) {
  const items = sections || DASHBOARD_NAV_SECTIONS;

  return (
    <nav className="dash-nav" aria-label="Secciones principales">
      <div className="dash-nav__track">
        {items.map((section) => {
          const Icon = ICONS[section.id];
          const active = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              className={`dash-nav__btn ${active ? 'dash-nav__btn--active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              aria-current={active ? 'page' : undefined}
            >
              {Icon ? <Icon size={18} strokeWidth={2} aria-hidden /> : null}
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
