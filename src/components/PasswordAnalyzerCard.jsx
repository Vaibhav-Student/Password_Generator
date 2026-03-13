import { useState, useMemo } from 'react';
import { analyzePassword } from '../utils/passwordUtils';
import StrengthMeter from './StrengthMeter';

function PasswordAnalyzerCard() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);

  return (
    <div className="generator-stack">
      <section className="generator-card glass-panel">
        <div className="card-header">
          <h2>Strength Analyzer</h2>
          <span className="card-badge">Security Check</span>
        </div>

        <div className="analyzer-input-group mt-4">
          <label htmlFor="analyze-password" className="text-soft text-sm font-medium mb-2 block">
            Enter password to analyze
          </label>
          <div className="display-field focus-within">
            <input
              id="analyze-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste a password..."
              className="analyzer-input"
            />
            <button
              type="button"
              className="icon-btn tiny"
              onClick={() => setShowPassword(!showPassword)}
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
        </div>

        {password.length > 0 && (
          <div className="analyzer-results mt-5 fade-in">
            <div className="stats-grid">
              <div className="crack-time-card">
                <span className="crack-label text-soft">Estimated Crack Time</span>
                <h3 className={`crack-value text-${analysis.level}`}>{analysis.crackTime}</h3>
              </div>
              <div className="crack-time-card">
                <span className="crack-label text-soft">Entropy Strength</span>
                <h3 className={`crack-value text-${analysis.level}`}>{analysis.entropy} <span style={{fontSize: '0.6em', opacity: 0.7}}>bits</span></h3>
              </div>
            </div>

            <StrengthMeter strength={{ score: analysis.score, level: analysis.level, label: analysis.label }} />

            <div className="analyzer-metrics mt-5">
              <h4 className="text-sm font-medium mb-3">Password Requirements</h4>
              <ul className="metrics-list">
                <MetricItem label="12+ Characters" checked={analysis.metrics.length} />
                <MetricItem label="Uppercase Letter" checked={analysis.metrics.upper} />
                <MetricItem label="Lowercase Letter" checked={analysis.metrics.lower} />
                <MetricItem label="Number (0-9)" checked={analysis.metrics.number} />
                <MetricItem label="Symbol (!@#$)" checked={analysis.metrics.symbol} />
              </ul>
            </div>

            <div className={`analyzer-feedback mt-4 feedback-${analysis.level}`}>
              <span className="feedback-icon" aria-hidden="true">
                {analysis.level === 'strong' ? '✓' : '⚠'}
              </span>
              <ul className="feedback-list">
                {analysis.feedback.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricItem({ label, checked }) {
  return (
    <li className={`metric-item ${checked ? 'checked' : ''}`}>
      <span className="checkbox-icon">
        {checked ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span className="dot" />
        )}
      </span>
      {label}
    </li>
  );
}

export default PasswordAnalyzerCard;
