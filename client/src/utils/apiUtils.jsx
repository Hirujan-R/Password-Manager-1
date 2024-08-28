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
    if (response.data.message != "No Passwords") {
      if (Array.isArray(response.data.passwords) && response.data.passwords.length > 0) {
        setPasswords(response.data.passwords);
      }
    }
    console.log("Cookies verified");
    returnMsg = response.data.message;
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
  console.log(returnMsg);
  return returnMsg;
}

export async function createPassword({serviceName, password, openEventAlert, openErrorAlert, setPasswords}) {
  try {
    const response = await apiClient.post('/createpassword', {
      service_name: serviceName,
      password: password
    })
    console.log('Password successfully created')
    getPasswords(setPasswords);
    openEventAlert("Password successfully created.");
  } catch (error) {
    if (error.response) {
      console.error('⚠️ Server error:', error.response.data.error);
      openErrorAlert('⚠️ Server error: ' + error.response.data.error);
    } else if (error.request) {
      console.error('🛑 Network error:', error.message);
      openErrorAlert('🛑 Network error: ' + error.message);
    } else {
      console.error('🛑 Error:', error.message);
      openErrorAlert('🛑 Error: ' + error.message);
    }
  }
}

export async function editPassword({newServiceName, newPassword, passwordID, setPasswords, openErrorAlert, openEventAlert}) {
  try {
    const response = await apiClient.put('/updatepassword', {
      password_id: passwordID,
      service_name: newServiceName, 
      password: newPassword
    })
    console.log("User successfully updated password.")
    getPasswords(setPasswords);
    openEventAlert("Password has been successfully updated.");
  } catch (error) {
    if (error.response) {
      console.error('⚠️ Server error:', error.response.data.error);
      openErrorAlert('⚠️ Server error: ' + error.response.data.error);
    } else if (error.request) {
      console.error('🛑 Network error:', error.message);
      openErrorAlert('🛑 Network error: ' + error.message);
    }
    else {
      console.error('🛑 Error:', error.message);
      openErrorAlert('🛑 Error: ' + error.message);
    }
  }
}