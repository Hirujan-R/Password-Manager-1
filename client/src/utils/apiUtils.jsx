import axios from 'axios';
import { hashPassword } from "./PasswordUtils";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    timeout: 10000,
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