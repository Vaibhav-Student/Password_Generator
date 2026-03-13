function AboutPage() {
  return (
    <div className="page">
      <section className="content-card glass-panel">
        <h1>About SecurePass Generator</h1>
        <p className="lead-text">
          SecurePass Generator is a modern web application focused on helping people create and evaluate stronger passwords with a premium user experience.
        </p>
        <div className="about-grid">
          <article className="about-card">
            <h2>Purpose</h2>
            <p>
              This project helps users quickly generate secure passwords, verify password quality, and follow practical security best practices.
            </p>
          </article>
          <article className="about-card">
            <h2>Technology</h2>
            <p>
              Built with React and JavaScript using modular components, functional hooks, and responsive glassmorphism interface design.
            </p>
          </article>
          <article className="about-card">
            <h2>Privacy Focus</h2>
            <p>
              Password generation and analysis run on the client side to keep user data private and under local control.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;