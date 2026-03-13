const optionLabels = {
  uppercase: 'Uppercase letters (A-Z)',
  lowercase: 'Lowercase letters (a-z)',
  numbers: 'Numbers (0-9)',
  symbols: 'Symbols (!@#$%^&*)'
};

function OptionsPanel({ options, onToggleOption }) {
  return (
    <section className="options-section">
      <h3>Character Options</h3>
      <div className="option-grid">
        {Object.entries(options).map(([key, enabled]) => (
          <label key={key} className="option-item">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => onToggleOption(key)}
              aria-label={optionLabels[key]}
            />
            <span className="custom-check" aria-hidden="true" />
            <span>{optionLabels[key]}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

export default OptionsPanel;
