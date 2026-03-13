import { useEffect, useMemo, useRef, useState } from 'react';
import PasswordDisplay from './PasswordDisplay';
import GenerateButton from './GenerateButton';
import StrengthMeter from './StrengthMeter';
import { copyText, generateSmartPassword, scorePassword } from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';

function SmartPasswordGeneratorCard() {
  const [favoriteWord, setFavoriteWord] = useState('tiger');
  const [year, setYear] = useState('2024');
  const [keyword, setKeyword] = useState('secure');
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
        id: `smart-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        password: value,
        createdAt: new Date().toISOString(),
        type: 'smart'
      };

      const updatedHistory = [historyItem, ...history].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save smart password history', error);
    }
  };

  const handleGenerate = () => {
    const value = generateSmartPassword({
      favoriteWord,
      year,
      keyword
    });

    setPassword(value);
    triggerPulse();
    showToast('Smart password generated');
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
    handleGenerate();

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
      <section className="generator-card glass-panel smart-card">
        <div className="card-header">
          <h2>Smart Password Generator</h2>
          <span className="card-badge">Preference Based</span>
        </div>

        <section className="options-section mt-4">
          <h3>Take 3 Inputs</h3>
          <div className="smart-input-grid">
            <label className="smart-field">
              <span>Favorite Word</span>
              <input
                type="text"
                value={favoriteWord}
                onChange={(event) => setFavoriteWord(event.target.value)}
                placeholder="tiger"
                className="smart-input"
              />
            </label>

            <label className="smart-field">
              <span>Year</span>
              <input
                type="text"
                value={year}
                onChange={(event) => setYear(event.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                placeholder="2024"
                className="smart-input"
                inputMode="numeric"
              />
            </label>

            <label className="smart-field">
              <span>Security Keyword</span>
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="secure"
                className="smart-input"
              />
            </label>
          </div>

          <p className="smart-note">Example output style: Tiger$2024!Secure</p>
        </section>

        <PasswordDisplay
          password={password}
          visible={visible}
          pulse={pulse}
          onToggleVisibility={() => setVisible((prev) => !prev)}
          onCopy={handleCopy}
          onRegenerate={handleGenerate}
          label="Generated Password"
          inputId="generated-smart-password"
          valueType="password"
        />

        <StrengthMeter strength={strength} />

        <GenerateButton onClick={handleGenerate}>Generate Smart Password</GenerateButton>

        <button type="button" className="text-btn smart-save-btn" onClick={handleSave}>
          Save
        </button>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>
    </div>
  );
}

export default SmartPasswordGeneratorCard;
