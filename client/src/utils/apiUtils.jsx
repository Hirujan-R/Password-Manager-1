import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    timeout: 20000,
    withCredentials: true
})

export async function addUser(email, password, openErrorAlert) {
    try { 
      const response = await apiClient.post('/registration', {
        email: email,
        password: password
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
    const response  = await apiClient.get(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    console.log(`User successfully logged in!`);
    return true;
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      console.error('Server error:', error.response.data.error);
      if (error.response.data.error === 'Incorrect username or password' ) {
        openErrorAlert("⚠️ Incorrect username or password.");
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
    return false;
  }
}

export async function getPasswords(setPasswords) {
  let returnMsg = ""; 
  try {
    console.log("Start of cookie verification");
    const response = await apiClient.get(`/getpasswords`);
    setPasswords(response.data.passwords);
    console.log("Cookies verified");
    returnMsg = "Passwords retrieved";
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      if (error.response.status === 500) {
        console.log("Database Error:", error.response.data.error);
        console.error("Database Error:", error.response.data.error);
        returnMsg = "🛑 Error: Failure to connect to database";
      } else if (error.response.status === 400) {
        console.log("Session Cookie Error:", error.response.data.error);
        console.error("Session Cookie Error:", error.response.data.error);
        returnMsg = "⚠️ Error: Invalid session";
      } else {
        console.log("Server Error:" , error.response.data.error);
        console.error("Server Error:" , error.response.data.error);
        returnMsg = "🛑 Error: " + error.response.data.error;
      }
    } else if (error.request) {
      // No response from server
      console.log('Network error:', error.message);
      console.error('Network error:', error.message);
      returnMsg = "🛑 Error: " + error.message; 
    } else {
      // All other errors
      console.error('Error:', error.message);
      console.error("Error: " + error.message);
      returnMsg = "🛑 Error: " + error.message; 
    }
  }
  return returnMsg;
}