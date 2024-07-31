import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from '../Modal.jsx';



function EditPasswordModal({ show, onHide, handleSaveChanges}) {

  const modalTitle = (
    "Change Password"
  ) 

  const bodyContent = (
    <div>
      <p>Service Name: <input id='serviceInput'></input></p>
      <p>Password: <input id='passwordInput'></input> <button>Randomise</button></p>
    </div>
  )

  const footerContent = (
    <div>
      <Button variant="secondary" onClick={onHide}>
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

export default EditPasswordModal;