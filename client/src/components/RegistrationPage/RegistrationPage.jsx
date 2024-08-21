import React, { useState } from "react";
import './RegistrationPage.css'
import { addUser } from "../../utils/apiUtils.jsx";
import Alert from "../Alert.jsx";
import { useEmptyUsernameAlert, useEmptyPasswordAlert } from "../../hooks/usePasswordRowStates.jsx";
import MainContent from "./MainContent.jsx";

export const RegistrationPage = () => {

    // Alert that triggers if there no value in the username field.
    const {showEmptyUsernameAlert, hideEmptyUsernameAlert, openEmptyUsernameAlert} = useEmptyUsernameAlert();

    // Alert that triggers if there no value in the password field.
    const {showEmptyPasswordAlert, hideEmptyPasswordAlert, openEmptyPasswordAlert} = useEmptyPasswordAlert();

    

    const handleRegistration = ({username, password, checkPassword}) => {
        if (!username || !password) {
            console.log('Email and password are required');
        }
        else if (password != checkPassword) {
            console.log("passwords don't match");
        }
        else {
            addUser(username, password);
        }
    }

    return (
        <div>
            <MainContent handleRegistration={handleRegistration}/>

        </div>
            
    )
}