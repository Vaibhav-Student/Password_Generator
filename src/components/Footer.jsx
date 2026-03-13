const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="footer" id="footer">
      <span className="footer-divider" aria-hidden="true" />
      <p>SecurePass Generator</p>
      <p>Built with React &amp; JavaScript &mdash; Privacy-first and secure by design.</p>
      <p>&copy; {CURRENT_YEAR} SecurePass. All rights reserved.</p>
    </footer>
  );
}

export default Footer;