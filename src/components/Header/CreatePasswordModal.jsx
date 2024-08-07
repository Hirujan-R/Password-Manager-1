import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from '../Modal.jsx';



function CreatePasswordModal({ show, onHide, handleAddPassword}) {


  const modalTitle = (
    "Create Password"
  ) 


  const bodyContent = (
    <div>
      <p>Service Name: <input id='serviceInput'></input></p>
      <p>Password: <input id='passwordInput'></input> <Button>Randomise</Button></p>
    </div>
  )

  const footerContent = (
    <div>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
      <Button variant="primary" onClick={()=>handleAddPassword({
        newServiceName: document.getElementById('serviceInput').value, 
        newPassword: document.getElementById('passwordInput').value,
      })}>
        Create
      </Button>
    </div>
    
  )


  return (
    <Modal show={show} onHide={onHide} modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent}></Modal>
  );
};

export default CreatePasswordModal;