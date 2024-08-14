import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import Modal from '../../Modal.jsx';
import { randomisePassword } from '../../../utils/PasswordUtils.jsx';
import Alert from '../../Alert.jsx';
import { Input } from '../../Input.jsx';



function CreatePasswordModal({ show, onHide, handleAddPassword, showEmptyUsernameAlert, hideEmptyUsernameAlert,
  showEmptyPasswordAlert, hideEmptyPasswordAlert}) {


  const modalTitle = (
    "Create Password"
  ) 


  const bodyContent = (
    <Container className='d-flex flex-column'>
      <Row>
        <Col xs={3} className='pe-0 pt-1 me-1'>
          <p>Service Name:</p>
        </Col>
        <Col xs={6} className='ps-0'>
          <Input formControlId={'serviceInput'} formControlClassName={'border border-primary'}></Input>
        </Col>
      </Row>
      <Row>
        <Col xs={3} className='pe-0 pt-1 me-1'>
          <p>Password:</p>
        </Col>
        <Col xs={6} className='ps-0'>
          <Input formControlId={'passwordInput'} formControlClassName={'border border-primary'}></Input>
        </Col>
        <Col xs={2} className='ps-0'>
          <Button onClick={() => randomisePassword('passwordInput')}>Randomise</Button>
        </Col>
      </Row>
    </Container>
  )

  const handleClose = () => {
    hideEmptyUsernameAlert();
    hideEmptyPasswordAlert();
    onHide();
  }

  const footerContent = (
    <Container fluid>
      <div className='d-flex justify-content-end'>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={()=>handleAddPassword({
          newServiceName: document.getElementById('serviceInput').value, 
          newPassword: document.getElementById('passwordInput').value,
        })}>
          Create
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
    <Modal show={show} onHide={handleClose} modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent}></Modal>
  );
};

export default CreatePasswordModal;