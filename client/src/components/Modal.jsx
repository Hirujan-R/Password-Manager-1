import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';

function Modal({ show, onHide, modalTitle, bodyContent, footerContent, 
    className="", titleClassName="", isCloseButton=true, backdrop=true, keyboard=true}) 
{
    return (
        <BootstrapModal show={show} onHide={onHide} className={className} backdrop={backdrop} keyboard={keyboard}>
            <BootstrapModal.Header closeButton={isCloseButton}>
                <BootstrapModal.Title className={titleClassName}>{modalTitle}</BootstrapModal.Title>
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