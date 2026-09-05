const { test } = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, comparePasswords } = require('../hashUtils.js');

test('hashPassword returns a bcrypt hash that matches the input', async () => {
  const hash = await hashPassword('correct horse battery staple');
  assert.notEqual(hash, 'correct horse battery staple');
  assert.match(hash, /^\$2[aby]\$/);
  assert.equal(await comparePasswords('correct horse battery staple', hash), true);
});

test('comparePasswords rejects a wrong password', async () => {
  const hash = await hashPassword('right-password');
  assert.equal(await comparePasswords('wrong-password', hash), false);
});

test('each hash is salted so identical passwords differ', async () => {
  const a = await hashPassword('same-password');
  const b = await hashPassword('same-password');
  assert.notEqual(a, b);
});
