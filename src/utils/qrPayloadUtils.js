const INTERNAL_QR_PREFIX = 'SECUREPASSQR1';
const INTERNAL_QR_ISSUER = 'securepass-web';
const INTERNAL_QR_VERSION = 1;
const INTERNAL_QR_SIGNING_SALT = 'securepass-internal-signing-salt-v1';
const MAX_PASSWORD_LENGTH = 512;
const MAX_SSID_LENGTH = 64;

function toBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(value) {
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sha256Hex(value) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function normalizeWifiType(value) {
  if (value === 'WEP' || value === 'nopass') return value;
  return 'WPA';
}

function normalizePayload(payload) {
  const safeMode = payload?.mode === 'wifi' ? 'wifi' : 'password';
  const password = String(payload?.password ?? '');

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error('Password is too long to encode in QR payload.');
  }

  const normalized = {
    iss: INTERNAL_QR_ISSUER,
    v: INTERNAL_QR_VERSION,
    mode: safeMode,
    password,
    iat: Date.now()
  };

  if (safeMode === 'wifi') {
    normalized.ssid = String(payload?.ssid ?? '').trim().slice(0, MAX_SSID_LENGTH);
    normalized.wifiType = normalizeWifiType(payload?.wifiType);
  }

  return normalized;
}

async function signPayload(encodedPayload) {
  return sha256Hex(`${INTERNAL_QR_PREFIX}.${encodedPayload}.${INTERNAL_QR_SIGNING_SALT}`);
}

export async function buildInternalQrPayload(payload) {
  const normalized = normalizePayload(payload);
  const encodedPayload = toBase64Url(JSON.stringify(normalized));
  const signature = await signPayload(encodedPayload);
  return `${INTERNAL_QR_PREFIX}.${encodedPayload}.${signature}`;
}

export async function decodeInternalQrPayload(rawValue) {
  const value = String(rawValue || '').trim();
  const parts = value.split('.');

  if (parts.length !== 3 || parts[0] !== INTERNAL_QR_PREFIX) {
    throw new Error('Rejected: this QR is not from SecurePass internal format.');
  }

  const encodedPayload = parts[1];
  const signature = parts[2];
  const expectedSignature = await signPayload(encodedPayload);

  if (signature !== expectedSignature) {
    throw new Error('Rejected: invalid internal QR signature.');
  }

  let payload;
  try {
    payload = JSON.parse(fromBase64Url(encodedPayload));
  } catch (error) {
    throw new Error('Rejected: corrupted internal QR payload.');
  }

  if (
    payload?.iss !== INTERNAL_QR_ISSUER ||
    payload?.v !== INTERNAL_QR_VERSION ||
    (payload?.mode !== 'password' && payload?.mode !== 'wifi')
  ) {
    throw new Error('Rejected: unsupported internal QR payload.');
  }

  const password = String(payload.password ?? '');
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error('Rejected: payload password length exceeds limit.');
  }

  if (payload.mode === 'wifi') {
    return {
      mode: 'wifi',
      password,
      ssid: String(payload.ssid ?? '').slice(0, MAX_SSID_LENGTH),
      wifiType: normalizeWifiType(payload.wifiType),
      issuedAt: typeof payload.iat === 'number' ? payload.iat : null
    };
  }

  return {
    mode: 'password',
    password,
    issuedAt: typeof payload.iat === 'number' ? payload.iat : null
  };
}
