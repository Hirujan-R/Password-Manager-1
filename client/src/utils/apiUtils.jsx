import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    timeout: 5000,
    withCredentials: true
})

export async function addUser({email, password, openErrorAlert, openEventAlert}) {
    try { 
      const response = await apiClient.post('/registration', {
        email: email,
        password: password
      });
      console.log(`User registered successfully! User ID is ${response.data.user_id}`);
      openEventAlert('User registered successfully!');
    } catch (error) {
      if (error.response) {
        // Server responded with error code
        console.error('Server error:', error.response.data.error);
        if (error.response.data.error === "User with this email already exists") {
          openErrorAlert({errorDetails:'🛑 User Error: ' + error.response.data.error});
        }
      }
      else if (error.request) {
        // No response from server
        console.error('Network error:', error.message);
        openErrorAlert({errorDetails:"🛑 Network Error: " + error.message});
      }
      else {
        // All other errors
        console.error('Error:', error.message);
        openErrorAlert({errorDetails:"🛑 Error: " + error.message});
      }
    }
}

export async function login({email, password, openErrorAlert}) {
  try {
    const response  = await apiClient.get(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    console.log(`User successfully logged in!`);
    return true;
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      console.error('Server error:', error.response.data.error);
      if (error.response.data.error === 'Incorrect username or password' ) {
        openErrorAlert({errorDetails:"⚠️ Incorrect username or password."});
      } else {
        openErrorAlert({errorDetails:'🛑 Server Error: ' + error.response.data.error});
      }
    } else if (error.request) {
      // No response from server
      console.error('Network error:', error.message);
      openErrorAlert({errorDetails:"🛑 Network Error: " + error.message});
    } else {
      // All other errors
      console.error('Error:', error.message);
      openErrorAlert({errorDetails:"🛑 Error: " + error.message});
    }
    return false;
  }
}

export async function getPasswords({setPasswords, openErrorAlert, openErrorModal}) {
  try {
    const response = await apiClient.get(`/getpasswords`);
    if (response.data.message != "No Passwords") {
      if (Array.isArray(response.data.passwords) && response.data.passwords.length > 0) {
        setPasswords(response.data.passwords);
      }
    } else {
      setPasswords([]);
    }
    
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      if (error.response.status === 500) {
        console.error("Database Error:", error.response.data.error);
        openErrorModal({errorTitle:"Error Retrieving Passwords", errorDetails:"🛑 Error: Failure to connect to database"});
      } else if (error.response.status === 400) {
        console.error("Session Cookie Error:", error.response.data.error);
        openErrorModal({errorTitle:"Error Retrieving Passwords", errorDetails:'🛑 Your session has expired'});
      } else {
        console.error("Server Error:" , error.response.data.error);
        openErrorAlert({errorDetails:"🛑 Error: " + error.response.data.error});
      }
    } else if (error.request) {
      // No response from server
      console.error('Network error:', error.message);
      openErrorModal({errorTitle:"Error Retrieving Passwords", errorDetails:"🛑 Error: " + error.message}); 
    } else {
      // All other errors
      console.error("Error: " + error.message);
      openErrorAlert({errorDetails:"🛑 Error: " + error.message}); 
    }
  }
}

export async function createPassword({serviceName, password, setPasswords, openEventAlert, openErrorAlert, openErrorModal}) {
  try {
    const response = await apiClient.post('/createpassword', {
      service_name: serviceName,
      password: password
    })
    await getPasswords({setPasswords, openErrorAlert, openErrorModal});
    openEventAlert("Password successfully created.");
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.error("Database Error:", error.response.data.error);
        openErrorModal({errorTitle: "Error Adding Password", errorDetails:"🛑 Error: Failure to connect to database"});
      } else if (error.response.status === 400) {
        console.error({errorDetails:"User error: " + error.response.data.error});
        if (error.response.data.error === "Unauthorised") {
          openErrorModal({errorTitle: "Error Adding Password", errorDetails:"🛑 Error: Your session has expired"});
        } else {
          openErrorModal({errorTitle: "Error Adding Password", errorDetails:"🛑 Error: " + error.response.data.error});
        }}
    } else if (error.request) {
      console.error('🛑 Network error:', error.message);
      openErrorModal({errorTitle: "Error Adding Password", errorDetails:'🛑 Network error: ' + error.message});
    } else {
      console.error('🛑 Error:', error.message);
      openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
    }
  }
}

export async function editPassword({newServiceName, newPassword, passwordID, setPasswords, openEventAlert, openErrorAlert, openErrorModal}) {
  try {
    const response = await apiClient.put('/updatepassword', {
      password_id: passwordID,
      service_name: newServiceName, 
      password: newPassword
    })
    await getPasswords({setPasswords, openErrorAlert, openErrorModal});
    openEventAlert("Password has been successfully updated.");
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.error("Database Error:", error.response.data.error);
        openErrorModal({errorTitle:"Error Editting Password", errorDetails:"🛑 Error: Failure to connect to database"});
      } else if (error.response.status === 400) {
        console.error("User error: " + error.response.data.error);
        if (error.response.data.error === "Unauthorised") {
          openErrorModal({errorTitle:"Error Editting Password", errorDetails:"🛑 Error: Your session has expired"});
        } else {
          openErrorAlert({errorDetails: '🛑 Error: ' + error.response.data.error});
        }}
    } else if (error.request) {
      console.error('🛑 Network error:', error.message);
      openErrorModal({errorTitle:"Error Editting Password", errorDetails:'🛑 Network error: ' + error.message});
    } else {
      console.error('🛑 Error:', error.message);
      openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
    }
  }
}

