import { Link, useNavigate } from 'react-router-dom';

const featureLinks = [
  {
    title: 'Password Generator',
    description: 'Create complex passwords with customizable character rules and instant copy.',
    to: '/generator'
  },
  {
    title: 'Passphrase Builder',
    description: 'Generate memorable multi-word passphrases with stronger entropy.',
    to: '/passphrase'
  },
  {
    title: 'Strength Analyzer',
    description: 'Check quality and identify weak patterns before using a password.',
    to: '/analyzer'
  },
  {
    title: 'Smart Generator',
    description: 'Produce context-aware credentials based on your preferred style.',
    to: '/smart-generator'
  },
  {
    title: 'Rotation Planner',
    description: 'Prepare safe password rotation schedules for repeated account updates.',
    to: '/rotation-generator'
  },
  {
    title: 'History & Utilities',
    description: 'Review generated passwords and access helper tools from one place.',
    to: '/history'
  }
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-shell">
      <section className="home-hero glass-panel">
        <div className="home-hero-copy">
          <p className="home-eyebrow">SecurePass Security Platform</p>
          <h1>Professional password tools for daily security workflows.</h1>
          <p className="home-lead">
            Generate, test, and manage strong credentials with a clean experience built for
            speed, privacy, and reliability.
          </p>
          <div className="home-hero-actions">
            <button
              type="button"
              className="home-btn home-btn-primary"
              onClick={() => navigate('/generator')}
            >
              Start With Generator
            </button>
            <button
              type="button"
              className="home-btn home-btn-secondary"
              onClick={() => navigate('/analyzer')}
            >
              Analyze Password Strength
            </button>
          </div>
        </div>

        <aside className="home-trust-panel" aria-label="Why choose SecurePass">
          <h2>Why SecurePass</h2>
          <ul className="home-trust-list">
            <li>Focused, task-based tools for modern account security.</li>
            <li>Fast generation and review flows designed for daily use.</li>
            <li>Consistent interface across generator, analyzer, and utility pages.</li>
            <li>Built for practical password hygiene and safer credential decisions.</li>
          </ul>
        </aside>
      </section>

      <section className="home-stats" aria-label="Platform highlights">
        <article className="home-stat glass-panel">
          <span className="home-stat-value">15+</span>
          <span className="home-stat-label">Security tools available</span>
        </article>
        <article className="home-stat glass-panel">
          <span className="home-stat-value">Privacy-first</span>
          <span className="home-stat-label">Designed around safe password handling</span>
        </article>
        <article className="home-stat glass-panel">
          <span className="home-stat-value">Fast setup</span>
          <span className="home-stat-label">Start generating secure passwords in seconds</span>
        </article>
      </section>

      <section className="home-tools glass-panel">
        <div className="home-section-head">
          <h2>Explore Core Tools</h2>
          <Link className="home-inline-link" to="/generator">
            Open Main Generator
          </Link>
        </div>
        <div className="home-tool-grid">
          {featureLinks.map((feature) => (
            <Link key={feature.to} className="home-tool-card" to={feature.to}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
