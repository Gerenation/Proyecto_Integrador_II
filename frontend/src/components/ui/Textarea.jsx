export default function Textarea({ label, id, error, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className={`ui-field ${className}`.trim()}>
      {label ? (
        <label className="ui-label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={`ui-textarea ${error ? 'ui-input--error' : ''}`.trim()}
        {...props}
      />
      {error ? <span className="ui-field-error">{error}</span> : null}
    </div>
  );
}
