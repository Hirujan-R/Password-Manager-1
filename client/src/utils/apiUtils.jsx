import axios from 'axios';
import { hashPassword } from "./PasswordUtils";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
})

export async function addUser(email, password) {
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