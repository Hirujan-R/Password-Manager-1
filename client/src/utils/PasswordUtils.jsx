import bcrypt from 'bcryptjs'; 
import axios from 'axios';
import React, {useState} from 'react';

// Adding new password to table
export function addPassword({newServiceName, newPassword, passwords, setPasswords}) {
    console.log(newServiceName);
    console.log(newPassword);
    const updatedPasswords = [...passwords, {index: passwords.length, name: newServiceName, password: newPassword }];
    setPasswords(updatedPasswords);
}

// Function for editting passwords
export function editPassword({newServiceName, newPassword, passwordIndex, passwords, setPasswords}) {
  const updatedPasswords = passwords.map(password => 
    password.index == passwordIndex ? {...password, name: newServiceName, password: newPassword} : password
  );
  setPasswords(updatedPasswords);
}

// Function for deleting passwords
export function deletePassword({passwordIndex, passwords, setPasswords}) {
  const updatedPasswords = passwords.filter(pasword => passwordIndex !== pasword.index);
  setPasswords(updatedPasswords);
}

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


// Hashing password
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassord = await bcrypt.hash(password, saltRounds);
  return hashedPassord;
}

// Comparing password hash from server with inputted user password
export async function comparePasswords(password, hashedPassord) {
  return await bcrypt.compare(password, hashedPassord);
}

export async function addUser(email, password) {
  try {
    const hashedPassword = await hashPassword(password);
    const response = await axios.post('http://localhost:5000/api/registration', {
      email: email,
      password_hash: hashedPassword
    });
    console.log(`User registered successfully! User ID is ${response.data.user_id}`);
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      console.error('Server error:', error.response.data.error);
    }
    if (error.request) {
      // No response from server
      console.error('Network error:', error.message);
    }
    else {
      // All other errors
      console.error('Error:', error.message);
    }
  }
}