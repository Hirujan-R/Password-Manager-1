import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import MainContent from './components/MainContent/MainContent.jsx';
import Header from './components/Header/Header.jsx';
import PASSWORDS from './Passwords.jsx';

const App = () => {


  const [passwords, setPasswords] = useState(PASSWORDS);
  const [query, setQuery] = useState("");
    
    function AddPassword({serviceName, password}) {
        const updatedPasswords = [...passwords, {index: passwords.length, name: serviceName, password: password }];
        setPasswords(updatedPasswords);
    }

    function EditPassword({newServiceName, newPassword, passwordIndex}) {
      const updatedPasswords = passwords.map(password => 
        password.index == passwordIndex ? {...password, name: newServiceName, password: newPassword} : password
      );
      setPasswords(updatedPasswords);
    }

    function DeletePassword({passwordIndex}) {
      const updatedPasswords = passwords.filter(pasword => passwordIndex !== pasword.index);
      setPasswords(updatedPasswords);
    }

  return (
    <div className="App">
      <Header addPassword={AddPassword} setQuery={setQuery}/>
      <div>
        <MainContent passwords={passwords} editPassword={EditPassword} deletePassword={DeletePassword} query={query}></MainContent>
      </div>

    </div>
  );
};

export default App;
