// Function for generating random passwords
export function generateRandomPassword(){
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  let passwordLength = 15 + Math.floor(Math.random()*10);
  for (let index = 0; index < passwordLength; index++) {
    const randomIndex = Math.floor(Math.random()*charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Placing random password in input
export function randomisePassword(setValues, element) {
  setValues(element, generateRandomPassword());
}



