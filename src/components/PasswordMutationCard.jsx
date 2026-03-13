import { useEffect, useMemo, useRef, useState } from 'react';
import PasswordDisplay from './PasswordDisplay';
import GenerateButton from './GenerateButton';
import StrengthMeter from './StrengthMeter';
import { analyzePassword, copyText, mutateWeakPassword, scorePassword } from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';

function PasswordMutationCard() {
  const [weakPassword, setWeakPassword] = useState('mypassword');
  const [mutatedPassword, setMutatedPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [toast, setToast] = useState('');

  const toastTimerRef = useRef(null);
  const pulseTimerRef = useRef(null);

  const before = useMemo(() => analyzePassword(weakPassword), [weakPassword]);
  const after = useMemo(() => analyzePassword(mutatedPassword), [mutatedPassword]);
  const mutatedStrength = useMemo(() => scorePassword(mutatedPassword), [mutatedPassword]);
  const improvement = Math.max(0, after.score - before.score);

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
        id: `mutation-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        password: value,
        createdAt: new Date().toISOString(),
        type: 'mutation'
      };

      const updatedHistory = [historyItem, ...history].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save mutation password history', error);
    }
  };

  const handleMutate = () => {
    if (!weakPassword.trim()) {
      showToast('Enter a weak password first');
      return;
    }

    const value = mutateWeakPassword(weakPassword);
    setMutatedPassword(value);
    triggerPulse();
    saveToHistory(value);
    showToast('Password upgraded');
  };

  const handleCopy = async () => {
    const copied = await copyText(mutatedPassword);
    showToast(copied ? 'Mutated password copied' : 'Copy failed');
  };

  useEffect(() => {
    handleMutate();

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
      <section className="generator-card glass-panel mutation-card">
        <div className="card-header">
          <h2>Password Mutation Tool</h2>
          <span className="card-badge">Weak to Strong</span>
        </div>

        <section className="options-section mt-4">
          <h3>Weak Password Input</h3>
          <div className="display-field mutation-input-field">
            <input
              type="text"
              value={weakPassword}
              onChange={(event) => setWeakPassword(event.target.value)}
              placeholder="mypassword"
              className="analyzer-input mutation-input"
              aria-label="Weak password input"
            />
          </div>
          <p className="mutation-note">Example: mypassword to MyP@55W0rd!</p>
        </section>

        <section className="mutation-compare-grid mt-4">
          <article className="mutation-score-card">
            <span className="mutation-score-label">Before</span>
            <p className={`mutation-score-value text-${before.level}`}>{before.label}</p>
            <p className="mutation-score-time text-soft">{before.crackTime}</p>
            <div className="mutation-score-track" aria-hidden="true">
              <div className={`mutation-score-fill ${before.level}`} style={{ width: `${Math.max(6, before.score)}%` }} />
            </div>
          </article>

          <article className="mutation-score-card">
            <span className="mutation-score-label">After</span>
            <p className={`mutation-score-value text-${after.level}`}>{after.label}</p>
            <p className="mutation-score-time text-soft">{after.crackTime}</p>
            <div className="mutation-score-track" aria-hidden="true">
              <div className={`mutation-score-fill ${after.level}`} style={{ width: `${Math.max(6, after.score)}%` }} />
            </div>
          </article>
        </section>

        <p className="mutation-improvement text-soft">Strength gain: +{improvement} points</p>

        <PasswordDisplay
          password={mutatedPassword}
          visible={visible}
          pulse={pulse}
          onToggleVisibility={() => setVisible((prev) => !prev)}
          onCopy={handleCopy}
          onRegenerate={handleMutate}
          label="Mutated Password"
          inputId="generated-mutated-password"
          valueType="password"
        />

        <StrengthMeter strength={mutatedStrength} />

        <GenerateButton onClick={handleMutate}>Mutate Password</GenerateButton>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>
    </div>
  );
}

export default PasswordMutationCard;
