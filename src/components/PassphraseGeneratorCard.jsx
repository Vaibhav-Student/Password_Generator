import { useEffect, useRef, useState } from 'react';
import PasswordDisplay from './PasswordDisplay';
import LengthSlider from './LengthSlider';
import GenerateButton from './GenerateButton';
import { copyText, generatePassphrase } from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';

function PassphraseGeneratorCard() {
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [wordCount, setWordCount] = useState(4);
  const [toast, setToast] = useState('');
  const [pulse, setPulse] = useState(false);
  
  const [capitalize, setCapitalize] = useState(false);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [separator, setSeparator] = useState('-');

  const toastTimerRef = useRef(null);
  const pulseTimerRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1700);
  };

  const setPulseEffect = () => {
    setPulse(true);
    if (pulseTimerRef.current) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => setPulse(false), 280);
  };

  const saveToHistory = (newPhrase) => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      let history = [];
      if (raw) history = JSON.parse(raw);
      if (!Array.isArray(history)) history = [];

      const historyItem = {
        id: `phrase-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        password: newPhrase,
        createdAt: new Date().toISOString()
      };

      const updatedHistory = [historyItem, ...history].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save to history', e);
    }
  };

  const handleGenerate = () => {
    const value = generatePassphrase({ 
      wordCount, 
      separator, 
      capitalize, 
      includeNumber 
    });

    setPassphrase(value);
    saveToHistory(value);
    setPulseEffect();
  };

  const handleCopyPassphrase = async () => {
    const copied = await copyText(passphrase);
    showToast(copied ? 'Passphrase Copied' : 'Copy failed');
  };

  useEffect(() => {
    handleGenerate();

    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    };
  }, []);

  return (
    <div className="generator-stack">
      <section className="generator-card glass-panel">
        <div className="card-header">
          <h2>Passphrase Generator</h2>
          <span className="card-badge">Memorable Core</span>
        </div>

        <PasswordDisplay
          password={passphrase}
          visible={showPassphrase}
          pulse={pulse}
          onToggleVisibility={() => setShowPassphrase((prev) => !prev)}
          onCopy={handleCopyPassphrase}
          onRegenerate={handleGenerate}
        />

        <div className="mt-4">
          <div className="section-head mb-2">
            <h3>Word Count</h3>
            <span>{wordCount} words</span>
          </div>
          <LengthSlider value={wordCount} min={3} max={8} onChange={setWordCount} />
        </div>

        <section className="options-section mt-5">
          <h3>Passphrase Formatting</h3>
          <div className="option-grid">
            <label className="option-item">
              <div className="option-copy">
                <span>Capitalize Words</span>
                <small>e.g. Tiger-Moon</small>
              </div>
              <input
                type="checkbox"
                checked={capitalize}
                onChange={() => setCapitalize(!capitalize)}
                aria-label="Capitalize Words"
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
            </label>

            <label className="option-item">
              <div className="option-copy">
                <span>Add Number</span>
                <small>e.g. tiger-moon-92</small>
              </div>
              <input
                type="checkbox"
                checked={includeNumber}
                onChange={() => setIncludeNumber(!includeNumber)}
                aria-label="Add Number at end"
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
            </label>
          </div>

          <div className="separator-select mt-4">
            <label className="text-sm font-medium text-soft block mb-2">Separator Style</label>
            <div className="radio-group">
              {['-', '_', ' ', ''].map((sep) => (
                <label key={sep} className={`radio-pill ${separator === sep ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="separator"
                    value={sep}
                    checked={separator === sep}
                    onChange={() => setSeparator(sep)}
                    className="sr-only"
                  />
                  {sep === '-' ? 'Hyphen (-)' : sep === '_' ? 'Underscore (_)' : sep === ' ' ? 'Space' : 'None'}
                </label>
              ))}
            </div>
          </div>
        </section>

        <GenerateButton onClick={handleGenerate}>Generate Passphrase</GenerateButton>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>
    </div>
  );
}

export default PassphraseGeneratorCard;
