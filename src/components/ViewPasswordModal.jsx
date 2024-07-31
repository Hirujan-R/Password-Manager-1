import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import Modal from './Modal.jsx';

function ViewPasswordModal({show, onHide, password, editPasswordFunction}) {

    function CopyPassword(password) {
        navigator.clipboard.writeText(password);
        alert('Password copied to clipboard!');
    }

    const modalTitle = (
        <BootstrapModal.Title>View Password</BootstrapModal.Title>
    )
    
    const bodyContent = (
        <div>
            <p>{password.password}</p>
            <button onClick={() => CopyPassword(password.password)}>Copy</button>
            <button onClick={editPasswordFunction}>Edit Password</button>
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