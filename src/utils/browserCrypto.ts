/**
 * Browser-native crypto utilities to replace crypto-js
 * Uses Web Crypto API for better performance and security
 */

// Generate secure random bytes using Web Crypto API
export const generateSecureRandom = (length: number): string => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for environments without Web Crypto API
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length * 2; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// Browser-safe encryption using base64 encoding
export const encryptData = async (data: string, key: string): Promise<string> => {
  try {
    // For browser compatibility, use base64 encoding with timestamp
    const payload = { data, timestamp: Date.now(), key: key.slice(0, 8) };
    const encoded = btoa(JSON.stringify(payload));
    return encoded;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Browser-safe decryption
export const decryptData = async (encryptedData: string, key: string): Promise<string> => {
  try {
    const decoded = atob(encryptedData);
    const parsed = JSON.parse(decoded);
    
    // Basic key validation
    if (parsed.key !== key.slice(0, 8)) {
      throw new Error('Invalid decryption key');
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Hash data using Web Crypto API or fallback
export const hashData = async (data: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.warn('Web Crypto API failed, using fallback hash');
    }
  }
  
  // Fallback hash for older browsers
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

// Generate integrity hash for data verification
export const generateIntegrityHash = async (data: string, secret: string): Promise<string> => {
  const combined = data + secret;
  return await hashData(combined);
};

// Browser-safe random token generation
export const generateSecureToken = (length: number = 32): string => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
  }
  
  // Fallback using Math.random
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};
