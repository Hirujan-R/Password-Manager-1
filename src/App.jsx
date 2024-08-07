import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import MainContent from './components/MainContent/MainContent.jsx';
import Header from './components/Header/Header.jsx';
import PASSWORDS from './Passwords.jsx';

const App = () => {

  // State managing passwords
  const [passwords, setPasswords] = useState(PASSWORDS);
  const [query, setQuery] = useState("");
    
  // Function for adding passwords
  function AddPassword({serviceName, password}) {
      const updatedPasswords = [...passwords, {index: passwords.length, name: serviceName, password: password }];
      setPasswords(updatedPasswords);
  }

  // Function for editting passwords
  function EditPassword({newServiceName, newPassword, passwordIndex}) {
    const updatedPasswords = passwords.map(password => 
      password.index == passwordIndex ? {...password, name: newServiceName, password: newPassword} : password
    );
    setPasswords(updatedPasswords);
  }

  // Function for deleting passwords
  function DeletePassword({passwordIndex}) {
    const updatedPasswords = passwords.filter(pasword => passwordIndex !== pasword.index);
    setPasswords(updatedPasswords);
  }

  const [showCopyTextAlert, setShowCopyTextAlert] = useState(false);
  const hideShowCopyTextAlert = () => setShowCopyTextAlert(false);
  const openShowCopyTextAlert = () => {
    setShowCopyTextAlert(true);
    setTimeout(() => {hideShowCopyTextAlert()}, 2000);  
  }
  


  return (
    <div className="App">
      <Header addPassword={AddPassword} setQuery={setQuery}/>
      <div>
        <MainContent passwords={passwords} editPassword={EditPassword} deletePassword={DeletePassword} 
        query={query} openShowCopyTextAlert={openShowCopyTextAlert}>
        </MainContent>
        {showCopyTextAlert && (
          <Alert variant='secondary' onClose={hideShowCopyTextAlert} dismissible>
            <Alert.Heading>Success!</Alert.Heading>
            <p>
                Password is copied to clipboard!
            </p>
          </Alert>
        )}
      </div>

    </div>
  );
};

export default App;
