import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import Modal from '../../Modal.jsx';
import { randomisePassword } from '../../../utils/PasswordUtils.jsx';
import Alert from '../../Alert.jsx';
import { Input } from '../../Input.jsx';
import './EditPasswordModal.css';



function EditPasswordModal({ show, onHide, handleEditPassword, password, showEditPasswordErrorAlert, 
  hideEditPasswordErrorAlert, editPasswordErrorText}) {

  const [currentServiceName, setCurrentServiceName] = useState(password.service_name);
  const [currentPasswordValue, setCurrentPasswordValue] = useState(password.password);

  const handleServiceNameChange = (e) => {
    setCurrentServiceName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setCurrentPasswordValue(e.target.value);
  };

  const handleCloseEditPasswordModal = () => {
    hideEditPasswordErrorAlert();
    onHide();
    setCurrentServiceName(password.service_name);
    setCurrentPasswordValue(password.password);
  };

  const modalTitle = (
    "Change Password"
  ) 

  const bodyContent = (

      <Container className='d-flex flex-column'>
      <Row>
        <Col xs={3} className='pe-0 pt-1 me-1'>
          <p>Service Name:</p>
        </Col>
        <Col xs={6} className='ps-0'>
          <Input formControlId={'serviceInput'} onChange={handleServiceNameChange} value={currentServiceName}
           formControlClassName={'border border-primary'}></Input>
        </Col>
      </Row>
      <Row>
        <Col xs={3} className='pe-0 pt-1 me-1'>
          <p>Password:</p>
        </Col>
        <Col xs={6} className='ps-0'>
          <Input formControlId={'passwordInput'} formControlClassName={'border border-primary'} value={currentPasswordValue}
            onChange={handlePasswordChange}></Input>
        </Col>
        <Col xs={2} className='ps-0'>
          <Button className='randomise-button' onClick={() => randomisePassword('passwordInput')}>Randomise</Button>
        </Col>
      </Row>
    </Container>
  )

  const footerContent = (
    <Container fluid>
    <div className='d-flex justify-content-end'>
      <Button variant="secondary" onClick={handleCloseEditPasswordModal}>
        Close
      </Button>
      <Button variant="primary" onClick={()=>handleEditPassword(
        {newServiceName: currentServiceName, newPassword: currentPasswordValue})}>
        Save Changes
      </Button>
    </div>
    <div className='mt-3'>
      <Alert showAlert={showEditPasswordErrorAlert} alertVariant={'danger'} 
      hideAlert={hideEditPasswordErrorAlert} className='text-center' isDismissible={false} 
      alertBody={<p>{editPasswordErrorText}</p>}/> 
    </div>
        
    </Container>
  
  )


  return (
    <Modal show={show} onHide={handleCloseEditPasswordModal} modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent}></Modal>
  );
};

export default EditPasswordModal;