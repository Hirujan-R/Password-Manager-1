import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';

function Modal({ show, onHide, modalTitle, bodyContent, footerContent }) {
    

    return (
        <BootstrapModal show={show} onHide={onHide}>
            <BootstrapModal.Header closeButton>
                <BootstrapModal.Title>{modalTitle}</BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body>
                {bodyContent}
            </BootstrapModal.Body>
            <BootstrapModal.Footer>
                {footerContent}
            </BootstrapModal.Footer>
        </BootstrapModal>  
    );
}

export default Modal;