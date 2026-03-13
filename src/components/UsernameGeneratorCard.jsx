import { useEffect, useMemo, useRef, useState } from 'react';
import PasswordDisplay from './PasswordDisplay';
import GenerateButton from './GenerateButton';
import { copyText, generateUsername } from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';

const USERNAME_MODES = [
  {
    id: 'gaming',
    label: 'Gaming Usernames',
    description: 'Bold alias style like ShadowTiger92 and CyberNovaX.'
  },
  {
    id: 'professional',
    label: 'Professional Usernames',
    description: 'Clean brand-ready handles for work profiles and portfolios.'
  },
  {
    id: 'random',
    label: 'Random Usernames',
    description: 'Unpredictable combinations with strong uniqueness.'
  }
];

function UsernameGeneratorCard() {
  const [username, setUsername] = useState('');
  const [showUsername, setShowUsername] = useState(false);
  const [mode, setMode] = useState('gaming');
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeTag, setIncludeTag] = useState(true);
  const [pulse, setPulse] = useState(false);
  const [toast, setToast] = useState('');

  const toastTimerRef = useRef(null);
  const pulseTimerRef = useRef(null);

  const activeMode = useMemo(
    () => USERNAME_MODES.find((item) => item.id === mode) || USERNAME_MODES[0],
    [mode]
  );

  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1700);
  };

  const setPulseEffect = () => {
    setPulse(true);
    if (pulseTimerRef.current) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => setPulse(false), 280);
  };

  const saveToHistory = (newUsername) => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      let history = [];
      if (raw) history = JSON.parse(raw);
      if (!Array.isArray(history)) history = [];

      const historyItem = {
        id: `username-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        password: newUsername,
        createdAt: new Date().toISOString()
      };

      const updatedHistory = [historyItem, ...history].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save username history', error);
    }
  };

  const handleGenerate = () => {
    const value = generateUsername({ mode, includeNumber, includeTag });
    setUsername(value);
    setPulseEffect();
    saveToHistory(value);
  };

  const handleCopyUsername = async () => {
    const copied = await copyText(username);
    showToast(copied ? 'Username Copied' : 'Copy failed');
  };

  useEffect(() => {
    handleGenerate();
  }, [mode, includeNumber, includeTag]);

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
      <section className="generator-card glass-panel">
        <div className="card-header">
          <h2>Random Username Generator</h2>
          <span className="card-badge">Secure Handles</span>
        </div>

        <PasswordDisplay
          password={username}
          visible={showUsername}
          pulse={pulse}
          onToggleVisibility={() => setShowUsername((prev) => !prev)}
          onCopy={handleCopyUsername}
          onRegenerate={handleGenerate}
          label="Generated Username"
          inputId="generated-username"
          valueType="username"
        />

        <section className="options-section mt-4">
          <h3>Username Options</h3>
          <div className="radio-group">
            {USERNAME_MODES.map((item) => (
              <label key={item.id} className={`radio-pill ${mode === item.id ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="username-mode"
                  value={item.id}
                  checked={mode === item.id}
                  onChange={() => setMode(item.id)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
          <p className="username-mode-note">{activeMode.description}</p>
        </section>

        <section className="options-section mt-4">
          <h3>Security Tweaks</h3>
          <div className="option-grid">
            <label className="option-item">
              <div className="option-copy">
                <span>Add Random Number</span>
                <small>Improves uniqueness</small>
              </div>
              <input
                type="checkbox"
                checked={includeNumber}
                onChange={() => setIncludeNumber((prev) => !prev)}
                aria-label="Add random number"
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
            </label>

            <label className="option-item">
              <div className="option-copy">
                <span>Add Extra Tag</span>
                <small>Example: AI / Pro / HQ</small>
              </div>
              <input
                type="checkbox"
                checked={includeTag}
                onChange={() => setIncludeTag((prev) => !prev)}
                aria-label="Add extra tag"
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
            </label>
          </div>
        </section>

        <GenerateButton onClick={handleGenerate}>Generate Username</GenerateButton>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>
    </div>
  );
}

export default UsernameGeneratorCard;
