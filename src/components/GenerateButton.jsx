function GenerateButton({ onClick, disabled, children = 'Generate Password' }) {
  return (
    <button type="button" className="generate-btn" onClick={onClick} disabled={disabled}>
      <span className="btn-spark" aria-hidden="true">✦</span>
      {children}
    </button>
  );
}

export default GenerateButton;