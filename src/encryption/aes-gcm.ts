
const DEFAULT_SALT_LENGTH = 16;
const DEFAULT_IV_LENGTH = 12;
const DEFAULT_ITERATIONS = 600000;

export interface EncryptionOptions {
  saltLength?: number;
  ivLength?: number;
  iterations?: number;
}

/**
 * Derives an AES-GCM key from a password string using PBKDF2.
 * @param password The input password string.
 * @param salt The salt (Uint8Array).
 * @param iterations The number of PBKDF2 iterations.
 * @returns A CryptoKey suitable for AES-GCM.
 */
async function deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return globalThis.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Helper to convert Uint8Array to Binary String (safe for large data).
 */
function uint8ArrayToBinaryString(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

/**
 * Helper to convert Binary String to Uint8Array.
 */
function binaryStringToUint8Array(binary: string): Uint8Array {
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypts a text string using AES-GCM with PBKDF2 key derivation.
 * Format: Base64(Salt + IV + Ciphertext)
 * @param text The plain text to encrypt.
 * @param secret The secret password (string).
 * @param options Optional encryption settings.
 * @returns A Promise that resolves to the encrypted string.
 */
export async function encrypt(text: string, secret: string, options: EncryptionOptions = {}): Promise<string> {
  const saltLength = options.saltLength ?? DEFAULT_SALT_LENGTH;
  const ivLength = options.ivLength ?? DEFAULT_IV_LENGTH;
  const iterations = options.iterations ?? DEFAULT_ITERATIONS;

  const salt = globalThis.crypto.getRandomValues(new Uint8Array(saltLength));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(ivLength));
  const key = await deriveKey(secret, salt, iterations);

  const enc = new TextEncoder();
  const data = enc.encode(text);

  const ciphertextBuffer = await globalThis.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );

  const ciphertext = new Uint8Array(ciphertextBuffer);

  // Combine Salt + IV + Ciphertext
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(ciphertext, salt.length + iv.length);

  return btoa(uint8ArrayToBinaryString(combined));
}

/**
 * Decrypts an encrypted string using AES-GCM with PBKDF2 key derivation.
 * @param encryptedText The encrypted string (Base64 encoded).
 * @param secret The secret password (string).
 * @param options Optional encryption settings (must match encryption settings).
 * @returns A Promise that resolves to the decrypted plain text.
 */
export async function decrypt(encryptedText: string, secret: string, options: EncryptionOptions = {}): Promise<string> {
  const saltLength = options.saltLength ?? DEFAULT_SALT_LENGTH;
  const ivLength = options.ivLength ?? DEFAULT_IV_LENGTH;
  const iterations = options.iterations ?? DEFAULT_ITERATIONS;

  const combinedString = atob(encryptedText);
  const combined = binaryStringToUint8Array(combinedString);

  // Validate minimum length (Salt + IV + Tag(16 bytes implied in ciphertext))
  if (combined.length < saltLength + ivLength) {
    throw new Error('Invalid encrypted data: too short');
  }

  // Extract Salt, IV, and Ciphertext
  const salt = combined.slice(0, saltLength);
  const iv = combined.slice(saltLength, saltLength + ivLength);
  const ciphertext = combined.slice(saltLength + ivLength);

  const key = await deriveKey(secret, salt, iterations);

  const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    ciphertext
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}
