import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import './RegistrationPage.css'
import { addUser } from "../../utils/apiUtils.jsx";
import { useErrorAlert } from "../../hooks/useAlertStates.jsx"
import MainContent from "./MainContent.jsx";
import Footer from "./Footer.jsx";

const RegistrationPage = () => {


    const { showErrorAlert, hideErrorAlert, openErrorAlert, errorText } = useErrorAlert({isTimeout:true});

    const handleRegistration = ({username, password, checkPassword}) => {
        if (!username) {
            console.log('Email is required');
            openErrorAlert('⚠️ An email is required. Please enter a email to proceed.')
        }
        else if (!password) {
            console.log('Password is required');
            openErrorAlert('⚠️ A password is required. Please enter a password to proceed.')
        }
        else if (password != checkPassword) {
            console.log("passwords don't match");
            openErrorAlert("⚠️ Passwords don't match.")
        }
        else {
            addUser(username, password, openAccountAlreadyExistsAlert, openErrorAlert);
        }
    }

    return (
        <div className='d-flex flex-column min-vh-100'>
            <MainContent handleRegistration={handleRegistration}/>
            <Footer showErrorAlert={showErrorAlert} hideErrorAlert={hideErrorAlert} errorText={errorText}/>

        </div>
            
    )
}

export default RegistrationPage;