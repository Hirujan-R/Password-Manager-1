import React from "react";
import { Alert as BootstrapAlert } from "react-bootstrap";

function Alert({ showAlert, alertVariant, hideAlert, isDismissible, alertHeading, alertBody }) {
    return (
        showAlert && (
            <BootstrapAlert variant={alertVariant} onClose={hideAlert} dismissible={isDismissible}>
              <BootstrapAlert.Heading>{alertHeading}</BootstrapAlert.Heading>
              {alertBody}
            </BootstrapAlert>
        )
    );
}

export default Alert;