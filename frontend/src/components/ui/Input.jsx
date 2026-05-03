export default function Input({ label, id, error, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className={`ui-field ${className}`.trim()}>
      {label ? (
        <label className="ui-label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input id={inputId} className={`ui-input ${error ? 'ui-input--error' : ''}`.trim()} {...props} />
      {error ? <span className="ui-field-error">{error}</span> : null}
    </div>
  );
}
