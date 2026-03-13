function PasswordDisplay({
  password,
  visible,
  pulse,
  onToggleVisibility,
  onCopy,
  onRegenerate,
  label = 'Generated Password',
  inputId = 'generated-password',
  valueType = 'password'
}) {
  const normalizedValueType = valueType.toLowerCase();

  return (
    <section className="password-display">
      <label htmlFor={inputId}>{label}</label>
      <div className={`display-field ${pulse ? 'pulse' : ''}`}>
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          value={password}
          readOnly
          aria-label={`Generated ${normalizedValueType}`}
        />

        <div className="display-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onRegenerate}
            aria-label={`Regenerate ${normalizedValueType}`}
          >
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={onToggleVisibility}
            aria-label={`Toggle ${normalizedValueType} visibility`}
          >
            {visible ? (
              <svg viewBox="0 0 24 24" fill="none" role="presentation">
                <path d="M3 3 21 21M10.58 10.58A2 2 0 1 0 13.42 13.42M9.88 5.09A9.77 9.77 0 0 1 12 4c5 0 9 4 10 8a11.77 11.77 0 0 1-4.41 5.94M6.61 6.61A11.85 11.85 0 0 0 2 12c1 4 5 8 10 8a9.77 9.77 0 0 0 2.91-.44" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" role="presentation">
                <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={onCopy}
            aria-label={`Copy ${normalizedValueType}`}
          >
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="password-meta">
        <span className="char-count">{password.length} characters</span>
      </div>
    </section>
  );
}

export default PasswordDisplay;
