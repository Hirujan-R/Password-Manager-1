import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import './RegistrationPage.css'
import { addUser, removeCookies } from "../../utils/apiUtils.jsx";
import { useErrorAlert, useEventAlert } from "../../hooks/useAlertStates.jsx"
import MainContent from "./MainContent.jsx";
import Footer from "./Footer.jsx";

const RegistrationPage = () => {


    const { showErrorAlert, hideErrorAlert, openErrorAlert, errorText } = useErrorAlert({isTimeout:true});

    const { showEventAlert, hideEventAlert, openEventAlert, eventText } = useEventAlert({isTimeout:true});


    useEffect(() => {
        removeCookies(openErrorAlert);
    }, []);
    

    return (
        <div className='d-flex flex-column min-vh-100'>
            <MainContent openErrorAlert={openErrorAlert} openEventAlert={openEventAlert}/>
            <Footer showErrorAlert={showErrorAlert} hideErrorAlert={hideErrorAlert} errorText={errorText}
                showEventAlert={showEventAlert} hideEventAlert={hideEventAlert} eventText={eventText}/>

        </div>
            
    )
}

export default RegistrationPage;