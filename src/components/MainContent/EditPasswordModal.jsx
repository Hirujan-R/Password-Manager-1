import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from '../Modal.jsx';
import { randomisePassword } from '../../utils/PasswordUtils.jsx';



function EditPasswordModal({ show, onHide, handleEditPassword, password}) {

  const modalTitle = (
    "Change Password"
  ) 

  const bodyContent = (
    <div>
      <p>Service Name: <input id='serviceInput' value={password.name}></input></p>
      <p>Password: 
        <input id='passwordInput' value={password.password}></input> 
        <Button onClick={() => randomisePassword('passwordInput')}>Randomise</Button>
      </p>
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