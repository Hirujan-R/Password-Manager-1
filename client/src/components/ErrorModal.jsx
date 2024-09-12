import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './ErrorModal.css';

const ErrorModal = ({showErrorModal, 
    hideErrorModal, showErrorText, showErrorTitle}) => {

    const navigate = useNavigate();

    const modalTitle = (
        <p>{showErrorTitle}</p>
    );

    const bodyContent = (
        <Container className='d-flex flex-column'>
            <Row>
                <Col xs={12} className='pe-0 pt-1 me-1'>
                <p>{showErrorText}. You will be redirected to the login page.</p>
                </Col>
            </Row>
        </Container>
    )

    const footerContent = (
        <Container fluid>
        <div className='d-flex justify-content-end'>
          <Button className="primary-button" onClick={() => navigate('/')}>
            Go to Login Page
          </Button>
        </div>
        </Container>
      
    )

    return <Modal show={showErrorModal} onHide={hideErrorModal} 
    modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent} 
    titleClassName='w-100 text-center' isCloseButton={false} backdrop={"static"} keyboard={false} />
}

export default ErrorModal;