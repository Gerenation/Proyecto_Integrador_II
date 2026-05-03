/**
 * Botón consistente con variantes de marca.
 * variant: primary | secondary | danger | outline | ghost
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
