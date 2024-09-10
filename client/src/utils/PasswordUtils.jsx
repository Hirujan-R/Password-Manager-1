// Function for generating random passwords
export function generateRandomPassword(){
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let index = 0; index < 14; index++) {
    const randomIndex = Math.floor(Math.random()*charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Placing random password in input
export function randomisePassword(elementID) {
  document.getElementById(elementID).value = generateRandomPassword();
}



