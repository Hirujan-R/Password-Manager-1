import React, { useState } from 'react';
import { Modal as BootstrapModal, Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCopy, faTrash, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import Modal from '../../Modal.jsx';
import Alert from '../../Alert.jsx';
import { useEventAlert } from '../../../hooks/useAlertStates.jsx';
import './ViewPasswordModal.css';

function ViewPasswordModal({show, onHide, password, editPasswordFunction, deletePasswordFunction}) {

    const { showEventAlert, hideEventAlert, openEventAlert, eventText } = useEventAlert({});

    function CopyPassword(password) {
        navigator.clipboard.writeText(password.password);
        openEventAlert("Password is copied to clipboard!");
 
    }

    const modalTitle = (
        <BootstrapModal.Title>View Password</BootstrapModal.Title>
    )
    
    const bodyContent = (
        <div className='body-content d-flex flex-column justify-content-center text-center'>
            <Row>
                <p>{password.password}</p>
            </Row>
            <Row>
            <Col>
                <Button className='primary-button' onClick={() => CopyPassword(password)}><FontAwesomeIcon icon={faCopy} /></Button>
                <Button className='primary-button' onClick={editPasswordFunction}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                <Button className='danger-button' onClick={deletePasswordFunction}><FontAwesomeIcon icon={faTrash} /></Button>
            </Col>
            </Row>
        </div>   
    )
    
    const footerContent = (
        <Container fluid>
            <Alert showAlert={showEventAlert} alertVariant='copy-text' hideAlert={hideEventAlert} 
            isDismissible={false} alertHeading={"Password Copied!"} alertBody={<p>{eventText}</p>}/>
        </Container>  
    )

    return (
        <Modal show={show} onHide={onHide} className='custom-modal-size pe-5' modalTitle={modalTitle} titleClassName='w-100 text-center' headerClassName='modal-header' footerClassName='modal-footer' bodyContent={bodyContent} footerContent={footerContent}/>
      );
    
}

export default ViewPasswordModal;