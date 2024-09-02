import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import PASSWORDS from '../../Passwords.jsx';
import { getPasswords, removeCookies } from '../../utils/apiUtils.jsx';
import { useEventAlert, useErrorAlert } from '../../hooks/useAlertStates.jsx';
import { useErrorRetrievingPasswordsModal } from '../../hooks/useModalStates.jsx';
import ErrorRetrievingPasswordsModal from './MainContent/ErrorRetrievingPasswordsModal.jsx';
import Header from './Header/Header.jsx';
import MainContent from './MainContent/MainContent.jsx';
import Footer from './Footer/Footer.jsx';

const MainPage = () => {

  // State managing passwords
  const [passwords, setPasswords] = useState([]);
  const [query, setQuery] = useState("");
    
  const { showEventAlert, hideEventAlert, openEventAlert, eventText } = useEventAlert({});

  const {showErrorAlert, hideErrorAlert, openErrorAlert, errorText} = useErrorAlert({isTimeout: true});

  const {showErrorRetrievingPasswordsModal, hideErrorRetrievingPasswordsModal, openErrorRetrievingPasswordsModal,
    showErrorRetrievingPasswordsText, setErrorRetrievingPasswordsText} = useErrorRetrievingPasswordsModal();


  useEffect(() => {
      const fetchPasswords = async () => {
      const returnMsg = await getPasswords(setPasswords);
      if (returnMsg != "Passwords retrieved" && returnMsg != "No Passwords") {
        setErrorRetrievingPasswordsText(returnMsg);
        openErrorRetrievingPasswordsModal();
      }
    }
    fetchPasswords();

  }, []);

  
  return (
    <div className="main-page d-flex flex-column min-vh-100">

      <div className='d-none d-md-flex justify-content-end p-md-3'>
        <Link to={"/"}>
          <Button onClick={removeCookies}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Button>
        </Link>
      </div>
      
      <Header setQuery={setQuery} setPasswords={setPasswords} passwords={passwords} openEventAlert={openEventAlert}/>
      <MainContent passwords={passwords} setPasswords={setPasswords} query={query} 
        openEventAlert={openEventAlert} openErrorAlert={openErrorAlert}/>
      <Footer showEventAlert={showEventAlert} hideEventAlert={hideEventAlert} eventText={eventText}
        showErrorAlert={showErrorAlert} hideErrorAlert={hideErrorAlert} errorText={errorText}/>

      <ErrorRetrievingPasswordsModal showErrorRetrievingPasswordsModal={showErrorRetrievingPasswordsModal} 
        hideErrorRetrievingPasswordsModal={hideErrorRetrievingPasswordsModal} 
        showErrorRetrievingPasswordsText={showErrorRetrievingPasswordsText}/>

    </div>
  );
};

export default MainPage;