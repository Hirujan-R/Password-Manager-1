import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from '../../Modal.jsx';

function DeletePasswordModal({ show, onHide, password, handleDeletePassword}) {

    const modalTitle = (
      "Delete Password"
    ) 
  
    const bodyContent = (
      <div>
        <p>Are you sure you want to delete the password for {password.name}?</p>
      </div>
    )
  
    const footerContent = (
      <div>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="danger" onClick={handleDeletePassword}>
          Delete
        </Button>
      </div>
      
    )
  
  
    return (
      <Modal show={show} onHide={onHide} modalTitle={modalTitle} bodyContent={bodyContent} footerContent={footerContent}></Modal>
    );
  };
  
  export default DeletePasswordModal;