import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from '../Modal.jsx';



function EditPasswordModal({ show, onHide, handleEditPassword}) {

  const modalTitle = (
    "Change Password"
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
      <Button variant="primary" onClick={()=>handleEditPassword({
        newServiceName: document.getElementById('serviceInput').value, 
        newPassword: document.getElementById('passwordInput').value,
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