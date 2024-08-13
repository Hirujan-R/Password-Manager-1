import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import Modal from '../../Modal.jsx';
import { randomisePassword } from '../../../utils/PasswordUtils.jsx';
import { useEmptyUsernameAlert, useEmptyPasswordAlert } from '../../../hooks/usePasswordRowStates.jsx';
import Alert from '../../Alert.jsx';




function EditPasswordModal({ show, onHide, handleEditPassword, password, showEmptyUsernameAlert, hideEmptyUsernameAlert,
  showEmptyPasswordAlert, hideEmptyPasswordAlert}) {

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
    <Container fluid>
    <div className='d-flex justify-content-end'>
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
      <div className='mt-3'>
        <Alert showAlert={showEmptyUsernameAlert} alertVariant={'danger'} hideAlert={hideEmptyUsernameAlert} className='text-center'
        isDismissible={false} alertBody={<p>⚠️ Error: A username is required. Please enter your username to proceed.</p>}/> 
        <Alert showAlert={showEmptyPasswordAlert} alertVariant={'danger'} hideAlert={hideEmptyPasswordAlert} className='text-center'
        isDismissible={false} alertBody={<p>⚠️ Error: A password is required. Please enter your password to proceed.</p>}/>
      </div>
        
    </Container>
  
  )


  return (
    <Modal show={show} onHide={onHide} modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent}></Modal>
  );
};

export default EditPasswordModal;