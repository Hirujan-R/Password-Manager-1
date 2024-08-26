import React, { useState } from 'react';
import { Modal as BootstrapModal, Button, Container } from 'react-bootstrap';
import Modal from '../../Modal.jsx';
import Alert from '../../Alert.jsx';
import { useEventAlert } from '../../../hooks/useAlertStates.jsx';

function ViewPasswordModal({show, onHide, password, editPasswordFunction, deletePasswordFunction}) {

    const { showEventAlert, hideEventAlert, openEventAlert, eventText } = useEventAlert({});

    function CopyPassword(password) {
        navigator.clipboard.writeText(password.password);
        openEventAlert("Password is copied to clipboard!");
 
    }

    const modalTitle = (
        <BootstrapModal.Title>View Password</BootstrapModal.Title>
    )
    
    const bodyContent = (
        <div>
            <p>{password.password_encrypted}</p>
            <Button variant='secondary' onClick={() => CopyPassword(password)}>Copy</Button>
            <Button variant='primary' onClick={editPasswordFunction}>Edit Password</Button>
            <Button variant='danger' onClick={deletePasswordFunction}>Remove</Button>
        </div>   
    )
    
    const footerContent = (
        <Container fluid>
            <Alert showAlert={showEventAlert} alertVariant={'secondary'} hideAlert={hideEventAlert} 
            isDismissible={false} alertHeading={"Success!"} alertBody={<p>{eventText}</p>}/>
        </Container>  
    )

    return (
        <Modal show={show} onHide={onHide} modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent}/>
      );
    
}

export default ViewPasswordModal;