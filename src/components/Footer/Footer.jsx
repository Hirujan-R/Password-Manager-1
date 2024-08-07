import React from "react";
import { useState } from "react";
import { Alert } from "react-bootstrap";

function Footer({showCopyTextAlert, hideShowCopyTextAlert}) {

  return (
    <div>
      {showCopyTextAlert && (
        <Alert variant='secondary' onClose={hideShowCopyTextAlert} dismissible>
          <Alert.Heading>Success!</Alert.Heading>
          <p>
              Password is copied to clipboard!
          </p>
        </Alert>
      )}
    </div>
  )
  
}

export default Footer;