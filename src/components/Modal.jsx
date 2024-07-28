import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ViewPasswordModal({ show, onHide, bodyContent }) {
    

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Body>
                {bodyContent}
            </Modal.Body>
        </Modal>  
    );
}

export default ViewPasswordModal;