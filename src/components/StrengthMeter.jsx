const SEGMENT_THRESHOLDS = {
  weak: 1,
  medium: 2,
  strong: 4
};

function getActiveSegments(strength) {
  if (strength.level === 'weak') return SEGMENT_THRESHOLDS.weak;
  if (strength.level === 'medium') return SEGMENT_THRESHOLDS.medium;
  return SEGMENT_THRESHOLDS.strong;
}

function StrengthMeter({ strength }) {
  const activeCount = getActiveSegments(strength);

  return (
    <section className="strength-section">
      <div className="section-head">
        <h3>Password Strength</h3>
        <span className={`strength-pill ${strength.level}`}>{strength.label}</span>
      </div>

      <div className="strength-segments" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={activeCount} aria-label={`Password strength: ${strength.label}`}>
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={`strength-seg ${i < activeCount ? `active ${strength.level}` : ''}`}
          />
        ))}
      </div>
    </section>
  );
}

export default StrengthMeter;