import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import Modal from '../Modal.jsx';

function ViewPasswordModal({show, onHide, password, editPasswordFunction, deletePasswordFunction}) {

    function CopyPassword(password) {
        navigator.clipboard.writeText(password.password);
        alert('Password copied to clipboard!');
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
        <div></div>  
    )

    return (
        <Modal show={show} onHide={onHide} modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent}></Modal>
      );
    
}

export default ViewPasswordModal;