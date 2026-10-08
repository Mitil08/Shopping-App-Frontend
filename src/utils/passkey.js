/**
 * WebAuthn / Passkey Helper Utilities for Client Authentication
 * Supports Touch ID, Face ID, Windows Hello, and Security Keys
 */

// Convert ArrayBuffer or Uint8Array to base64url string
export const bufferToBase64url = (buffer) => {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Convert base64url string to Uint8Array / ArrayBuffer
export const base64urlToBuffer = (base64url) => {
  if (!base64url) return new Uint8Array();
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

// Check if modern WebAuthn Passkeys are supported by current browser/device
export const isPasskeySupported = async () => {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;
  try {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return !!available;
    }
    return true;
  } catch (err) {
    console.warn('Passkey platform check error:', err);
    return false;
  }
};

/**
 * Execute native WebAuthn Registration (Credential Creation)
 * @param {Object} creationOptions Server generated options
 */
export const performWebAuthnRegistration = async (creationOptions) => {
  if (!window.PublicKeyCredential) {
    throw new Error('WebAuthn Passkeys are not supported on this browser.');
  }

  const publicKey = {
    ...creationOptions,
    challenge: base64urlToBuffer(creationOptions.challenge),
    user: {
      ...creationOptions.user,
      id: typeof creationOptions.user.id === 'string' 
        ? new TextEncoder().encode(creationOptions.user.id)
        : creationOptions.user.id
    },
    pubKeyCredParams: creationOptions.pubKeyCredParams || [
      { type: 'public-key', alg: -7 },  // ES256
      { type: 'public-key', alg: -257 } // RS256
    ],
    authenticatorSelection: creationOptions.authenticatorSelection || {
      authenticatorAttachment: 'platform',
      userVerification: 'preferred',
      residentKey: 'preferred'
    },
    timeout: creationOptions.timeout || 60000
  };

  const credential = await navigator.credentials.create({ publicKey });
  if (!credential) {
    throw new Error('Biometric passkey registration was declined or timed out.');
  }

  return {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: bufferToBase64url(credential.response.clientDataJSON),
      attestationObject: bufferToBase64url(credential.response.attestationObject),
      transports: credential.response.getTransports ? credential.response.getTransports() : []
    }
  };
};

/**
 * Execute native WebAuthn Authentication (Credential Assertion)
 * @param {Object} requestOptions Server generated login options
 */
export const performWebAuthnLogin = async (requestOptions) => {
  if (!window.PublicKeyCredential) {
    throw new Error('WebAuthn Passkeys are not supported on this browser.');
  }

  const allowCredentials = (requestOptions.allowCredentials || []).map((cred) => ({
    type: cred.type || 'public-key',
    id: typeof cred.id === 'string' ? base64urlToBuffer(cred.id) : cred.id,
    transports: cred.transports
  }));

  const publicKey = {
    challenge: base64urlToBuffer(requestOptions.challenge),
    timeout: requestOptions.timeout || 60000,
    rpId: requestOptions.rpId || window.location.hostname,
    userVerification: requestOptions.userVerification || 'preferred',
    ...(allowCredentials.length > 0 ? { allowCredentials } : {})
  };

  const assertion = await navigator.credentials.get({ publicKey });
  if (!assertion) {
    throw new Error('Biometric verification cancelled or unavailable.');
  }

  return {
    id: assertion.id,
    rawId: bufferToBase64url(assertion.rawId),
    type: assertion.type,
    response: {
      clientDataJSON: bufferToBase64url(assertion.response.clientDataJSON),
      authenticatorData: bufferToBase64url(assertion.response.authenticatorData),
      signature: bufferToBase64url(assertion.response.signature),
      userHandle: assertion.response.userHandle ? bufferToBase64url(assertion.response.userHandle) : null
    }
  };
};
