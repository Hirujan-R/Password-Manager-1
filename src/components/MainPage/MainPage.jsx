import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Header from './Header/Header.jsx';
import MainContent from './MainContent/MainContent.jsx';
import Footer from './Footer/Footer.jsx';
import { usePasswordCreatedAlert, usePasswordEdittedAlert, usePasswordDeletedAlert } from '../../hooks/useMainPageAlerts.jsx';
import PASSWORDS from '../../Passwords.jsx';

const MainPage = () => {

  // State managing passwords
  const [passwords, setPasswords] = useState(PASSWORDS);
  const [query, setQuery] = useState("");
    
  const { showPasswordCreatedAlert, hidePasswordCreatedAlert, openPasswordCreatedAlert } = usePasswordCreatedAlert();
  const { showPasswordEdittedAlert, hidePasswordEdittedAlert, openPasswordEdittedAlert } = usePasswordEdittedAlert();
  const { showPasswordDeletedAlert, hidePasswordDeletedAlert, openPasswordDeletedAlert } = usePasswordDeletedAlert();
  
  return (
    <div className="main-page d-flex flex-column min-vh-100">

      <div className='d-none d-md-flex justify-content-end p-md-3'>
        <Button>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </Button>
      </div>
      <Header setQuery={setQuery} setPasswords={setPasswords} passwords={passwords} 
      openPasswordCreatedAlert={openPasswordCreatedAlert}/>

      <MainContent passwords={passwords} setPasswords={setPasswords} query={query} 
      openPasswordEdittedAlert={openPasswordEdittedAlert} openPasswordDeletedAlert={openPasswordDeletedAlert}/>

      <Footer showPasswordCreatedAlert={showPasswordCreatedAlert} hidePasswordCreatedAlert={hidePasswordCreatedAlert}
        showPasswordEdittedAlert={showPasswordEdittedAlert} hidePasswordEdittedAlert={hidePasswordEdittedAlert}
        showPasswordDeletedAlert={showPasswordDeletedAlert} hidePasswordDeletedAlert={hidePasswordDeletedAlert}/>
    </div>
  );
};

export default MainPage;