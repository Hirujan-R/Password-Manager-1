import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Header from './Header/Header.jsx';
import MainContent from './MainContent/MainContent.jsx';
import Footer from './Footer/Footer.jsx';
import PASSWORDS from '../../Passwords.jsx';
import useShowCopyTextAlert from '../../hooks/useShowCopyTextAlert.jsx';

const MainPage = () => {

  // State managing passwords
  const [passwords, setPasswords] = useState(PASSWORDS);
  const [query, setQuery] = useState("");
    

  const { showCopyTextAlert, hideShowCopyTextAlert, openShowCopyTextAlert } = useShowCopyTextAlert();
  
  return (
    <div className="main-page d-flex flex-column min-vh-100">
      <div className='d-none d-md-flex justify-content-end p-md-3'>
        <Button>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </Button>
      </div>
      <Header setQuery={setQuery} setPasswords={setPasswords} passwords={passwords}/>
      <MainContent passwords={passwords} setPasswords={setPasswords}  
        query={query} openShowCopyTextAlert={openShowCopyTextAlert}>
      </MainContent>
      <Footer showCopyTextAlert={showCopyTextAlert} hideShowCopyTextAlert={hideShowCopyTextAlert}/>
    </div>
  );
};

export default MainPage;