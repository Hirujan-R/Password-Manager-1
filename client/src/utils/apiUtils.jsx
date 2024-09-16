import axios from 'axios';

// Simplifies process of communicating with server
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    timeout: 5000,
    withCredentials: true
})

// function for registering a new user
export async function addUser({email, password, openErrorAlert, openEventAlert}) {
  try { 
    // Make a POST request containing email and password of new user
    const response = await apiClient.post('/registration', {
      email: email,
      password: password
    });
    console.log(`User registered successfully! User ID is ${response.data.user_id}`);
    openEventAlert({eventDetails:'User registered successfully!'});
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      console.error('Server error:', error.response.data.error);
      if (error.response.data.error === "User with this email already exists") {
        // User already exists
        openErrorAlert({errorDetails:'🛑 User Error: ' + error.response.data.error});
      }
      else {
        openErrorAlert({errorDetails:'🛑 Error: ' + error.response.data.error});
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

// function for verifying login details 
export async function login({email, password, openErrorAlert}) {
  try {
    // Make a POST request containing email and password of user trying to login
    const response  = await apiClient.post(`/login`,{
      email: email, password: password
    });
    console.log(`User successfully logged in!`);
    return true;
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      console.error('Server error:', error.response.data.error);
      if (error.response.data.error === 'Incorrect username or password' ) {
        // Incorrect details
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

// function for retrieving passwords of user 
export async function getPasswords({setPasswords, openErrorAlert, openErrorModal}) {
  try {
    // Make a GET request
    const response = await apiClient.get(`/getpasswords`);
    if (response.data.message != "No Passwords") {
      if (Array.isArray(response.data.passwords) && response.data.passwords.length > 0) {
        setPasswords(response.data.passwords);
      }
    } else {
      // User has no passwords stored
      setPasswords([]);
    }
    
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      if (error.response.status === 500) {
        console.error("Database Error:", error.response.data.error);
        openErrorModal({errorTitle:"Error Retrieving Passwords", errorDetails:"🛑 Error: Failure to connect to database"});
      } else if (error.response.status === 400) {
        // Cookies expired
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

// function for creating service password  
export async function createPassword({serviceName, password, setPasswords, openEventAlert, openErrorAlert, openErrorModal}) {
  try {
    // Make a POST request containing service name and password of service password you want to create
    const response = await apiClient.post('/createpassword', {
      service_name: serviceName,
      password: password
    })
    // Call getPasswords to change value of passwords
    await getPasswords({setPasswords, openErrorAlert, openErrorModal});
    openEventAlert({eventDetails:"Password successfully created"});
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      if (error.response.status === 500) {
        console.error("Database Error:", error.response.data.error);
        openErrorModal({errorTitle: "Error Adding Password", errorDetails:"🛑 Error: Failure to connect to database"});
      } else if (error.response.status === 400) {
        console.error({errorDetails:"User error: " + error.response.data.error});
        if (error.response.data.error === "Unauthorised") {
          // Cookies expired
          openErrorModal({errorTitle: "Error Adding Password", errorDetails:"🛑 Error: Your session has expired"});
        } else {
          openErrorModal({errorTitle: "Error Adding Password", errorDetails:"🛑 Error: " + error.response.data.error});
        }}
    } else if (error.request) {
      // No response from server
      console.error('🛑 Network error:', error.message);
      openErrorModal({errorTitle: "Error Adding Password", errorDetails:'🛑 Network error: ' + error.message});
    } else {
      // All other responses
      console.error('🛑 Error:', error.message);
      openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
    }
  }
}

// function for editting service password  
export async function editPassword({newServiceName, newPassword, passwordID, setPasswords, openEventAlert, openErrorAlert, openErrorModal}) {
  try {
    // Make a PUT request containing password id, service name and password of service password you want to edit
    const response = await apiClient.put('/updatepassword', {
      password_id: passwordID,
      service_name: newServiceName, 
      password: newPassword
    })
    // Call getPasswords to change value of passwords
    await getPasswords({setPasswords, openErrorAlert, openErrorModal});
    openEventAlert({eventDetails:"Password has been successfully updated"});
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      if (error.response.status === 500) {
        console.error("Database Error:", error.response.data.error);
        openErrorModal({errorTitle:"Error Editting Password", errorDetails:"🛑 Error: Failure to connect to database"});
      } else if (error.response.status === 400) {
        console.error("User error: " + error.response.data.error);
        if (error.response.data.error === "Unauthorised") {
          // Cookies expired
          openErrorModal({errorTitle:"Error Editting Password", errorDetails:"🛑 Error: Your session has expired"});
        } else {
          openErrorAlert({errorDetails: '🛑 Error: ' + error.response.data.error});
        }}
    } else if (error.request) {
      // No response from server
      console.error('🛑 Network error:', error.message);
      openErrorModal({errorTitle:"Error Editting Password", errorDetails:'🛑 Network error: ' + error.message});
    } else {
      // All other errors
      console.error('🛑 Error:', error.message);
      openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
    }
  }
}

// function for deleting service password  
export async function deletePassword({passwordID, openEventAlert, openErrorAlert, setPasswords, openErrorModal}) {
  try {
    // Make a DELETE request containing password id of service password you want to delete
    const response = await apiClient.delete(`/deletepassword/${passwordID}`)
    console.log('Password successfully deleted.');
    // Call getPasswords to change value of passwords
    await getPasswords({setPasswords, openErrorAlert, openErrorModal});
    openEventAlert({eventDetails:'Password successfully deleted'});

  } catch (error) {
    if (error.response) {
      // Server responded with error code
      if (error.response.status === 500) {
        console.error('🛑 Database Error: ' + error.response.data.details);
        openErrorModal({errorTitle:'Error Deleting Password', errorDetails:'🛑 Database Error: ' + error.response.data.details});
      } else if (error.response.status === 400) {
        console.error('🛑 User Error: ' + error.response.data.error);
        if (error.response.data.error === "Unauthorised") {
          // Cookies expired
          openErrorModal({errorTitle:'Error Deleting Password', errorDetails:'🛑 Error: Your session has expired'});
        } else {openErrorAlert({errorDetails:'🛑 Error: ' + error.response.data.error});}
      }
    } else if (error.request) {
      // No response from server
      console.error('🛑 Network Error: ' + error.message);
      openErrorModal({errorTitle:'Error Deleting Password', errorDetails:'🛑 Network Error: ' + error.message});
    } else {
      // All other errors
      console.log('Error: ' + error.message);
      openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
    }
  }
  
}


// function for retrieving email of user  
export async function getEmail({openErrorAlert, openErrorModal}) {
  try {
    // Make a GET request 
    const response = await apiClient.get('/getemail');
    console.log('Email successfully retrieved');
    return response.data.email;
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      if (error.response.status === 500) {
        console.error('Database Error: ' + error.response.data.error);
        openErrorModal({errorTitle:'Error Retrieving Email', errorDetails:'🛑 Database Error: ' + error.response.data.error});
      } else if (error.response.status === 400) {
        console.error('User Error: ' + error.response.data.error);
        if (error.response.data.error === "Unauthorised") {
          // Invalid cookies
          openErrorModal({errorTitle:'Error Retrieving Email', errorDetails:'🛑 Error: Your session has expired'});
        } else {openErrorAlert({errorDetails:'🛑 Error: ' + error.response.data.error});}
      }
    } else if (error.request) {
      // No response from server
      console.error('Server Error: ' + error.message);
      openErrorModal({errorTitle:'Error Retrieving Email', errorDetails:'🛑 Server Error: ' + error.message});
    } else {
      // All other errors
      console.error('Error: ' + error.message);
      openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
    }
  }
  
}

// function for editting email of user 
export async function editEmail({newEmail, openErrorAlert, openEventAlert, openErrorModal, setEmail}) {
  try {
    // Make a PUT request containing the new email of the user
    const response = await apiClient.put('/updateemail', {
      newEmail: newEmail
    });
    console.log('Email successfully updated');
    openEventAlert({eventDetails: 'Email successfully updated'});
    setEmail(newEmail);
  } catch (error) {
      if (error.response) {
        // Server responded with error code
        if (error.response.status === 500) {
          console.error("Database Error:", error.response.data.error);
          openErrorModal({errorTitle:"Error Editting Email", errorDetails:"🛑 Error: Failure to connect to database"});
        } else if (error.response.status === 400) {
          console.error("User error: " + error.response.data.error);
          if (error.response.data.error === "Unauthorised") {
            // Invalid cookies
            openErrorModal({errorTitle:"Error Editting Email", errorDetails:"🛑 Error: Your session has expired"});
          } else {
            openErrorAlert({errorDetails: '🛑 Error: ' + error.response.data.error});
          }}
      } else if (error.request) {
        // No response from server
        console.error('🛑 Network error:', error.message);
        openErrorModal({errorTitle:"Error Editting Email", errorDetails:'🛑 Network error: ' + error.message});
      } else {
        // All other errors
        console.error('🛑 Error:', error.message);
        openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
      }
  }
}

// function for editting user password
export async function editUserPassword({oldPassword, newPassword, openErrorAlert, openEventAlert, openErrorModal}) {
  try {
    // Make a PUT request containing old and new passwords of user
    const response = await apiClient.put('/updateuserpassword', {
      oldPassword: oldPassword, 
      newPassword: newPassword
    });
    console.log('User Password successfully updated');
    openEventAlert({eventDetails:'User Password successfully updated'});
  } catch (error) {
      if (error.response) {
        // Server responded with error code
        if (error.response.status === 500) {
          console.error("Database Error:", error.response.data.error);
          openErrorModal({errorTitle:"Error Editting Password", errorDetails:"🛑 Error: Failure to connect to database"});
        } else if (error.response.status === 400) {
          console.error("User error: " + error.response.data.error);
          if (error.response.data.error === "Unauthorised") {
            // Invalid cookies
            openErrorModal({errorTitle:"Error Editting Password", errorDetails:"🛑 Error: Your session has expired"});
          } else {
            openErrorAlert({errorDetails: '🛑 Error: ' + error.response.data.error});
          }}
      } else if (error.request) {
        // No response from server
        console.error('🛑 Network error:', error.message);
        openErrorModal({errorTitle:"Error Editting Password", errorDetails:'🛑 Network error: ' + error.message});
      } else {
        // All other errors
        console.error('🛑 Error:', error.message);
        openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
      }
  }
}


// function for deleting user  
export async function deleteUser({openErrorAlert, openErrorModal}) {
  try {
    // Make a DELETE request 
    const response = await apiClient.delete('/deleteuser');
    console.log('User account succesfully deleted');
    // use ErrorModal to redirect user to login page
    openErrorModal({errorTitle: 'Account Successfully Deleted', 
      errorDetails:'Account successfully deleted'});
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      if (error.response.status === 500) {
        console.error('🛑 Error: ' + error.response.data.details);
        openErrorModal({errorTitle:'Error Deleting Account', errorDetails:'🛑 Error: ' + error.response.data.details});
      } else if (error.response.status === 400) {
        console.error('🛑 User Error: ' + error.response.data.error);
        if (error.response.data.error === "Unauthorised") {
          // Invalid cookies
          openErrorModal({errorTitle:'Error Deleting Account', errorDetails:'🛑 Error: Your session has expired'});
        } else {openErrorAlert({errorDetails:'🛑 Error: ' + error.response.data.error});}
      }
    } else if (error.request) {
      // No response from server
      console.error('🛑 Network Error: ' + error.message);
      openErrorModal({errorTitle:'Error Deleting Password', errorDetails:'🛑 Network Error: ' + error.message});
    } else {
      // All other errors
      console.log('Error: ' + error.message);
      openErrorAlert({errorDetails:'🛑 Error: ' + error.message});
    }
  }
}

// function for removing cookies  
export async function removeCookies(openErrorAlert) {
  try {
    // Make a POST request
    const response = await apiClient.post('/removecookies');
    console.log('Successfully removed cookies');
  } catch (error) {
    if (error.response) {
      // Server responded with error code
      console.error(error.response.data.error);
      openErrorAlert({errorDetails:error.response.data.error});
    } else if (error.request) {
      // No response from server
      console.error("Server Error: " + error.message);
      openErrorAlert({errorDetails:"Server Error " + error.message});
    } else {
      // All other errors
      console.error("Error: " + error.message);
      openErrorAlert({errorDetails:"Error: " + error.message});
    }
  }
}
  
