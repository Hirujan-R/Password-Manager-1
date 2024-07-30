import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import { Modal } from './Modal.jsx';



function ChangePasswordModal({ show, onHide, handleSaveChanges}) {

  const modalTitle = (
    <BootstrapModal.Title>Change Password</BootstrapModal.Title>
  )

  const bodyContent = (
    <div>
      <p>Service Name: <input id='serviceInput'></input></p>
      <p>Password: <input id='passwordInput'></input> <button>Randomise</button></p>
    </div>
  )

  const footerContent = (
    <div>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={()=>handleSaveChanges({
        serviceName: document.getElementById('serviceInput').value, 
        password: document.getElementById('passwordInput').value,
      })}>
        Save Changes
      </Button>
    </div>
    
  )


  return (
    <Modal show={show} onHide={onHide} modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent}></Modal>
  );
};

export default ChangePasswordModal;