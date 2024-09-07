import React from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import {useEventAlert, useErrorAlert} from '../../hooks/useAlertStates'


export const SettingsPage = () => {

    const { showEventAlert, hideEventAlert, openEventAlert, eventText } = useEventAlert({isTimeout:true});
    const { showErrorAlert, hideErrorAlert, openErrorAlert, errorText } = useErrorAlert({isTimeout:true});

    return (
        <div className='min-vh-100 d-flex flex-column'>
            <Header />
            <MainContent />
            <Footer showEventAlert={showEventAlert} hideEventAlert={hideEventAlert} eventText={eventText} 
                showErrorAlert={showErrorAlert} hideErrorAlert={hideErrorAlert} errorText={errorText}/>
        </div>
    )
};

export default SettingsPage;