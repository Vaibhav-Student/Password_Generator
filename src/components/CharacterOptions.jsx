const labels = {
  uppercase: { title: 'Uppercase letters', meta: 'A-Z' },
  lowercase: { title: 'Lowercase letters', meta: 'a-z' },
  numbers: { title: 'Numbers', meta: '0-9' },
  symbols: { title: 'Symbols', meta: '!@#$%^&*' }
};

function CharacterOptions({ options, onToggle }) {
  return (
    <section className="options-section">
      <h3>Character Options</h3>
      <div className="option-grid">
        {Object.entries(options).map(([key, enabled]) => (
          <label key={key} className="option-item">
            <div className="option-copy">
              <span>{labels[key].title}</span>
              <small>{labels[key].meta}</small>
            </div>

            <input
              type="checkbox"
              checked={enabled}
              onChange={() => onToggle(key)}
              aria-label={labels[key].title}
            />
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

export default CharacterOptions;