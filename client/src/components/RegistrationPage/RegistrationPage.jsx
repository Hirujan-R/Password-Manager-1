import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import './RegistrationPage.css'
import { addUser } from "../../utils/apiUtils.jsx";
import { usePasswordsDontMatchAlert, useGeneralErrorAlert } from "../../hooks/useRegistrationStates.jsx"
import MainContent from "./MainContent.jsx";
import Footer from "./Footer.jsx";

export const RegistrationPage = () => {


    // Alert that triggers if passwords don't match.
    const {showPasswordsDontMatchAlert, hidePasswordsDontMatchAlert, openPasswordsDontMatchAlert} = usePasswordsDontMatchAlert();


    const { showGeneralErrorAlert, hideGeneralErrorAlert, openGeneralErrorAlert, errorText } = useGeneralErrorAlert();

    const handleRegistration = ({username, password, checkPassword}) => {
        if (!username) {
            console.log('Email is required');
            openGeneralErrorAlert('Email is required.')
        }
        else if (!password) {
            console.log('Password is required');
            openGeneralErrorAlert('Password is required.')
        }
        else if (password != checkPassword) {
            console.log("passwords don't match");
            openGeneralErrorAlert("Passwords don't match.")
        }
        else {
            addUser(username, password, openAccountAlreadyExistsAlert, openGeneralErrorAlert);
        }
    }

    return (
        <div className='d-flex flex-column min-vh-100'>
            <MainContent handleRegistration={handleRegistration}/>
            <Footer showGeneralErrorAlert={showGeneralErrorAlert} hideGeneralErrorAlert={hideGeneralErrorAlert} errorText={errorText}
            />

        </div>
            
    )
}