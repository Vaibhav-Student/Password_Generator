import { useMemo, useState } from 'react';
import { analyzeMemorability, analyzePassword } from '../utils/passwordUtils';

function PasswordMemoryScoreCard() {
  const [password, setPassword] = useState('CoffeeTigerMoon92');
  const [showPassword, setShowPassword] = useState(false);

  const security = useMemo(() => analyzePassword(password), [password]);
  const memory = useMemo(() => analyzeMemorability(password), [password]);

  const securityProgress = password ? Math.max(6, security.score) : 0;
  const memoryProgress = password ? Math.max(6, memory.score) : 0;

  const tips = useMemo(() => {
    if (!password) return [];

    const items = [];

    if (security.score < 60) {
      items.push('Security is low. Increase length to at least 12 characters.');
    }
    if (!security.metrics.number) {
      items.push('Add 1-2 digits at the end (example: 92).');
    }
    if (!security.metrics.symbol) {
      items.push('Add one ending symbol, such as ! or @.');
    }
    if (memory.levelKey === 'very-hard' || memory.levelKey === 'hard') {
      items.push('Use 2-3 simple words to make it easier to remember.');
    }

    items.push(...memory.feedback);

    return Array.from(new Set(items)).slice(0, 5);
  }, [password, security, memory]);

  return (
    <div className="generator-stack">
      <section className="generator-card glass-panel memory-score-card">
        <div className="card-header">
          <h2>Password Memory Score</h2>
          <span className="card-badge">Brain + Security</span>
        </div>

        <div className="analyzer-input-group mt-4">
          <label htmlFor="memory-password" className="text-soft text-sm font-medium mb-2 block">
            Enter password
          </label>
          <div className="display-field focus-within">
            <input
              id="memory-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="CoffeeTigerMoon92"
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
          <section className="memory-results mt-5 fade-in">
            <div className="memory-summary-grid">
              <article className="memory-summary-card-item">
                <span className="memory-summary-label">Security Strength</span>
                <h3 className={`memory-summary-value text-${security.level}`}>{security.label}</h3>
                <p className="memory-summary-sub text-soft">Estimated crack time: {security.crackTime}</p>
              </article>

              <article className="memory-summary-card-item">
                <span className="memory-summary-label">Memorability</span>
                <h3 className={`memory-summary-value memory-${memory.levelKey}`}>{memory.level}</h3>
                <p className="memory-summary-sub text-soft">Score: {memory.score}/100</p>
              </article>
            </div>

            <div className="memory-meter-block mt-4">
              <div className="memory-meter-head">
                <h4>Security Meter</h4>
                <span>{security.score}/100</span>
              </div>
              <div className="memory-meter-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={security.score} aria-label="Security score">
                <div className={`memory-meter-fill security ${security.level}`} style={{ width: `${securityProgress}%` }} />
              </div>
            </div>

            <div className="memory-meter-block mt-4">
              <div className="memory-meter-head">
                <h4>Memorability Meter</h4>
                <span>{memory.score}/100</span>
              </div>
              <div className="memory-meter-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={memory.score} aria-label="Memorability score">
                <div className={`memory-meter-fill memorability ${memory.levelKey}`} style={{ width: `${memoryProgress}%` }} />
              </div>
              <p className="memory-coverage text-soft">Dictionary coverage: {memory.coverage}%</p>
            </div>

            {memory.words.length > 0 ? (
              <div className="memory-word-chip-row mt-4">
                {memory.words.map((word) => (
                  <span key={word} className="memory-word-chip">{word}</span>
                ))}
              </div>
            ) : null}

            <div className="memory-tips-card mt-4">
              <h4>Smart Suggestions</h4>
              <ul className="memory-tips-list">
                {tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </section>
        ) : (
          <p className="memory-empty text-soft mt-5">Enter a password to see both security and memorability scores.</p>
        )}
      </section>
    </div>
  );
}

export default PasswordMemoryScoreCard;
