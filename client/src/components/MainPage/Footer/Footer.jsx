import React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Alert from "../../Alert";


function Footer({ showEventAlert, hideEventAlert, eventText, showErrorAlert, hideErrorAlert, errorText }) {

  return (
    <Container fluid className="d-flex justify-content-end mt-auto">
      <Alert showAlert={showEventAlert} alertVariant={"success"} hideAlert={hideEventAlert} 
        isDismissible={true} alertBody={<p>{eventText}</p>}/>
      <Alert showAlert={showErrorAlert} alertVariant={"danger"} hideAlert={hideErrorAlert} 
        isDismissible={true} alertBody={<p>{errorText}</p>}/>
    </Container>
  )
  
}

export default Footer;