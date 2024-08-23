import axios from 'axios';
import { hashPassword, comparePasswords } from "./PasswordUtils";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    timeout: 20000,
})

export async function addUser(email, password, openErrorAlert) {
    try { 
      const hashedPassword = await hashPassword(password);
      const response = await apiClient.post('/registration', {
        email: email,
        password_hash: hashedPassword
      });
      console.log(`User registered successfully! User ID is ${response.data.user_id}`);
    } catch (error) {
      if (error.response) {
        // Server responded with error code
        console.error('Server error:', error.response.data.error);
        if (error.response.data.error === "User with this email already exists") {
          openErrorAlert("⚠️ User with this email already exists.");
        }
        else {
          openErrorAlert('🛑 Server Error: ' + error.response.data.error);
        }
      }
      else if (error.request) {
        // No response from server
        console.error('Network error:', error.message);
        openErrorAlert("🛑 Network Error: " + error.message);
      }
      else {
        // All other errors
        console.error('Error:', error.message);
        openErrorAlert("🛑 Error: " + error.message);
      }
    }
}

export async function login(email, password, openErrorAlert) {
  try {
    const response  = await apiClient.get(`/login?email=${encodeURIComponent(email)}`);
    const isPasswordCorrect = await comparePasswords(password, response.data.password_hash);
    if (isPasswordCorrect == true) {
      console.log("User is successfully logged in! User ID is", response.data.user_id);
      return response.data.user_id;
    } else {
      openErrorAlert("⚠️ Password is incorrect.")
      return;
    }
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      console.error('Server error:', error.response.data.error);
      if (error.response.data.error === "User with this email doesn't exist" ) {
        openErrorAlert("⚠️ User with this email doesn't exist");
      } else {
        openErrorAlert('🛑 Server Error: ' + error.response.data.error);
      }
    } else if (error.request) {
      // No response from server
      console.error('Network error:', error.message);
      openErrorAlert("🛑 Network Error: " + error.message);
    } else {
      // All other errors
      console.error('Error:', error.message);
      openErrorAlert("🛑 Error: " + error.message);
    }
    return;
    
  }
}