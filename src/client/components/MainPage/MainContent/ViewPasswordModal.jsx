import React, { useState } from 'react';
import { Modal as BootstrapModal, Button, Container } from 'react-bootstrap';
import Modal from '../../../components/Modal.jsx';
import Alert from '../../../components/Alert.jsx';
import { useShowCopyTextAlert } from '../../../hooks/useMainPageAlerts.jsx';

function ViewPasswordModal({show, onHide, password, editPasswordFunction, deletePasswordFunction}) {

    const { showCopyTextAlert, hideShowCopyTextAlert, openShowCopyTextAlert } = useShowCopyTextAlert();


    function CopyPassword(password) {
        navigator.clipboard.writeText(password.password);
        openShowCopyTextAlert();
 
    }

    const modalTitle = (
        <BootstrapModal.Title>View Password</BootstrapModal.Title>
    )
    
    const bodyContent = (
        <div>
            <p>{password.password}</p>
            <Button variant='secondary' onClick={() => CopyPassword(password)}>Copy</Button>
            <Button variant='primary' onClick={editPasswordFunction}>Edit Password</Button>
            <Button variant='danger' onClick={deletePasswordFunction}>Remove</Button>
        </div>   
    )
    
    const footerContent = (
        <Container fluid>
            <Alert showAlert={showCopyTextAlert} alertVariant={'secondary'} hideAlert={hideShowCopyTextAlert} 
            isDismissible={false} alertHeading={"Success!"} alertBody={<p>Password is copied to clipboard!</p>}/>
        </Container>  
    )

    return (
        <Modal show={show} onHide={onHide} modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent}/>
      );
    
}

export default ViewPasswordModal;