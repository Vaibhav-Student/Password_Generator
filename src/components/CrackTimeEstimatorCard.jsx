import { useMemo, useState } from 'react';
import { analyzePassword } from '../utils/passwordUtils';

function CrackTimeEstimatorCard() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);
  const progressValue = password ? Math.max(6, analysis.score) : 0;

  return (
    <div className="generator-stack">
      <section className="generator-card glass-panel crack-estimator-card">
        <div className="card-header">
          <h2>Password Crack Time Estimator</h2>
          <span className="card-badge">Risk Preview</span>
        </div>

        <div className="analyzer-input-group mt-4">
          <label htmlFor="estimate-password" className="text-soft text-sm font-medium mb-2 block">
            Enter password
          </label>
          <div className="display-field focus-within">
            <input
              id="estimate-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Type a password to estimate crack time..."
              className="analyzer-input"
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
        </div>

        {password.length > 0 ? (
          <section className="crack-estimate-results mt-5">
            <div className="crack-estimate-main">
              <span className="crack-label text-soft">Estimated Crack Time</span>
              <h3 className={`crack-estimate-value text-${analysis.level}`}>{analysis.crackTime}</h3>
            </div>

            <div className="crack-progress-shell mt-4">
              <div className="crack-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={analysis.score} aria-label={`Password strength score ${analysis.score}`}>
                <div
                  className={`crack-progress-fill ${analysis.level}`}
                  style={{ width: `${progressValue}%` }}
                />
              </div>

              <div className="crack-progress-labels">
                <span>Weak</span>
                <span>Strong</span>
              </div>

              <p className="crack-estimate-meta text-soft">
                {analysis.label} · {analysis.entropy} bits entropy
              </p>
            </div>
          </section>
        ) : (
          <p className="crack-empty text-soft mt-5">Enter a password to see estimated crack time.</p>
        )}
      </section>
    </div>
  );
}

export default CrackTimeEstimatorCard;
