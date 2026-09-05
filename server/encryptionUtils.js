const crypto = require('crypto');

// AES-256 key material is 32 bytes.
function require32ByteKey(dataKey) {
  const key = Buffer.from(dataKey, 'base64');
  if (key.length !== 32) {
    throw new RangeError('Invalid key length: AES-256 requires a 32-byte key.');
  }
  return key;
}

/**
 * Encrypt a stored service password.
 *
 * Format: base64(iv) : base64(authTag) : base64(ciphertext)
 * Uses AES-256-GCM: authenticated encryption detects any tampering with the
 * ciphertext (CBC alone is malleable).
 */
function encryptPassword({ password, dataKey }) {
  const key = require32ByteKey(dataKey);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(password, 'utf-8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
}

/** Decrypt the legacy pre-GCM format: base64(iv) : base64(ciphertext) (AES-256-CBC). */
function decryptLegacyCbc(encryptedPassword, key) {
  const [ivBase64, encryptedBase64] = encryptedPassword.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(ivBase64, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, 'base64')),
    decipher.final(),
  ]).toString('utf-8');
}

function decryptPassword(encryptedPassword, dataKey) {
  const key = require32ByteKey(dataKey);
  const parts = String(encryptedPassword).split(':');

  // Legacy rows written before GCM are two-part CBC values.
  if (parts.length === 2) {
    return decryptLegacyCbc(encryptedPassword, key);
  }
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted password format');
  }

  const [ivBase64, tagBase64, dataBase64] = parts;
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivBase64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagBase64, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataBase64, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf-8');
}

module.exports = { encryptPassword, decryptPassword };
