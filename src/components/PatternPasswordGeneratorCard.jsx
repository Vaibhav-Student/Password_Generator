import { useEffect, useMemo, useRef, useState } from 'react';
import PasswordDisplay from './PasswordDisplay';
import GenerateButton from './GenerateButton';
import StrengthMeter from './StrengthMeter';
import { copyText, generatePatternPassword, scorePassword } from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';
const DEFAULT_PATTERN = 'AA-999-@@';
const PATTERN_EXAMPLES = ['AA-999-@@', 'AAA999', 'A9A9-A9@', 'AAaa-99@@'];

function PatternPasswordGeneratorCard() {
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [toast, setToast] = useState('');

  const toastTimerRef = useRef(null);
  const pulseTimerRef = useRef(null);

  const strength = useMemo(() => scorePassword(password), [password]);

  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1700);
  };

  const triggerPulse = () => {
    setPulse(true);
    if (pulseTimerRef.current) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => setPulse(false), 280);
  };

  const saveToHistory = (value) => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      let history = [];
      if (raw) history = JSON.parse(raw);
      if (!Array.isArray(history)) history = [];

      const historyItem = {
        id: `pattern-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        password: value,
        createdAt: new Date().toISOString(),
        type: 'pattern'
      };

      const updatedHistory = [historyItem, ...history].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save pattern password history', error);
    }
  };

  const handleGenerate = (overridePattern) => {
    const targetPattern = typeof overridePattern === 'string' ? overridePattern : pattern;
    const value = generatePatternPassword(targetPattern);

    if (!value) {
      showToast('Use at least one token: A, a, 9, @');
      return;
    }

    setPassword(value);
    triggerPulse();
    showToast('Pattern password generated');
  };

  const handleCopy = async () => {
    const copied = await copyText(password);
    showToast(copied ? 'Password copied' : 'Copy failed');
  };

  const handleSave = () => {
    if (!password) {
      showToast('Generate a password first');
      return;
    }
    saveToHistory(password);
    showToast('Saved to history');
  };

  const handlePatternExample = (nextPattern) => {
    setPattern(nextPattern);
    handleGenerate(nextPattern);
  };

  useEffect(() => {
    handleGenerate(DEFAULT_PATTERN);

    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      if (pulseTimerRef.current) {
        window.clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="generator-stack">
      <section className="generator-card glass-panel pattern-card">
        <div className="card-header">
          <h2>Password Pattern Generator</h2>
          <span className="card-badge">Custom Rules</span>
        </div>

        <section className="options-section mt-4">
          <h3>Pattern Input</h3>
          <p className="pattern-note">Example: AA-999-@@</p>
          <div className="display-field pattern-input-field">
            <input
              type="text"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              placeholder="AA-999-@@"
              className="pattern-input"
              aria-label="Pattern input"
            />
          </div>
        </section>

        <section className="options-section mt-4">
          <h3>Pattern Legend</h3>
          <div className="pattern-legend-grid">
            <div className="pattern-legend-item"><code>A</code> Uppercase letter</div>
            <div className="pattern-legend-item"><code>a</code> Lowercase letter</div>
            <div className="pattern-legend-item"><code>9</code> Number</div>
            <div className="pattern-legend-item"><code>@</code> Symbol</div>
          </div>
          <p className="pattern-note">Any other character stays fixed (example: -, _, #).</p>
        </section>

        <section className="options-section mt-4">
          <h3>Quick Patterns</h3>
          <div className="radio-group">
            {PATTERN_EXAMPLES.map((item) => (
              <button
                key={item}
                type="button"
                className={`radio-pill pattern-pill ${pattern === item ? 'active' : ''}`}
                onClick={() => handlePatternExample(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <PasswordDisplay
          password={password}
          visible={visible}
          pulse={pulse}
          onToggleVisibility={() => setVisible((prev) => !prev)}
          onCopy={handleCopy}
          onRegenerate={() => handleGenerate()}
          label="Generated Result"
          inputId="generated-pattern-password"
          valueType="password"
        />

        <StrengthMeter strength={strength} />

        <GenerateButton onClick={() => handleGenerate()}>Generate From Pattern</GenerateButton>

        <button type="button" className="text-btn pattern-save-btn" onClick={handleSave}>
          Save
        </button>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>
    </div>
  );
}

export default PatternPasswordGeneratorCard;
