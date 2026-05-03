const LOGO_SRC = '/branding/logo-emvarias.png';

/**
 * Logo oficial Emvarias · Grupo EPM.
 * Archivo: `frontend/public/branding/logo-emvarias.png` (PNG con transparencia; sin fondo CSS encima).
 */
export default function EmvariasLogo({ compact = false, className = '' }) {
  return (
    <div className={`emvarias-logo ${compact ? 'emvarias-logo--compact' : ''} ${className}`.trim()}>
      <div className="emvarias-logo__img-wrap">
        <img
          src={LOGO_SRC}
          alt="Emvarias · Grupo EPM"
          className="emvarias-logo__img"
          loading="lazy"
          decoding="async"
        />
      </div>
      {!compact ? (
        <div className="emvarias-logo__product-row">
          <span className="emvarias-logo__product">SIVUR</span>
        </div>
      ) : null}
    </div>
  );
}
