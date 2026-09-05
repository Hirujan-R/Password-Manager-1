// Cryptographically secure random helpers - Math.random() must never be used
// for secrets such as generated passwords.
function randomIndex(max) {
  // Rejection sampling removes the modulo bias so every character is uniform.
  const maxValid = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= maxValid);
  return value % max;
}

// Function for generating random passwords
export function generateRandomPassword(passwordLength = 0) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  // If a password length hasn't been provided by the user, pick a random one between 15 and 25.
  const length = passwordLength || (15 + randomIndex(10));
  let password = '';
  for (let index = 0; index < length; index++) {
    password += charset[randomIndex(charset.length)];
  }
  return password;
}

// Placing randomly generated password in input field
export function randomisePassword(setValues, element) {
  setValues(element, generateRandomPassword());
}
