import React from "react";
import { Button, Container } from "react-bootstrap";
import Alert from '../Alert.jsx'

const Footer = ({showEventAlert, hideEventAlert, eventText, showErrorAlert, hideErrorAlert, errorText}) => {
    return (
        <div className="d-flex justify-content-end pe-3 pt-3 flex-grow-1 align-items-end">

        <Alert className="mx-1 w-auto" showAlert={showEventAlert} alertVariant={"success"} hideAlert={hideEventAlert}
        isDismissible={true} alertBody={<p>{eventText}</p>}/>

        <Alert className="mx-1 w-auto" showAlert={showErrorAlert} alertVariant={"danger"} hideAlert={hideErrorAlert}
        isDismissible={true} alertBody={<p>{errorText}</p>}/>
        </div>
       
    )
}

export default Footer;