import React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Alert from "../../Alert";


function Footer({ showEventAlert, hideEventAlert, eventText }) {

  return (
    <Container fluid className="d-flex justify-content-end mt-auto">
      <Alert showAlert={showEventAlert} alertVariant={"success"} hideAlert={hideEventAlert} 
        isDismissible={true} alertBody={<p>{eventText}</p>}/>
    </Container>
  )
  
}

export default Footer;