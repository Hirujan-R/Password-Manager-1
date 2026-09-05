const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { encryptPassword, decryptPassword } = require('../encryptionUtils.js');

function sampleKey() {
  return crypto.randomBytes(32).toString('base64');
}

test('round-trips a plaintext password through AES-256-GCM', () => {
  const key = sampleKey();
  const secret = 'Tr0ub4dor&3-XyZ!';
  const blob = encryptPassword({ password: secret, dataKey: key });
  assert.equal(decryptPassword(blob, key), secret);
});

test('round-trips unicode characters', () => {
  const key = sampleKey();
  const secret = 'pässwörd-£€-日本語-🔑';
  const blob = encryptPassword({ password: secret, dataKey: key });
  assert.equal(decryptPassword(blob, key), secret);
});

test('each encryption uses a fresh IV (different ciphertext per call)', () => {
  const key = sampleKey();
  const a = encryptPassword({ password: 'same', dataKey: key });
  const b = encryptPassword({ password: 'same', dataKey: key });
  assert.notEqual(a, b);
});

test('decrypting with the wrong key throws', () => {
  const blob = encryptPassword({ password: 'secret', dataKey: sampleKey() });
  assert.throws(() => decryptPassword(blob, sampleKey()), /error/i);
});

test('tampered ciphertext is rejected by the GCM auth tag', () => {
  const key = sampleKey();
  const blob = encryptPassword({ password: 'secret', dataKey: key });
  const [iv, tag, data] = blob.split(':');
  const buf = Buffer.from(data, 'base64');
  buf[0] ^= 0xff; // flip a bit in the ciphertext
  const tampered = `${iv}:${tag}:${buf.toString('base64')}`;
  assert.throws(() => decryptPassword(tampered, key));
});

test('still decrypts legacy pre-GCM CBC ciphertexts (data migration)', () => {
  const key = Buffer.from(sampleKey(), 'base64');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update('old-cbc-row', 'utf-8'), cipher.final()]);
  const legacyBlob = `${iv.toString('base64')}:${encrypted.toString('base64')}`;
  assert.equal(decryptPassword(legacyBlob, key.toString('base64')), 'old-cbc-row');
});

test('rejects keys that are not 32 bytes', () => {
  assert.throws(() => encryptPassword({ password: 'x', dataKey: 'too-short' }), RangeError);
});
