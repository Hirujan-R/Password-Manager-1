import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './LoginPage.css'
import { Input } from "../Input.jsx";
import MainContent from "./MainContent.jsx";
import Footer from "./Footer.jsx";
import { useErrorAlert } from "../../hooks/useAlertStates.jsx";
import { login, removeCookies } from "../../utils/apiUtils.jsx";

const LoginPage = () => {

    const { showErrorAlert, hideErrorAlert, openErrorAlert, errorText } = useErrorAlert({isTimeout:true});
    const navigate = useNavigate();

    removeCookies(openErrorAlert);

    const handleLogin = async ({ username, password }) => {
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
            if ( await login(username, password, openErrorAlert) === true ) {
                navigate('/main');
            }
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