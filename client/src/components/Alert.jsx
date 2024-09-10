import React from "react";
import { Alert as BootstrapAlert } from "react-bootstrap";
import './Alert.css';

export default function Alert({ showAlert, alertVariant, hideAlert, isDismissible, className="", 
    alertHeading, alertBody }) {

    const alertClassName = `alert alert-${alertVariant} ${className}`;
    return (
        showAlert && (
            <BootstrapAlert variant={alertVariant} onClose={hideAlert} dismissible={isDismissible} className={alertClassName}>
              <BootstrapAlert.Heading>{alertHeading}</BootstrapAlert.Heading>
              {alertBody}
            </BootstrapAlert>
        )
    );
}

