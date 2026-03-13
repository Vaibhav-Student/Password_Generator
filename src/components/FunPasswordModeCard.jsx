import { useEffect, useMemo, useRef, useState } from 'react';
import PasswordDisplay from './PasswordDisplay';
import GenerateButton from './GenerateButton';
import StrengthMeter from './StrengthMeter';
import { copyText, generateFunPassword, scorePassword } from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';

const THEMES = [
  { id: 'mixed', label: 'Mixed Theme' },
  { id: 'space', label: 'Space Theme' },
  { id: 'fantasy', label: 'Fantasy Theme' },
  { id: 'nature', label: 'Nature Theme' },
  { id: 'food', label: 'Food Theme' },
  { id: 'animals', label: 'Animal Theme' }
];

function FunPasswordModeCard() {
  const [mode, setMode] = useState('fun');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [toast, setToast] = useState('');
  const [wordCount, setWordCount] = useState(3);
  const [theme, setTheme] = useState('mixed');
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeSymbol, setIncludeSymbol] = useState(true);
  const [capitalizeWords, setCapitalizeWords] = useState(true);
  const [includeEmoji, setIncludeEmoji] = useState(false);
  const [storyMode, setStoryMode] = useState(false);
  const [parts, setParts] = useState([]);

  const toastTimerRef = useRef(null);
  const pulseTimerRef = useRef(null);

  const strength = useMemo(() => scorePassword(password), [password]);

  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1800);
  };

  const triggerPulse = () => {
    setPulse(true);
    if (pulseTimerRef.current) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => setPulse(false), 300);
  };

  const saveToHistory = (value) => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      let history = [];
      if (raw) history = JSON.parse(raw);
      if (!Array.isArray(history)) history = [];

      const historyItem = {
        id: `fun-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        password: value,
        createdAt: new Date().toISOString(),
        type: mode === 'strong' ? 'strong' : 'fun'
      };

      const updatedHistory = [historyItem, ...history].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save fun password history', error);
    }
  };

  const handleGenerate = (silent = false) => {
    const generated = generateFunPassword({
      mode,
      wordCount,
      theme,
      includeNumber,
      includeSymbol,
      capitalizeWords,
      includeEmoji,
      storyMode
    });

    setPassword(generated.password);
    setParts(generated.words || []);
    triggerPulse();

    if (!silent) {
      showToast(mode === 'strong' ? 'Strong password generated' : 'Fun password generated');
    }
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

  useEffect(() => {
    handleGenerate(true);
  }, [
    mode,
    wordCount,
    theme,
    includeNumber,
    includeSymbol,
    capitalizeWords,
    includeEmoji,
    storyMode
  ]);

  useEffect(() => {
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
      <section className="generator-card glass-panel fun-card">
        <div className="card-header">
          <h2>Fun Password Mode</h2>
          <span className="card-badge">Memorable + Strong</span>
        </div>

        <section className="options-section mt-4">
          <h3>Mode Selector</h3>
          <div className="radio-group">
            <label className={`radio-pill ${mode === 'strong' ? 'active' : ''}`}>
              <input
                type="radio"
                name="fun-mode-type"
                checked={mode === 'strong'}
                onChange={() => setMode('strong')}
                className="sr-only"
              />
              Strong Password
            </label>
            <label className={`radio-pill ${mode === 'fun' ? 'active' : ''}`}>
              <input
                type="radio"
                name="fun-mode-type"
                checked={mode === 'fun'}
                onChange={() => setMode('fun')}
                className="sr-only"
              />
              Fun Password Mode
            </label>
          </div>
        </section>

        <PasswordDisplay
          password={password}
          visible={visible}
          pulse={pulse}
          onToggleVisibility={() => setVisible((prev) => !prev)}
          onCopy={handleCopy}
          onRegenerate={() => handleGenerate()}
          label="Generated Password"
          inputId="generated-fun-password"
          valueType="password"
        />

        {mode === 'fun' ? (
          <>
            <section className="options-section mt-4">
              <h3>Word Count</h3>
              <div className="radio-group">
                {[3, 4, 5].map((count) => (
                  <label key={count} className={`radio-pill ${wordCount === count ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="word-count"
                      checked={wordCount === count}
                      onChange={() => setWordCount(count)}
                      className="sr-only"
                    />
                    {count} words
                  </label>
                ))}
              </div>
            </section>

            <section className="options-section mt-4">
              <h3>Theme-Based Passwords</h3>
              <div className="radio-group">
                {THEMES.map((item) => (
                  <label key={item.id} className={`radio-pill ${theme === item.id ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="theme-mode"
                      checked={theme === item.id}
                      onChange={() => setTheme(item.id)}
                      className="sr-only"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </section>

            <section className="options-section mt-4">
              <h3>Options</h3>
              <div className="option-grid">
                <label className="option-item">
                  <div className="option-copy">
                    <span>Add Numbers</span>
                    <small>Example: ...42</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeNumber}
                    onChange={() => setIncludeNumber((prev) => !prev)}
                    aria-label="Add numbers"
                  />
                  <span className="toggle-track"><span className="toggle-thumb" /></span>
                </label>

                <label className="option-item">
                  <div className="option-copy">
                    <span>Add Symbols</span>
                    <small>Example: ...!</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeSymbol}
                    onChange={() => setIncludeSymbol((prev) => !prev)}
                    aria-label="Add symbols"
                  />
                  <span className="toggle-track"><span className="toggle-thumb" /></span>
                </label>

                <label className="option-item">
                  <div className="option-copy">
                    <span>Capitalize Words</span>
                    <small>DragonCoffeeMoon</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={capitalizeWords}
                    onChange={() => setCapitalizeWords((prev) => !prev)}
                    aria-label="Capitalize words"
                  />
                  <span className="toggle-track"><span className="toggle-thumb" /></span>
                </label>

                <label className="option-item">
                  <div className="option-copy">
                    <span>Add Emoji</span>
                    <small>Dragon??Coffee?</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeEmoji}
                    onChange={() => setIncludeEmoji((prev) => !prev)}
                    aria-label="Add emoji"
                  />
                  <span className="toggle-track"><span className="toggle-thumb" /></span>
                </label>

                <label className="option-item">
                  <div className="option-copy">
                    <span>Story Mode</span>
                    <small>DragonDrinksCoffeeOnMoon</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={storyMode}
                    onChange={() => setStoryMode((prev) => !prev)}
                    aria-label="Story mode"
                  />
                  <span className="toggle-track"><span className="toggle-thumb" /></span>
                </label>
              </div>
            </section>

            <section className="options-section mt-4">
              <h3>Word Preview</h3>
              <div className="fun-chip-row">
                {parts.map((part, index) => (
                  <span key={`${part}-${index}`} className={`fun-chip chip-${index % 5}`}>
                    {part}
                  </span>
                ))}
              </div>
            </section>
          </>
        ) : (
          <p className="fun-mode-note text-soft">
            Strong mode creates a high-entropy random password using upper/lowercase, numbers, and symbols.
          </p>
        )}

        <StrengthMeter strength={strength} />

        <GenerateButton onClick={() => handleGenerate()}>
          {mode === 'strong' ? 'Generate Strong Password' : 'Generate Fun Password'}
        </GenerateButton>

        <div className="fun-action-row">
          <button type="button" className="icon-btn fun-action-btn" onClick={handleCopy}>
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Copy
          </button>

          <button type="button" className="icon-btn fun-action-btn" onClick={handleSave}>
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <path d="M4 4h13l3 3v13H4V4Zm4 0v6h8V4M8 20v-6h8v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save
          </button>
        </div>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>
    </div>
  );
}

export default FunPasswordModeCard;
