import React from "react";
import { Alert as BootstrapAlert } from "react-bootstrap";

export default function Alert({ showAlert, alertVariant, hideAlert, isDismissible, className="", alertHeading, alertBody }) {
    return (
        showAlert && (
            <BootstrapAlert variant={alertVariant} onClose={hideAlert} dismissible={isDismissible} className={className}>
              <BootstrapAlert.Heading>{alertHeading}</BootstrapAlert.Heading>
              {alertBody}
            </BootstrapAlert>
        )
    );
}

