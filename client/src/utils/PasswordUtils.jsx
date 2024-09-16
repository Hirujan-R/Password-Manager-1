// Function for generating random passwords
export function generateRandomPassword(passwordLength=0){
  // charset is a string containing characters that can be used in a password
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  // if a password length hasn't been provided by user, then its is a random number between 15 and 25
  if (passwordLength === 0) {passwordLength = 15 + Math.floor(Math.random()*10);};
  // Add random character from charset passwordLength number of times
  for (let index = 0; index < passwordLength; index++) {
    const randomIndex = Math.floor(Math.random()*charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Placing randomly generated password in input field
export function randomisePassword(setValues, element) {
  setValues(element, generateRandomPassword());
}



