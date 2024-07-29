import React from 'react';
import { Modal, Button } from 'react-bootstrap';



function ChangePasswordModal({ show, handleClose, handleSaveChanges }) {


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Service Name: <input id='serviceInput'></input></p>
        <p>Password: <input id='passwordInput'></input> <button>Randomise</button></p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={()=>handleSaveChanges({
          serviceName: document.getElementById('serviceInput').value, 
          password: document.getElementById('passwordInput').value,
        })}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;