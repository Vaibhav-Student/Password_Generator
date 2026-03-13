import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero glass-panel">
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        Secure &bull; Private &bull; Instant
      </div>
      <p className="hero-kicker">Futuristic Password Security</p>
      <h1>Generate Strong and Secure Passwords Instantly</h1>
      <p>
        Create powerful passwords with customizable security options, instant copy actions,
        and modern privacy-first controls.
      </p>
      <div className="hero-divider" />
      <button type="button" className="hero-cta" onClick={() => navigate('/generator')}>
        Open Password Generator
      </button>
    </section>
  );
}

export default HeroSection;