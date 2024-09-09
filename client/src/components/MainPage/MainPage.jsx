import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import { getPasswords, removeCookies } from '../../utils/apiUtils.jsx';
import { useEventAlert, useErrorAlert } from '../../hooks/useAlertStates.jsx';
import { useErrorModal } from '../../hooks/useModalStates.jsx';
import ErrorModal from '../ErrorModal.jsx';
import Header from './Header/Header.jsx';
import MainContent from './MainContent/MainContent.jsx';
import Footer from './Footer/Footer.jsx';

const MainPage = () => {

  // State managing passwords
  const [passwords, setPasswords] = useState([]);
  const [query, setQuery] = useState("");
    
  const { showEventAlert, hideEventAlert, openEventAlert, eventText } = useEventAlert({});

  const {showErrorAlert, hideErrorAlert, openErrorAlert, errorText} = useErrorAlert({isTimeout: true});

  const {showErrorModal, hideErrorModal, openErrorModal, showErrorTitle, showErrorText} = useErrorModal();



  useEffect(() => {
      const fetchPasswords = async () => { 
        await getPasswords({setPasswords, openErrorAlert, openErrorModal});
    }
    fetchPasswords();

  }, []);

  
  return (
    <div className="main-page d-flex flex-column min-vh-100">

      <div className='d-none d-md-flex justify-content-end p-md-3'>
        <Button className='me-2'>
          <FontAwesomeIcon icon={faGear} />
        </Button>
        <Link to={"/"}>
          <Button onClick={removeCookies}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Button>
        </Link>
      </div>
      
      <Header setQuery={setQuery} setPasswords={setPasswords} openEventAlert={openEventAlert} mainOpenErrorAlert={openErrorAlert} openErrorModal={openErrorModal}/>
      <MainContent passwords={passwords} setPasswords={setPasswords} query={query} 
        openEventAlert={openEventAlert} openErrorAlert={openErrorAlert} openErrorModal={openErrorModal}/>
      <Footer showEventAlert={showEventAlert} hideEventAlert={hideEventAlert} eventText={eventText}
        showErrorAlert={showErrorAlert} hideErrorAlert={hideErrorAlert} errorText={errorText}/>

      <ErrorModal showErrorModal={showErrorModal} hideErrorModal={hideErrorModal} showErrorText={showErrorText} showErrorTitle={showErrorTitle}/>

    </div>
  );
};

export default MainPage;