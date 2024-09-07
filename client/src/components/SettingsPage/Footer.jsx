import React from "react";
import { Button, Container } from "react-bootstrap";
import Alert from '../Alert.jsx'

const Footer = ({showEventAlert, hideEventAlert, eventText, showErrorAlert, hideErrorAlert, errorText}) => {
    return (
        <div className="d-flex justify-content-end pe-3 pb-3 align-items-end flex-grow-1">

        <Alert showAlert={showEventAlert} alertVariant={"success"} hideAlert={hideEventAlert}
        isDismissible={true} alertBody={<p>{eventText}</p>}/>

        <Alert showAlert={showErrorAlert} alertVariant={"danger"} hideAlert={hideErrorAlert}
        isDismissible={true} alertBody={<p>{errorText}</p>}/>
        </div>
       
    )
}

export default Footer;