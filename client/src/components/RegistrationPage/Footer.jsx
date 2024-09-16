import React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Alert from "../Alert.jsx";

export default function Footer({ showErrorAlert, hideErrorAlert, errorText, showEventAlert, hideEventAlert, eventText }) {
  return (
    <Container fluid className="d-flex justify-content-end position-fixed bottom-0 pe-3 pb-1">
      {/*Error alert at bottom of screen*/}
      <Alert showAlert={showErrorAlert} alertVariant={"danger"} hideAlert={hideErrorAlert} 
        isDismissible={true} alertBody={<p>{errorText}</p>}/>
      {/*Event alert at bottom of screen*/}  
      <Alert showAlert={showEventAlert} alertVariant={"success"} hideAlert={hideEventAlert} 
        isDismissible={true} alertBody={<p>{eventText}</p>}/>
      
    </Container>
  )
}