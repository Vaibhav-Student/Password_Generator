import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { copyText } from '../utils/passwordUtils';
import { decodeInternalQrPayload } from '../utils/qrPayloadUtils';

const MAX_UPLOAD_SIZE = 8 * 1024 * 1024;

async function readQrTextFromImage(file) {
  const objectUrl = URL.createObjectURL(file);
  const image = await new Promise((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('Unable to read image for QR decoding.'));
    element.src = objectUrl;
  });

  try {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Unable to process image data for QR decoding.');
    }

    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth'
    });

    if (!decoded?.data) {
      throw new Error('No QR code detected in the uploaded image.');
    }

    return decoded.data;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function formatIssuedAt(timestamp) {
  if (!timestamp) return 'Unavailable';

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Unavailable';

  return date.toLocaleString();
}

function QRCodeExtractorCard() {
  const [fileName, setFileName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const fileInputRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => setToast(''), 1800);
  };

  const resetExtractor = () => {
    setFileName('');
    setResult(null);
    setError('');
    setIsScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFileName(selectedFile.name);
    setResult(null);
    setError('');
    setIsScanning(true);

    try {
      if (!selectedFile.type.startsWith('image/')) {
        throw new Error('Only image files are allowed for QR extraction.');
      }

      if (selectedFile.size > MAX_UPLOAD_SIZE) {
        throw new Error('Image file is too large. Please upload a file under 8MB.');
      }

      const decodedText = await readQrTextFromImage(selectedFile);
      const parsed = await decodeInternalQrPayload(decodedText);
      setResult(parsed);
      showToast('Internal QR decoded');
    } catch (decodeError) {
      setError(decodeError.message || 'QR decoding failed.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyPassword = async () => {
    if (!result) return;
    if (!result.password) {
      showToast('No password available to copy');
      return;
    }

    const copied = await copyText(result.password);
    showToast(copied ? 'Password copied' : 'Copy failed');
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const isOpenNetwork = result?.mode === 'wifi' && result?.wifiType === 'nopass' && !result?.password;
  const extractedPassword = result
    ? isOpenNetwork
      ? 'No password (open network)'
      : result.password
    : '';

  return (
    <div className="qr-extractor-layout">
      <section className="generator-card glass-panel qr-extractor-card">
        <div className="card-header">
          <h2>QR Code Extractor</h2>
          <span className="card-badge">Internal Only</span>
        </div>

        <p className="qr-extractor-note">
          Upload a QR image to decode password data. Only SecurePass signed QR payloads are accepted.
        </p>

        <section className="options-section mt-4">
          <h3>Upload QR Image</h3>
          <div className="qr-extractor-upload-row">
            <label htmlFor="qr-extractor-file" className="icon-btn qr-extractor-action-btn">
              <svg viewBox="0 0 24 24" fill="none" role="presentation">
                <path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Choose Image
            </label>
            <input
              id="qr-extractor-file"
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/bmp"
              onChange={handleFileChange}
              className="sr-only"
            />

            <button type="button" className="icon-btn qr-extractor-action-btn" onClick={resetExtractor}>
              <svg viewBox="0 0 24 24" fill="none" role="presentation">
                <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m-8 0v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Clear
            </button>
          </div>
          <p className="qr-extractor-file-name">{fileName || 'No file selected'}</p>
        </section>

        {isScanning ? <p className="qr-extractor-status">Scanning QR code...</p> : null}
        {error ? <p className="qr-extractor-error">{error}</p> : null}

        {result ? (
          <>
            <section className="password-display mt-4">
              <label htmlFor="extracted-password">Extracted Password</label>
              <div className="display-field qr-input-field">
                <input
                  id="extracted-password"
                  type="text"
                  value={extractedPassword}
                  readOnly
                  className="qr-password-input"
                />

                <div className="display-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={handleCopyPassword}
                    aria-label="Copy extracted password"
                  >
                    <svg viewBox="0 0 24 24" fill="none" role="presentation">
                      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </section>

            <section className="options-section mt-4">
              <h3>Decoded Details</h3>
              <div className="qr-extractor-meta-grid">
                <article className="qr-extractor-meta-card">
                  <span>Mode</span>
                  <strong>{result.mode === 'wifi' ? 'WiFi' : 'Password'}</strong>
                </article>
                <article className="qr-extractor-meta-card">
                  <span>SSID</span>
                  <strong>{result.mode === 'wifi' ? (result.ssid || 'Unavailable') : 'Not applicable'}</strong>
                </article>
                <article className="qr-extractor-meta-card">
                  <span>Security Type</span>
                  <strong>{result.mode === 'wifi' ? result.wifiType : 'Not applicable'}</strong>
                </article>
                <article className="qr-extractor-meta-card">
                  <span>Issued At</span>
                  <strong>{formatIssuedAt(result.issuedAt)}</strong>
                </article>
              </div>
            </section>
          </>
        ) : (
          <p className="qr-placeholder-text">Upload a SecurePass QR image to extract its password.</p>
        )}

        {toast ? <div className="toast">{toast}</div> : null}
      </section>

      <section className="history-card glass-panel qr-tips-card">
        <div className="section-head">
          <h3>Validation Rules</h3>
          <span>Strict</span>
        </div>

        <ul className="qr-tips-list">
          <li>Only signed SecurePass internal QR payloads are accepted.</li>
          <li>External or unknown QR formats are rejected automatically.</li>
          <li>Decoding is done locally in your browser.</li>
          <li>No extracted password is sent to any server.</li>
        </ul>
      </section>
    </div>
  );
}

export default QRCodeExtractorCard;
