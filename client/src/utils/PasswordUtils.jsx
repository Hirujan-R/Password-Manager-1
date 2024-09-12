// Function for generating random passwords
export function generateRandomPassword(passwordLength=0){
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  if (passwordLength === 0) {passwordLength = 15 + Math.floor(Math.random()*10);};
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