export async function deletePassword({passwordID, openEventAlert, openErrorAlert, setPasswords, openErrorModal}) {
  try {
    const response = await apiClient.delete(`/deletepassword/${passwordID}`)
    console.log('Password successfully deleted.');
    await getPasswords({setPasswords, openErrorAlert, openErrorModal});
    openEventAlert('Password successfully deleted.');

  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.error('🛑 Database Error: ' + error.response.data.details);
        openErrorModal({errorTitle:'Error Deleting Password', errorDetails:'🛑 Database Error: ' + error.response.data.details});
      } else if (error.response.status === 400) {
        console.error('🛑 User Error: ' + error.response.data.error);
        if (error.response.data.error === "Unauthorised") {
          openErrorModal({errorTitle:'Error Deleting Password', errorDetails:'🛑 Error: Your session has expired'});
        } else {openErrorAlert({errorDetails:'🛑 Error: ' + error.response.data.error});}
      }
    } else if (error.request) {
      console.error('🛑 Network Error: ' + error.message);
      openErrorModal({errorTitle:'Error Deleting Password', errorDetails:'🛑 Network Error: ' + error.message});
    } else {
      console.log('Error: ' + error.message);
      openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
    }
  }
  
}


export async function getEmail({openErrorAlert, openErrorModal}) {
  try {
    const response = await apiClient.get('/getemail');
    console.log('Email successfully retrieved');
    return response.data.email;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        console.error('Database Error: ' + error.response.data.error);
        openErrorModal({errorTitle:'Error Retrieving Email', errorDetails:'🛑 Database Error: ' + error.response.data.error});
      } else if (error.response.status === 400) {
        console.error('User Error: ' + error.response.data.error);
        if (error.response.data.error === "Unauthorised") {
          openErrorModal({errorTitle:'Error Retrieving Email', errorDetails:'🛑 Error: Your session has expired'});
        } else {openErrorAlert({errorDetails:'🛑 Error: ' + error.response.data.error});}
      }
    } else if (error.request) {
      console.error('Server Error: ' + error.message);
      openErrorModal({errorTitle:'Error Retrieving Email', errorDetails:'🛑 Server Error: ' + error.message});
    } else {
      console.error('Error: ' + error.message);
      openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
    }
  }
  
}

export async function editEmail({newEmail, openErrorAlert, openEventAlert, openErrorModal, setEmail}) {
  try {
    const response = await apiClient.put('/updateemail', {
      newEmail: newEmail
    });
    console.log('Email successfully updated');
    openEventAlert({eventDetails: 'Email successfully updated'});
    setEmail(newEmail);
  } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          console.error("Database Error:", error.response.data.error);
          openErrorModal({errorTitle:"Error Editting Email", errorDetails:"🛑 Error: Failure to connect to database"});
        } else if (error.response.status === 400) {
          console.error("User error: " + error.response.data.error);
          if (error.response.data.error === "Unauthorised") {
            openErrorModal({errorTitle:"Error Editting Email", errorDetails:"🛑 Error: Your session has expired"});
          } else {
            openErrorAlert({errorDetails: '🛑 Error: ' + error.response.data.error});
          }}
      } else if (error.request) {
        console.error('🛑 Network error:', error.message);
        openErrorModal({errorTitle:"Error Editting Email", errorDetails:'🛑 Network error: ' + error.message});
      } else {
        console.error('🛑 Error:', error.message);
        openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
      }
  }
}

export async function editUserPassword({oldPassword, newPassword, openErrorAlert, openEventAlert, openErrorModal}) {
  try {
    const response = await apiClient.put('/updateuserpassword', {
      oldPassword: oldPassword, 
      newPassword: newPassword
    });
    console.log('User Password successfully updated');
    openEventAlert({eventDetails:'User Password successfully updated'});
  } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          console.error("Database Error:", error.response.data.error);
          openErrorModal({errorTitle:"Error Editting Password", errorDetails:"🛑 Error: Failure to connect to database"});
        } else if (error.response.status === 400) {
          console.error("User error: " + error.response.data.error);
          if (error.response.data.error === "Unauthorised") {
            openErrorModal({errorTitle:"Error Editting Password", errorDetails:"🛑 Error: Your session has expired"});
          } else {
            openErrorAlert({errorDetails: '🛑 Error: ' + error.response.data.error});
          }}
      } else if (error.request) {
        console.error('🛑 Network error:', error.message);
        openErrorModal({errorTitle:"Error Editting Password", errorDetails:'🛑 Network error: ' + error.message});
      } else {
        console.error('🛑 Error:', error.message);
        openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
      }
  }
}

export async function removeCookies(openErrorAlert) {
  try {
    const response = await apiClient.post('/removecookies');
    console.log('Successfully removed cookies');
  } catch (error) {
    if (error.response) {
      console.error(error.response.data.error);
      openErrorAlert({errorDetails:error.response.data.error});
    } else if (error.request) {
      console.error("Server Error: " + error.message);
      openErrorAlert({errorDetails:"Server Error " + error.message});
    } else {
      console.error("Error: " + error.message);
      openErrorAlert({errorDetails:"Error: " + error.message});
    }
  }
}
  
