import React from "react";
import { useState } from "react";
import { Alert, Container } from "react-bootstrap";
import './Footer.css';

function Footer({showCopyTextAlert, hideShowCopyTextAlert}) {

  return (
    <Container fluid className="d-flex justify-content-end mt-auto">
      {showCopyTextAlert && (
        <Alert variant='secondary' onClose={hideShowCopyTextAlert} dismissible>
          <Alert.Heading>Success!</Alert.Heading>
          <p>
              Password is copied to clipboard!
          </p>
        </Alert>
      )}
    </Container>
  )
  
}

export default Footer;