import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from '../Modal.jsx';
import { randomisePassword } from '../../utils/PasswordUtils.jsx';




function EditPasswordModal({ show, onHide, handleEditPassword, password}) {

  const [currentServiceName, setCurrentServiceName] = useState(password.name);
  const [currentPasswordValue, setCurrentPasswordValue] = useState(password.password);

  const handleServiceNameChange = (e) => {
    setCurrentServiceName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setCurrentPasswordValue(e.target.value);
  };

  const modalTitle = (
    "Change Password"
  ) 

  const bodyContent = (
    <div>
      <p>Service Name: <input id='serviceInput' onChange={handleServiceNameChange} value={currentServiceName}></input></p>
      <p>Password: 
        <input id='passwordInput' onChange={handlePasswordChange} value={currentPasswordValue}></input> 
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