import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { copyText, generatePassword } from '../utils/passwordUtils';

function escapeWifiText(value) {
  return value.replace(/([\\;,:\"])/g, '\\$1');
}

function QRCodeShareCard() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('password');
  const [ssid, setSsid] = useState('');
  const [wifiType, setWifiType] = useState('WPA');
  const [expirySeconds, setExpirySeconds] = useState(60);
  const [clearAfterCopy, setClearAfterCopy] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [toast, setToast] = useState('');

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const isWifiMode = mode === 'wifi';

  const payloadNote = useMemo(() => {
    if (!isWifiMode) {
      return 'Payload format: plain text password';
    }

    if (!ssid.trim()) {
      return 'Payload format: WIFI:T:WPA;S:<network>;P:<password>;;';
    }

    const safeType = wifiType === 'nopass' ? 'nopass' : wifiType;
    return `Payload format: WIFI:T:${safeType};S:${ssid.trim()};P:${safeType === 'nopass' ? '' : '********'};;`;
  }, [isWifiMode, ssid, wifiType]);

  const showToast = (message) => {
    setToast(message);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setToast(''), 1800);
  };

  const clearQr = () => {
    setQrDataUrl('');
    setCountdown(0);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const clearAll = (showMessage = true) => {
    setPassword('');
    setSsid('');
    clearQr();
    if (showMessage) {
      showToast('Cleared');
    }
  };

  const handleGenerate = async (forcedPassword) => {
    const currentPassword = typeof forcedPassword === 'string' ? forcedPassword : password;

    if (!isWifiMode && !currentPassword) {
      showToast('Enter a password first');
      return;
    }

    if (isWifiMode && wifiType !== 'nopass' && !currentPassword) {
      showToast('Enter WiFi password');
      return;
    }

    if (isWifiMode && !ssid.trim()) {
      showToast('Enter WiFi name (SSID)');
      return;
    }

    const payload = !isWifiMode
      ? currentPassword
      : `WIFI:T:${wifiType === 'nopass' ? 'nopass' : wifiType};S:${escapeWifiText(ssid.trim())};P:${wifiType === 'nopass' ? '' : escapeWifiText(currentPassword)};;`;

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#9ed9ff',
          light: '#00000000'
        }
      });

      setQrDataUrl(dataUrl);
      setCountdown(expirySeconds);
      showToast('QR generated locally');
    } catch (error) {
      console.error('Failed to create QR', error);
      showToast('Failed to generate QR');
    }
  };

  const handleCopyPassword = async () => {
    if (!password && !(isWifiMode && wifiType === 'nopass')) {
      showToast('Nothing to copy');
      return;
    }

    const copied = await copyText(password);
    if (!copied) {
      showToast('Copy failed');
      return;
    }

    if (clearAfterCopy) {
      showToast('Password copied and cleared');
      window.setTimeout(() => {
        clearAll(false);
      }, 250);
      return;
    }

    showToast('Password copied');
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;

    const anchor = document.createElement('a');
    anchor.href = qrDataUrl;
    anchor.download = isWifiMode ? 'wifi-password-qr.png' : 'password-qr.png';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleGenerateNew = async () => {
    const next = generatePassword({
      length: 16,
      options: {
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
      }
    });

    setPassword(next);
    await handleGenerate(next);
  };

  useEffect(() => {
    if (!qrDataUrl) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setQrDataUrl('');
          showToast('QR expired and cleared');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [qrDataUrl]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="qr-share-layout">
      <section className="generator-card glass-panel qr-share-card">
        <div className="card-header">
          <h2>QR Code Password Share</h2>
          <span className="card-badge">Local Only</span>
        </div>

        <div className="options-section mt-4">
          <h3>Share Mode</h3>
          <div className="radio-group">
            <label className={`radio-pill ${mode === 'password' ? 'active' : ''}`}>
              <input
                type="radio"
                name="qr-mode"
                checked={mode === 'password'}
                onChange={() => setMode('password')}
                className="sr-only"
              />
              Password QR
            </label>
            <label className={`radio-pill ${mode === 'wifi' ? 'active' : ''}`}>
              <input
                type="radio"
                name="qr-mode"
                checked={mode === 'wifi'}
                onChange={() => setMode('wifi')}
                className="sr-only"
              />
              WiFi QR
            </label>
          </div>
        </div>

        {isWifiMode ? (
          <div className="options-section mt-4">
            <h3>WiFi Details</h3>
            <div className="qr-input-grid">
              <label className="qr-field">
                <span>Network Name (SSID)</span>
                <input
                  type="text"
                  value={ssid}
                  onChange={(event) => setSsid(event.target.value)}
                  placeholder="MyHomeWiFi"
                  className="qr-text-input"
                />
              </label>

              <div>
                <span className="qr-field-label">Security Type</span>
                <div className="radio-group qr-compact-group">
                  {['WPA', 'WEP', 'nopass'].map((type) => (
                    <label key={type} className={`radio-pill ${wifiType === type ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="wifi-security"
                        checked={wifiType === type}
                        onChange={() => setWifiType(type)}
                        className="sr-only"
                      />
                      {type === 'nopass' ? 'Open' : type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <section className="password-display mt-4">
          <label htmlFor="share-password">Password</label>
          <div className="display-field qr-input-field">
            <input
              id="share-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="MySecurePass@123"
              className="qr-password-input"
              aria-label="Password to encode in QR"
            />

            <div className="display-actions">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" role="presentation">
                    <path d="M3 3 21 21M10.58 10.58A2 2 0 1 0 13.42 13.42M9.88 5.09A9.77 9.77 0 0 1 12 4c5 0 9 4 10 8a11.77 11.77 0 0 1-4.41 5.94M6.61 6.61A11.85 11.85 0 0 0 2 12c1 4 5 8 10 8a9.77 9.77 0 0 0 2.91-.44" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" role="presentation">
                    <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                )}
              </button>

              <button type="button" className="icon-btn" onClick={() => clearAll()} aria-label="Clear password and QR">
                <svg viewBox="0 0 24 24" fill="none" role="presentation">
                  <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m-8 0v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <section className="options-section mt-4">
          <h3>Expiration</h3>
          <div className="radio-group qr-compact-group">
            {[30, 60].map((seconds) => (
              <label key={seconds} className={`radio-pill ${expirySeconds === seconds ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="expiry"
                  checked={expirySeconds === seconds}
                  onChange={() => setExpirySeconds(seconds)}
                  className="sr-only"
                />
                {seconds} sec
              </label>
            ))}
          </div>
        </section>

        <section className="options-section mt-4">
          <h3>Security Option</h3>
          <label className="option-item qr-single-option">
            <div className="option-copy">
              <span>Clear after copy</span>
              <small>Removes password + QR from screen after copying</small>
            </div>
            <input
              type="checkbox"
              checked={clearAfterCopy}
              onChange={() => setClearAfterCopy((prev) => !prev)}
              aria-label="Clear password and QR after copy"
            />
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
          </label>
        </section>

        <button type="button" className="generate-btn qr-generate-btn" onClick={() => handleGenerate()}>
          <span className="btn-spark" aria-hidden="true">QR</span>
          Generate QR Code
        </button>

        <div className="qr-action-row">
          <button type="button" className="icon-btn" onClick={handleCopyPassword} aria-label="Copy password">
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Copy Password
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={handleDownloadQr}
            disabled={!qrDataUrl}
            aria-label="Download QR code image"
          >
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download QR
          </button>

          <button type="button" className="icon-btn" onClick={handleGenerateNew} aria-label="Generate new password">
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Generate New
          </button>
        </div>

        <section className="qr-preview-shell" aria-live="polite">
          {qrDataUrl ? (
            <>
              <img src={qrDataUrl} alt="Generated QR code" className="qr-image" />
              <p className="qr-expiry-text">Expires in {countdown}s</p>
            </>
          ) : (
            <p className="qr-placeholder-text">Generate a QR code to preview it here.</p>
          )}
        </section>

        <p className="qr-payload-note text-soft">{payloadNote}</p>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>

      <section className="history-card glass-panel qr-tips-card">
        <div className="section-head">
          <h3>Security Tips</h3>
          <span>Important</span>
        </div>

        <ul className="qr-tips-list">
          <li>Never store passwords permanently in local storage.</li>
          <li>Generate QR locally in browser only.</li>
          <li>Do not send password data to any server.</li>
          <li>Use clear-after-copy for safer sharing sessions.</li>
        </ul>

        <div className="qr-feature-list">
          <p><strong>Useful for:</strong> WiFi sharing, account setup between devices, quick secure transfer.</p>
          <p><strong>Flow:</strong> Enter password, generate QR, scan with phone, copy instantly.</p>
        </div>
      </section>
    </div>
  );
}

export default QRCodeShareCard;
