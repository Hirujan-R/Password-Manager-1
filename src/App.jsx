import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import Header from './components/Header/Header.jsx';
import MainContent from './components/MainContent/MainContent.jsx';
import Footer from './components/Footer/Footer.jsx';
import PASSWORDS from './Passwords.jsx';
import useShowCopyTextAlert from './hooks/useShowCopyTextAlert.jsx';

const App = () => {

  // State managing passwords
  const [passwords, setPasswords] = useState(PASSWORDS);
  const [query, setQuery] = useState("");
    

  const { showCopyTextAlert, hideShowCopyTextAlert, openShowCopyTextAlert } = useShowCopyTextAlert();
  
  return (
    <div className="App">
      <Header setQuery={setQuery} setPasswords={setPasswords} passwords={passwords}/>
      <MainContent passwords={passwords} setPasswords={setPasswords}  
        query={query} openShowCopyTextAlert={openShowCopyTextAlert}>
      </MainContent>
      <Footer showCopyTextAlert={showCopyTextAlert} hideShowCopyTextAlert={hideShowCopyTextAlert}/>

    </div>
  );
};

export default App;
