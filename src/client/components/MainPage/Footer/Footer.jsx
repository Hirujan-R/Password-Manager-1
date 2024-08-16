import React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Alert from "../../Alert";


function Footer({ showPasswordCreatedAlert, hidePasswordCreatedAlert, showPasswordEdittedAlert, hidePasswordEdittedAlert, 
  showPasswordDeletedAlert, hidePasswordDeletedAlert }) {

  return (
    <Container fluid className="d-flex justify-content-end mt-auto">
      <Alert showAlert={showPasswordCreatedAlert} alertVariant={"success"} hideAlert={hidePasswordCreatedAlert} 
        isDismissible={true} alertBody={<p>Password successfully created!</p>}/>
      <Alert showAlert={showPasswordEdittedAlert} alertVariant={"success"} hideAlert={hidePasswordEdittedAlert} 
        isDismissible={true} alertBody={<p>Password successfully editted!</p>}/>
      <Alert showAlert={showPasswordDeletedAlert} alertVariant={"success"} hideAlert={hidePasswordDeletedAlert} 
        isDismissible={true} alertBody={<p>Password successfully deleted!</p>}/>
    </Container>
  )
  
}

export default Footer;