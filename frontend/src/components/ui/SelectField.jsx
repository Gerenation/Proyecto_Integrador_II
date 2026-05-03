export default function SelectField({ label, id, error, children, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className={`ui-field ${className}`.trim()}>
      {label ? (
        <label className="ui-label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <select
        id={inputId}
        className={`ui-select ${error ? 'ui-input--error' : ''}`.trim()}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="ui-field-error">{error}</span> : null}
    </div>
  );
}
