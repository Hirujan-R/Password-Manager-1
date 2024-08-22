import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Nav } from "react-bootstrap";
import './LoginPage.css'
import { Input } from "../Input.jsx";
import MainContent from "./MainContent.jsx";
import Footer from "./Footer.jsx";
import { useErrorAlert } from "../../hooks/useAlertStates.jsx";

const LoginPage = () => {

    const { showErrorAlert, hideErrorAlert, openErrorAlert, errorText } = useErrorAlert({isTimeout:true});

    const handleLogin = ({username, password}) => {
        console.log(username);
        console.log(password);
        if (!username) {
            console.log('Email is required');
            openErrorAlert('⚠️ An email is required. Please enter a email to proceed.')
        }
        else if (!password) {
            console.log('Password is required');
            openErrorAlert('⚠️ A password is required. Please enter a password to proceed.')
        }
        else {
            console.log("Try to login");
        }
    }

    return (
        <div className='d-flex flex-column min-vh-100'>
            <MainContent handleLogin={handleLogin}/>
            <Footer showErrorAlert={showErrorAlert} hideErrorAlert={hideErrorAlert} errorText={errorText}/>
        </div>
            
    )     
    
}

export default LoginPage;