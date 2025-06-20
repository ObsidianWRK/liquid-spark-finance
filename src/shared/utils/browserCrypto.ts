/**
 * Web Crypto API utilities to replace crypto-js
 * Provides AES-256-GCM encryption, SHA-256 hashing, and secure random generation
 * Compatible with VueniSecureStorage and other crypto operations
 */

// Convert string to ArrayBuffer
const stringToArrayBuffer = (str: string): ArrayBuffer => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

// Convert ArrayBuffer to string
const arrayBufferToString = (buffer: ArrayBuffer): string => {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
};

// Convert ArrayBuffer to hex string
const arrayBufferToHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
};

// Convert hex string to ArrayBuffer
const hexToArrayBuffer = (hex: string): ArrayBuffer => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
};

// Generate cryptographically secure random bytes
export const generateSecureRandom = (length: number): string => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return arrayBufferToHex(array.buffer);
  }

  // Fallback for non-crypto environments
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length * 2; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// Generate secure random token
export const generateSecureToken = (length: number = 32): string => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(array);
    return arrayBufferToHex(array.buffer).slice(0, length);
  }

  // Fallback using Math.random
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// Derive key from password using PBKDF2
const deriveKey = async (
  password: string,
  salt: ArrayBuffer
): Promise<CryptoKey> => {
  if (!crypto.subtle) {
    throw new Error('Web Crypto API not available');
  }

  // Import the password as a key
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive the AES key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// AES-GCM encryption (more secure than AES-CBC)
export const encryptAES = async (
  data: string,
  password: string
): Promise<string> => {
  if (!crypto.subtle) {
    throw new Error('Web Crypto API not available');
  }

  try {
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12)); // GCM uses 12-byte IV

    // Derive key from password
    const key = await deriveKey(password, salt.buffer);

    // Encrypt the data
    const dataBuffer = stringToArrayBuffer(data);
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBuffer
    );

    // Combine salt + iv + encrypted data
    const combined = new Uint8Array(
      salt.length + iv.length + encryptedBuffer.byteLength
    );
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

    return arrayBufferToHex(combined.buffer);
  } catch (error) {
    console.error('Web Crypto encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

// AES-GCM decryption
export const decryptAES = async (
  encryptedHex: string,
  password: string
): Promise<string> => {
  if (!crypto.subtle) {
    throw new Error('Web Crypto API not available');
  }

  try {
    const encryptedBuffer = hexToArrayBuffer(encryptedHex);
    const encryptedArray = new Uint8Array(encryptedBuffer);

    // Extract salt, IV, and encrypted data
    const salt = encryptedArray.slice(0, 16).buffer;
    const iv = encryptedArray.slice(16, 28);
    const encrypted = encryptedArray.slice(28).buffer;

    // Derive key from password
    const key = await deriveKey(password, salt);

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );

    return arrayBufferToString(decryptedBuffer);
  } catch (error) {
    console.error('Web Crypto decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

// SHA-256 hashing
export const hashSHA256 = async (data: string): Promise<string> => {
  if (!crypto.subtle) {
    // Fallback hash for environments without Web Crypto API
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  try {
    const dataBuffer = stringToArrayBuffer(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return arrayBufferToHex(hashBuffer);
  } catch (error) {
    console.error('SHA-256 hashing failed:', error);
    throw new Error('Failed to hash data');
  }
};

// Generate integrity hash with secret
export const generateIntegrityHash = async (
  data: string,
  secret: string
): Promise<string> => {
  return await hashSHA256(data + secret);
};

// Backward compatibility functions
export const encryptData = encryptAES;
export const decryptData = decryptAES;
export const hashData = hashSHA256;

// Simple synchronous wrapper for immediate compatibility (not as secure)
export const encryptSync = (data: string, key: string): string => {
  // This is a simplified base64 encoding for immediate compatibility
  // In production, you should migrate to the async version
  console.warn(
    'Using synchronous encryption fallback - consider migrating to async encryptAES'
  );
  const payload = { data, key: key.slice(0, 8), timestamp: Date.now() };
  return btoa(JSON.stringify(payload));
};

export const decryptSync = (encryptedData: string, key: string): string => {
  // This is a simplified base64 decoding for immediate compatibility
  console.warn(
    'Using synchronous decryption fallback - consider migrating to async decryptAES'
  );
  try {
    const payload = JSON.parse(atob(encryptedData));
    if (payload.key !== key.slice(0, 8)) {
      throw new Error('Invalid key');
    }
    return payload.data;
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
};

export const hashSync = (data: string): string => {
  // Simple hash for immediate compatibility
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};
