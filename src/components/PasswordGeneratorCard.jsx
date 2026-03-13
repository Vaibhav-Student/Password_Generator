import { useEffect, useMemo, useRef, useState } from 'react';
import PasswordDisplay from './PasswordDisplay';
import LengthSlider from './LengthSlider';
import CharacterOptions from './CharacterOptions';
import StrengthMeter from './StrengthMeter';
import GenerateButton from './GenerateButton';
import { copyText, generatePassword, scorePassword } from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';

function PasswordGeneratorCard() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [length, setLength] = useState(16);
  const [toast, setToast] = useState('');
  const [pulse, setPulse] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

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

  const setPulseEffect = () => {
    setPulse(true);
    if (pulseTimerRef.current) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => setPulse(false), 280);
  };

  const saveToHistory = (newPassword) => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      let history = [];
      if (raw) history = JSON.parse(raw);
      if (!Array.isArray(history)) history = [];

      const historyItem = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        password: newPassword,
        createdAt: new Date().toISOString()
      };

      const updatedHistory = [historyItem, ...history].slice(0, 50); // Keep last 50
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save to history', e);
    }
  };

  const handleGenerate = () => {
    const value = generatePassword({ length, options });

    if (!value) {
      showToast('Enable at least one character option');
      return;
    }

    setPassword(value);
    saveToHistory(value);
    setPulseEffect();
  };

  const handleCopyPassword = async () => {
    const copied = await copyText(password);
    showToast(copied ? 'Password Copied' : 'Copy failed');
  };

  const handleToggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
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
      <section className="generator-card glass-panel">
        <div className="card-header">
          <h2>Password Generator</h2>
          <span className="card-badge">Premium Glass UI</span>
        </div>

        <PasswordDisplay
          password={password}
          visible={showPassword}
          pulse={pulse}
          onToggleVisibility={() => setShowPassword((prev) => !prev)}
          onCopy={handleCopyPassword}
          onRegenerate={handleGenerate}
        />

        <LengthSlider value={length} min={6} max={32} onChange={setLength} />

        <CharacterOptions options={options} onToggle={handleToggleOption} />

        <StrengthMeter strength={strength} />

        <GenerateButton onClick={handleGenerate}>Generate Password</GenerateButton>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>
    </div>
  );
}

export default PasswordGeneratorCard;