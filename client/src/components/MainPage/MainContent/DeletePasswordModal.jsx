import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from '../../Modal.jsx';
import './DeletePasswordModal.css';

function DeletePasswordModal({ show, onHide, password, handleDeletePassword}) {

    const modalTitle = (
      "Delete Password"
    ) 
  
    const bodyContent = (
      <div className='body-content'>
        <p>Are you sure you want to delete the password for {password.service_name}?</p>
      </div>
    )
  
    const footerContent = (
      <div className='footer-content'>
        <Button className="secondary-button me-2" onClick={onHide}>
          Close
        </Button>
        <Button className="danger-button" onClick={handleDeletePassword}>
          Delete
        </Button>
      </div>
      
    )
  
  
    return (
      <Modal show={show} onHide={onHide} modalTitle={modalTitle} titleClassName='w-100 text-center' bodyContent={bodyContent} footerContent={footerContent}></Modal>
    );
  };
  
  export default DeletePasswordModal;