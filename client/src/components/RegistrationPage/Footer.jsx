import React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Alert from "../Alert.jsx";

export default function Footer({showGeneralErrorAlert, hideGeneralErrorAlert, errorText }) {
  console.log("Footer is rendering");
  return (
    <Container fluid className="d-flex justify-content-end position-fixed bottom-0 p-3">
      <Alert showAlert={showGeneralErrorAlert} alertVariant={"danger"} hideAlert={hideGeneralErrorAlert} 
        isDismissible={true} alertBody={<p>{errorText}</p>}/>
      {/* <Alert showAlert={showPasswordDeletedAlert} alertVariant={"success"} hideAlert={hidePasswordDeletedAlert} 
        isDismissible={true} alertBody={<p>Account successfully created!</p>}/> */}
    </Container>
  )
}