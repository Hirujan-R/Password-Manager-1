import React, { useEffect, useState } from "react";
import MainContent from "./MainContent.jsx";
import Footer from "./Footer.jsx";
import { useErrorAlert } from "../../hooks/useAlertStates.jsx";
import { removeCookies } from "../../utils/apiUtils.jsx";

const LoginPage = () => {

    const { showErrorAlert, hideErrorAlert, openErrorAlert, errorText } = useErrorAlert({isTimeout:true});
    
    useEffect(() => {
        // Remove cookies to make sure user can't go back and forth between login screen and account menu
        removeCookies(openErrorAlert);
    }, []);
    

    return (
        <div className='d-flex flex-column min-vh-100'>
            <MainContent openErrorAlert={openErrorAlert}/>
            <Footer showErrorAlert={showErrorAlert} hideErrorAlert={hideErrorAlert} errorText={errorText}/>
        </div>
            
    )     
    
}

export default LoginPage;