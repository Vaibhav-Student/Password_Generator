import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TOOL_INDEX = [
  { id: 'generator', label: 'Password Generator', description: 'Create strong passwords instantly.', route: '/generator' },
  { id: 'analyzer', label: 'Strength Analyzer', description: 'Inspect weak patterns and entropy.', route: '/analyzer' },
  { id: 'passphrase', label: 'Passphrase Builder', description: 'Build memorable long passphrases.', route: '/passphrase' },
  { id: 'smart', label: 'Smart Generator', description: 'Generate context-aware secure credentials.', route: '/smart-generator' },
  { id: 'qr-share', label: 'QR Share', description: 'Share credentials through encrypted QR.', route: '/qr-share' },
  { id: 'qr-scan', label: 'QR Scanner', description: 'Scan and decode QR credentials.', route: '/qr-extractor' },
  { id: 'history', label: 'Vault History', description: 'Review recent generated credentials.', route: '/history' },
  { id: 'crack-time', label: 'Crack Time Estimator', description: 'Estimate resistance against attacks.', route: '/crack-time' }
];

const QUICK_ACTIONS = [
  {
    id: 'generate-password',
    label: 'Generate Password',
    description: 'Launch advanced generator',
    route: '/generator',
    tone: 'primary',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" role="presentation">
        <path
          d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 7V7a3 3 0 0 1 6 0v2H9Z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    id: 'analyze-password',
    label: 'Analyze Password',
    description: 'Run live strength analysis',
    route: '/analyzer',
    tone: 'info',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'scan-qr',
    label: 'Scan QR',
    description: 'Extract credentials from QR',
    route: '/qr-extractor',
    tone: 'warning',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'open-vault',
    label: 'Open Vault',
    description: 'Review secure history records',
    route: '/history',
    tone: 'success',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3M3 5v3h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

const ACTIVITY_EVENTS = [
  { action: 'Generated password', detail: 'Smart Generator template used' },
  { action: 'Scanned QR', detail: 'Imported secure payload from QR Extractor' },
  { action: 'Updated vault', detail: 'Saved credential revision in history' },
  { action: 'Analyzed password', detail: 'Strength score verified in Analyzer' },
  { action: 'Created passphrase', detail: 'Generated memorable 5-word phrase' }
];

const CRACK_TIME_ROWS = [
  { id: 'weak', label: 'Weak', estimate: 'seconds to minutes', fill: 12, tone: 'weak' },
  { id: 'medium', label: 'Medium', estimate: 'hours to weeks', fill: 52, tone: 'medium' },
  { id: 'strong', label: 'Strong', estimate: 'years to centuries', fill: 92, tone: 'strong' }
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getSecurityStrength = (score) => {
  if (score < 55) {
    return { label: 'Weak', tone: 'weak' };
  }

  if (score < 80) {
    return { label: 'Medium', tone: 'medium' };
  }

  return { label: 'Strong', tone: 'strong' };
};

const formatTime = (value) =>
  value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboard, setDashboard] = useState(() => ({
    score: 78,
    totalPasswords: 124,
    weakPasswords: 7,
    reusedPasswords: 4,
    breachedPasswords: 1,
    refreshedAt: new Date(),
    activities: [
      { id: 1, action: 'Generated password', detail: 'Smart Generator template used', time: new Date(Date.now() - 5 * 60 * 1000) },
      { id: 2, action: 'Scanned QR', detail: 'Imported secure payload from QR Extractor', time: new Date(Date.now() - 15 * 60 * 1000) },
      { id: 3, action: 'Updated vault', detail: 'Saved credential revision in history', time: new Date(Date.now() - 27 * 60 * 1000) }
    ]
  }));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDashboard((prev) => {
        const scoreDelta = Math.floor(Math.random() * 7) - 2;
        const weakDelta = Math.random() > 0.62 ? -1 : Math.random() > 0.9 ? 1 : 0;
        const reusedDelta = Math.random() > 0.68 ? -1 : Math.random() > 0.94 ? 1 : 0;
        const breachDelta = Math.random() > 0.95 ? 1 : Math.random() < 0.24 ? -1 : 0;
        const totalDelta = Math.random() > 0.62 ? 1 : 0;

        const nextActivity = ACTIVITY_EVENTS[Math.floor(Math.random() * ACTIVITY_EVENTS.length)];
        const activities = [
          { id: Date.now(), action: nextActivity.action, detail: nextActivity.detail, time: new Date() },
          ...prev.activities
        ].slice(0, 6);

        return {
          ...prev,
          score: clamp(prev.score + scoreDelta, 48, 96),
          weakPasswords: clamp(prev.weakPasswords + weakDelta, 0, 18),
          reusedPasswords: clamp(prev.reusedPasswords + reusedDelta, 0, 15),
          breachedPasswords: clamp(prev.breachedPasswords + breachDelta, 0, 4),
          totalPasswords: clamp(prev.totalPasswords + totalDelta, 90, 360),
          activities,
          refreshedAt: new Date()
        };
      });
    }, 12000);

    return () => window.clearInterval(intervalId);
  }, []);

  const strengthMeta = useMemo(() => getSecurityStrength(dashboard.score), [dashboard.score]);

  const alerts = useMemo(() => {
    const nextAlerts = [];

    if (dashboard.weakPasswords > 0) {
      nextAlerts.push({
        id: 'weak',
        tone: 'danger',
        message: `${dashboard.weakPasswords} passwords need update`
      });
    }

    if (dashboard.breachedPasswords > 0) {
      nextAlerts.push({
        id: 'breach',
        tone: 'danger',
        message: `${dashboard.breachedPasswords} password${dashboard.breachedPasswords > 1 ? 's' : ''} found in data breach`
      });
    }

    if (dashboard.reusedPasswords > 0) {
      nextAlerts.push({
        id: 'reused',
        tone: 'warning',
        message: `${dashboard.reusedPasswords} passwords are reused across accounts`
      });
    }

    if (!nextAlerts.length) {
      nextAlerts.push({
        id: 'safe',
        tone: 'success',
        message: 'No critical warnings detected in your vault.'
      });
    }

    return nextAlerts;
  }, [dashboard.weakPasswords, dashboard.breachedPasswords, dashboard.reusedPasswords]);

  const aiSuggestions = useMemo(() => {
    const suggestions = [];

    if (dashboard.weakPasswords > 0) {
      suggestions.push('Replace weak entries with 16+ character generated passwords.');
    }

    if (dashboard.reusedPasswords > 0) {
      suggestions.push('Use unique credentials for every account to block chain compromise.');
    }

    if (dashboard.breachedPasswords > 0) {
      suggestions.push('Rotate breached credentials immediately and enable 2FA where possible.');
    }

    suggestions.push('Avoid using common patterns, names, or repeated number blocks.');
    suggestions.push('Add symbols and mixed casing to increase crack resistance.');

    return suggestions.slice(0, 4);
  }, [dashboard.weakPasswords, dashboard.reusedPasswords, dashboard.breachedPasswords]);

  const notificationCount = useMemo(() => {
    const alertsCount = alerts.filter((alert) => alert.tone !== 'success').length;
    return alertsCount + (dashboard.score < 70 ? 1 : 0);
  }, [alerts, dashboard.score]);

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return TOOL_INDEX.filter((tool) =>
      `${tool.label} ${tool.description}`.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [searchQuery]);

  const visibleQuickActions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return QUICK_ACTIONS;
    }

    return QUICK_ACTIONS.filter((action) =>
      `${action.label} ${action.description}`.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return;
    }

    const bestMatch =
      TOOL_INDEX.find((tool) => tool.label.toLowerCase().includes(query)) || filteredTools[0];

    if (bestMatch) {
      navigate(bestMatch.route);
      setSearchQuery('');
    }
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar glass-panel">
        <div className="dashboard-logo-group">
          <span className="dashboard-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <path
                d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 7V7a3 3 0 0 1 6 0v2H9Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="dashboard-logo-copy">
            <p className="dashboard-logo-title">SecurePass</p>
            <p className="dashboard-logo-subtitle">White Glow Edition</p>
          </div>
        </div>

        <form className={`dashboard-search ${searchQuery ? 'active' : ''}`} role="search" onSubmit={handleSearchSubmit}>
          <svg viewBox="0 0 24 24" fill="none" role="presentation">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search tools, generators, analyzers..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search security tools"
          />
          <span className="dashboard-search-hint">Enter</span>

          {searchQuery ? (
            <div className="dashboard-search-results">
              {filteredTools.length ? (
                filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    className="dashboard-search-result"
                    onClick={() => {
                      navigate(tool.route);
                      setSearchQuery('');
                    }}
                  >
                    <strong>{tool.label}</strong>
                    <small>{tool.description}</small>
                  </button>
                ))
              ) : (
                <p className="dashboard-search-empty">No matching tools found.</p>
              )}
            </div>
          ) : null}
        </form>

        <div className="dashboard-top-actions">
          <button
            type="button"
            className="top-icon-btn notification-btn"
            aria-label="Open alerts panel"
            onClick={() => {
              const alertsPanel = document.getElementById('alerts-card');
              alertsPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <path d="M15 17H9m9-1V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {notificationCount > 0 ? (
              <span className="notification-badge" aria-label={`${notificationCount} notifications`}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            ) : null}
          </button>

          <button type="button" className="top-avatar-btn" aria-label="Open profile">
            SP
          </button>

          <button
            type="button"
            className="top-icon-btn"
            aria-label="Open settings"
            onClick={() => navigate('/history')}
          >
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.7" />
              <path d="m19.4 15 .5 2.1-1.8 1-1.4-.8a7.8 7.8 0 0 1-1.8 1l-.4 1.6h-2l-.4-1.6a7.8 7.8 0 0 1-1.8-1l-1.4.8-1.8-1 .5-2.1a7.2 7.2 0 0 1 0-2l-.5-2.1 1.8-1 1.4.8c.5-.4 1.1-.7 1.8-1l.4-1.6h2l.4 1.6c.7.3 1.3.6 1.8 1l1.4-.8 1.8 1-.5 2.1c.1.7.1 1.3 0 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      <section className="dashboard-headline">
        <div>
          <p className="dashboard-eyebrow">Security Command Center</p>
          <h1>Password security in one premium overview.</h1>
          <p className="dashboard-subcopy">
            Auto-refresh is active every 12 seconds. Last update: {formatTime(dashboard.refreshedAt)}
          </p>
        </div>
        <Link className="dashboard-headline-link" to="/history">
          Open Vault Activity
        </Link>
      </section>

      <section className="dashboard-grid" aria-label="Dashboard overview cards">
        <article className={`dash-card security-score-card ${strengthMeta.tone}`}>
          <div className="dash-card-head">
            <h2>Security Score</h2>
            <span className="metric-tag has-tip" data-tip="Calculated from weak, reused, and breach indicators.">
              Live
            </span>
          </div>

          <div className="security-score-layout">
            <div
              className="score-ring"
              style={{ '--score': dashboard.score }}
              role="img"
              aria-label={`Security score ${dashboard.score} out of 100`}
            >
              <div className="score-ring-center">
                <strong>
                  {dashboard.score}
                  <span>/100</span>
                </strong>
                <small>{strengthMeta.label}</small>
              </div>
            </div>

            <div className="security-score-copy">
              <p className={`score-status ${strengthMeta.tone}`}>{strengthMeta.label} Security</p>
              <p>Overall Security Health</p>
              <small>Prioritize weak and reused passwords first.</small>
            </div>
          </div>
        </article>

        <article className="dash-card password-summary-card">
          <div className="dash-card-head">
            <h2>Password Summary</h2>
            <span className="metric-tag">Vault</span>
          </div>

          <div className="summary-grid">
            <div className="summary-item has-tip" data-tip="Total credentials monitored by SecurePass.">
              <span className="summary-icon">
                <svg viewBox="0 0 24 24" fill="none" role="presentation">
                  <path d="M4 7h16v12H4zM7 4h10v3H7z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <small>Total Passwords</small>
                <strong>{dashboard.totalPasswords}</strong>
              </div>
            </div>

            <div className="summary-item danger has-tip" data-tip="Weak passwords should be upgraded immediately.">
              <span className="summary-icon">
                <svg viewBox="0 0 24 24" fill="none" role="presentation">
                  <path d="M12 9v4m0 4h.01M4.9 19h14.2c1.6 0 2.6-1.7 1.8-3.1L13.8 4.6a2 2 0 0 0-3.6 0L3.1 15.9c-.8 1.4.2 3.1 1.8 3.1Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <small>Weak Passwords</small>
                <strong>{dashboard.weakPasswords}</strong>
              </div>
            </div>

            <div className="summary-item warning has-tip" data-tip="Reused passwords increase multi-account risk.">
              <span className="summary-icon">
                <svg viewBox="0 0 24 24" fill="none" role="presentation">
                  <path d="M4 7h16M7 4h10v3M4 11h16v9H4zM9 15h6M9 18h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <small>Reused Passwords</small>
                <strong>{dashboard.reusedPasswords}</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="dash-card alerts-card" id="alerts-card">
          <div className="dash-card-head">
            <h2>Alerts &amp; Warnings</h2>
            <span className="metric-tag danger">Priority</span>
          </div>

          <ul className="alert-list">
            {alerts.map((alert) => (
              <li key={alert.id} className={`alert-item ${alert.tone}`}>
                <span className="alert-icon" aria-hidden="true">
                  {alert.tone === 'success' ? (
                    <svg viewBox="0 0 24 24" fill="none" role="presentation">
                      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" role="presentation">
                      <path d="M12 9v4m0 4h.01M4.9 19h14.2c1.6 0 2.6-1.7 1.8-3.1L13.8 4.6a2 2 0 0 0-3.6 0L3.1 15.9c-.8 1.4.2 3.1 1.8 3.1Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span>{alert.message}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="dash-card quick-actions-card">
          <div className="dash-card-head">
            <h2>Quick Actions</h2>
            <span className="metric-tag">Tools</span>
          </div>

          <div className="quick-actions-grid">
            {visibleQuickActions.length ? (
              visibleQuickActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className={`quick-action-btn ${action.tone}`}
                  onClick={() => navigate(action.route)}
                  title={action.description}
                >
                  <span className="quick-action-icon" aria-hidden="true">
                    {action.icon}
                  </span>
                  <span className="quick-action-copy">
                    <strong>{action.label}</strong>
                    <small>{action.description}</small>
                  </span>
                </button>
              ))
            ) : (
              <p className="quick-actions-empty">
                No quick actions matched the current search query.
              </p>
            )}
          </div>
        </article>

        <article className="dash-card activity-card">
          <div className="dash-card-head">
            <h2>Activity Overview</h2>
            <span className="metric-tag">Recent</span>
          </div>

          <ul className="activity-list">
            {dashboard.activities.map((event) => (
              <li key={event.id}>
                <span className="activity-dot" aria-hidden="true" />
                <div className="activity-copy">
                  <strong>{event.action}</strong>
                  <p>{event.detail}</p>
                </div>
                <time dateTime={event.time.toISOString()}>{formatTime(event.time)}</time>
              </li>
            ))}
          </ul>
        </article>

        <article className="dash-card crack-insights-card">
          <div className="dash-card-head">
            <h2>Crack Time Insights</h2>
            <span className="metric-tag has-tip" data-tip="Estimated offline cracking resistance by strength tier.">
              Forecast
            </span>
          </div>

          <div className="crack-grid">
            {CRACK_TIME_ROWS.map((row) => (
              <div key={row.id} className="crack-row">
                <div className="crack-row-head">
                  <span>{row.label}</span>
                  <small>{row.estimate}</small>
                </div>
                <div className="crack-track" role="img" aria-label={`${row.label} crack estimate ${row.estimate}`}>
                  <span className={`crack-fill ${row.tone}`} style={{ width: `${row.fill}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="dash-card ai-suggestions-card">
          <div className="dash-card-head">
            <h2>AI Suggestions</h2>
            <span className="metric-tag info">Smart Tips</span>
          </div>

          <ul className="ai-suggestions-list">
            {aiSuggestions.map((tip, index) => (
              <li key={tip}>
                <span>{index + 1}</span>
                <p>{tip}</p>
              </li>
            ))}
          </ul>

          <Link className="ai-suggestions-link" to="/analyzer">
            Run Full Strength Analysis
          </Link>
        </article>
      </section>
    </div>
  );
}

export default HomePage;
