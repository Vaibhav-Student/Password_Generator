function LengthSlider({ value, onChange, min = 6, max = 32 }) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <section className="length-section">
      <div className="section-head">
        <h3>Password Length</h3>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ '--track-fill': `${progress}%` }}
        aria-label="Password length"
      />
    </section>
  );
}

export default LengthSlider;