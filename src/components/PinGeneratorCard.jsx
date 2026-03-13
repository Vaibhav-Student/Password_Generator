import { useEffect, useMemo, useRef, useState } from 'react';
import PasswordDisplay from './PasswordDisplay';
import GenerateButton from './GenerateButton';
import { copyText, generatePin } from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';

const PIN_OPTIONS = [
  { value: 4, label: '4-digit PIN', example: '8392' },
  { value: 6, label: '6-digit PIN', example: '294105' }
];

const PIN_USE_CASES = ['ATM PIN', 'App lock', 'Phone lock'];

function PinGeneratorCard() {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinLength, setPinLength] = useState(4);
  const [pulse, setPulse] = useState(false);
  const [toast, setToast] = useState('');

  const toastTimerRef = useRef(null);
  const pulseTimerRef = useRef(null);

  const selectedOption = useMemo(
    () => PIN_OPTIONS.find((item) => item.value === pinLength) || PIN_OPTIONS[0],
    [pinLength]
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

  const saveToHistory = (newPin) => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      let history = [];
      if (raw) history = JSON.parse(raw);
      if (!Array.isArray(history)) history = [];

      const historyItem = {
        id: `pin-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        password: newPin,
        createdAt: new Date().toISOString(),
        type: 'pin'
      };

      const updatedHistory = [historyItem, ...history].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save PIN history', error);
    }
  };

  const handleGenerate = (nextLength = pinLength) => {
    const value = generatePin({ length: nextLength });
    setPin(value);
    saveToHistory(value);
    setPulseEffect();
  };

  const handleCopyPin = async () => {
    const copied = await copyText(pin);
    showToast(copied ? 'PIN copied' : 'Copy failed');
  };

  useEffect(() => {
    handleGenerate(pinLength);
  }, [pinLength]);

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
      <section className="generator-card glass-panel pin-card">
        <div className="card-header">
          <h2>PIN Generator</h2>
          <span className="card-badge">Numeric Security</span>
        </div>

        <PasswordDisplay
          password={pin}
          visible={showPin}
          pulse={pulse}
          onToggleVisibility={() => setShowPin((prev) => !prev)}
          onCopy={handleCopyPin}
          onRegenerate={() => handleGenerate(pinLength)}
          label="Generated PIN"
          inputId="generated-pin"
          valueType="pin"
        />

        <section className="options-section mt-4">
          <h3>PIN Length</h3>
          <div className="radio-group">
            {PIN_OPTIONS.map((item) => (
              <label key={item.value} className={`radio-pill ${pinLength === item.value ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="pin-length"
                  value={item.value}
                  checked={pinLength === item.value}
                  onChange={() => setPinLength(item.value)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
          <p className="pin-note">Sample: {selectedOption.example}</p>
        </section>

        <section className="options-section mt-4">
          <h3>Use Cases</h3>
          <div className="pin-usecase-grid">
            {PIN_USE_CASES.map((item) => (
              <span key={item} className="pin-usecase-chip">{item}</span>
            ))}
          </div>
          <p className="pin-note">Tip: Avoid obvious PINs like 1234, 0000, or your birth year.</p>
        </section>

        <GenerateButton onClick={() => handleGenerate(pinLength)}>Generate Secure PIN</GenerateButton>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>
    </div>
  );
}

export default PinGeneratorCard;
