import { useEffect, useMemo, useRef, useState } from 'react';
import GenerateButton from './GenerateButton';
import {
  assessRotationPredictability,
  buildRotationSchedule,
  copyText,
  generatePasswordRotations
} from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';

const ROTATION_METHODS = [
  {
    id: 'mixed',
    label: 'Mixed Rotation',
    description: 'Rotate year and symbol together for policy-friendly variation.'
  },
  {
    id: 'year',
    label: 'Year Based',
    description: 'Only the year changes in each future password.'
  },
  {
    id: 'number',
    label: 'Number Increment',
    description: 'Increase trailing number versions (01, 02, 03...).'
  },
  {
    id: 'symbol',
    label: 'Symbol Change',
    description: 'Rotate symbols while keeping your core password pattern.'
  }
];

const ROTATION_INTERVALS = [30, 60, 90];

function PasswordRotationGeneratorCard() {
  const [currentPassword, setCurrentPassword] = useState('Tiger$2024');
  const [showPassword, setShowPassword] = useState(false);
  const [rotationMethod, setRotationMethod] = useState('mixed');
  const [intervalDays, setIntervalDays] = useState(90);
  const [rotationCount, setRotationCount] = useState(4);
  const [startStep, setStartStep] = useState(1);
  const [toast, setToast] = useState('');

  const toastTimerRef = useRef(null);

  const activeMethod = useMemo(
    () => ROTATION_METHODS.find((item) => item.id === rotationMethod) || ROTATION_METHODS[0],
    [rotationMethod]
  );

  const rotations = useMemo(
    () => generatePasswordRotations({
      currentPassword,
      method: rotationMethod,
      count: rotationCount,
      startAt: startStep
    }),
    [currentPassword, rotationMethod, rotationCount, startStep]
  );

  const schedule = useMemo(
    () => buildRotationSchedule(rotations, { intervalDays }),
    [rotations, intervalDays]
  );

  const predictability = useMemo(
    () => assessRotationPredictability(currentPassword, rotations),
    [currentPassword, rotations]
  );

  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1800);
  };

  const handleCopyAll = async () => {
    if (!rotations.length) {
      showToast('No passwords to copy yet');
      return;
    }

    const copied = await copyText(rotations.join('\n'));
    showToast(copied ? 'Rotation list copied' : 'Copy failed');
  };

  const handleCopyItem = async (value) => {
    const copied = await copyText(value);
    showToast(copied ? 'Password copied' : 'Copy failed');
  };

  const handleGenerateMore = () => {
    setRotationCount((prev) => Math.min(24, prev + 4));
    showToast('Added more future versions');
  };

  const handleRefreshPlan = () => {
    setStartStep((prev) => prev + 1);
    showToast('Rotation plan refreshed');
  };

  const handleSaveList = () => {
    if (!rotations.length) {
      showToast('Generate passwords first');
      return;
    }

    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      let history = [];
      if (raw) history = JSON.parse(raw);
      if (!Array.isArray(history)) history = [];

      const createdAt = new Date().toISOString();
      const items = rotations.map((password, index) => ({
        id: `rotation-${Date.now()}-${index}-${Math.random().toString(16).slice(2, 7)}`,
        password,
        createdAt,
        type: 'rotation',
        meta: {
          method: rotationMethod,
          source: currentPassword
        }
      }));

      const updatedHistory = [...items, ...history].slice(0, 80);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      showToast('Rotation list saved');
    } catch (error) {
      console.error('Failed to save rotation history', error);
      showToast('Save failed');
    }
  };

  useEffect(() => {
    setRotationCount(4);
    setStartStep(1);
  }, [currentPassword, rotationMethod]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="generator-stack">
      <section className="generator-card glass-panel rotation-card">
        <div className="card-header">
          <h2>Password Rotation Generator</h2>
          <span className="card-badge">Policy Ready</span>
        </div>

        <section className="options-section mt-4">
          <h3>Current Password</h3>
          <div className="display-field focus-within rotation-input-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Tiger$2024"
              className="analyzer-input"
              aria-label="Current password"
            />
            <button
              type="button"
              className="icon-btn tiny"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
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
          </div>
          <p className="rotation-note">Future versions are generated locally in your browser.</p>
        </section>

        <section className="options-section mt-4">
          <h3>Rotation Type</h3>
          <div className="radio-group">
            {ROTATION_METHODS.map((item) => (
              <label key={item.id} className={`radio-pill ${rotationMethod === item.id ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="rotation-method"
                  value={item.id}
                  checked={rotationMethod === item.id}
                  onChange={() => setRotationMethod(item.id)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
          <p className="rotation-method-note">{activeMethod.description}</p>
        </section>

        <section className="options-section mt-4">
          <h3>Rotation Interval</h3>
          <div className="radio-group">
            {ROTATION_INTERVALS.map((days) => (
              <label key={days} className={`radio-pill ${intervalDays === days ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="rotation-interval"
                  value={days}
                  checked={intervalDays === days}
                  onChange={() => setIntervalDays(days)}
                  className="sr-only"
                />
                {days} Days
              </label>
            ))}
          </div>
        </section>

        <GenerateButton onClick={handleRefreshPlan}>Generate Rotation Plan</GenerateButton>

        {predictability.predictable ? (
          <p className="rotation-warning mt-4">{predictability.message}</p>
        ) : null}

        <section className="rotation-list-shell mt-4">
          <div className="rotation-list-head">
            <h3>Future Passwords</h3>
            <span>{rotations.length} versions</span>
          </div>

          {rotations.length ? (
            <ul className="rotation-list">
              {rotations.map((value, index) => (
                <li key={`${value}-${index}`}>
                  <code>{value}</code>
                  <button
                    type="button"
                    className="text-btn rotation-inline-copy"
                    onClick={() => handleCopyItem(value)}
                  >
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rotation-empty">Enter a current password to create future versions.</p>
          )}

          <div className="rotation-action-row">
            <button type="button" className="icon-btn rotation-action-btn" onClick={handleCopyAll}>Copy</button>
            <button type="button" className="icon-btn rotation-action-btn" onClick={handleGenerateMore}>Generate More</button>
            <button type="button" className="icon-btn rotation-action-btn" onClick={handleSaveList}>Save List</button>
          </div>
        </section>

        <section className="rotation-schedule-shell mt-4">
          <div className="rotation-list-head">
            <h3>Rotation Timeline</h3>
            <span>{intervalDays}-day cycle</span>
          </div>
          <div className="rotation-table-wrap">
            <table className="rotation-schedule-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item) => (
                  <tr key={`${item.dateLabel}-${item.password}`}>
                    <td>{item.dateLabel}</td>
                    <td><code>{item.password}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rotation-security-note mt-4">
          <h4>Security Tips</h4>
          <ul>
            <li>Do not store passwords on servers unless encrypted and required.</li>
            <li>Generate and rotate locally in the browser when possible.</li>
            <li>Avoid reusing the same base across unrelated accounts.</li>
          </ul>
        </section>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>
    </div>
  );
}

export default PasswordRotationGeneratorCard;
