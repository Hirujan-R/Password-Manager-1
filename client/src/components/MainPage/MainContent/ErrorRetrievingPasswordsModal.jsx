import React, { useState } from "react";
import Modal from "../../Modal";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ErrorRetrievingPasswordsModal = ({showErrorRetrievingPasswordsModal, 
    hideErrorRetrievingPasswordsModal, showErrorRetrievingPasswordsText}) => {

    const navigate = useNavigate();

    const modalTitle = (
        "Error Retrieving Passwords"
    );

    const bodyContent = (
        <Container className='d-flex flex-column'>
            <Row>
                <Col xs={12} className='pe-0 pt-1 me-1'>
                <p>{showErrorRetrievingPasswordsText}. You will be redirected to the login page.</p>
                </Col>
            </Row>
        </Container>
    )

    const footerContent = (
        <Container fluid>
        <div className='d-flex justify-content-end'>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Go to Login Page
          </Button>
        </div>
        </Container>
      
    )

    return <Modal show={showErrorRetrievingPasswordsModal} onHide={hideErrorRetrievingPasswordsModal} 
    modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent} 
    titleClassName='w-100 text-center' isCloseButton={false} backdrop={"static"} keyboard={false} />
}

export default ErrorRetrievingPasswordsModal;