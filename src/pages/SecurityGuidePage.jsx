function SecurityGuidePage() {
  return (
    <div className="page">
      <section className="content-card glass-panel">
        <h1>Security Guide</h1>
        <div className="guide-grid">
          <article className="guide-card">
            <h2>What Makes a Strong Password</h2>
            <p>
              Strong passwords combine length, complexity, and uniqueness. Aim for at least 12 characters with a mix of uppercase,
              lowercase, numbers, and symbols.
            </p>
          </article>

          <article className="guide-card">
            <h2>Common Password Mistakes</h2>
            <p>
              Avoid reused passwords, predictable patterns, names, birthdays, and common substitutions like replacing "a" with "@" in short words.
            </p>
          </article>

          <article className="guide-card">
            <h2>Password Safety Tips</h2>
            <p>
              Use a unique password for every account, enable multi-factor authentication, and consider a trusted password manager for storage.
            </p>
          </article>

          <article className="guide-card">
            <h2>Weak vs Strong Examples</h2>
            <p>
              Weak: <code>password123</code> or <code>john1998</code>. Strong: <code>R7!vQ2#xL9@pT1</code> with mixed character types and no personal clues.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default SecurityGuidePage;