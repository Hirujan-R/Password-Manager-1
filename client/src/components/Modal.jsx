import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';

function Modal({ show, onHide, className="", modalTitle, bodyContent, footerContent, 
    titleClassName="", headerClassName="", bodyClassName="", footerClassName="", isCloseButton=true, backdrop=true, keyboard=true}) 
{
    return (
        <BootstrapModal show={show} onHide={onHide} className={className} backdrop={backdrop} keyboard={keyboard}>
            <BootstrapModal.Header closeButton={isCloseButton} className={headerClassName}>
                <BootstrapModal.Title className={titleClassName}>{modalTitle}</BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body>
                {bodyContent}
            </BootstrapModal.Body>
            <BootstrapModal.Footer className={footerClassName}>
                {footerContent}
            </BootstrapModal.Footer>
        </BootstrapModal>  
    );
}

export default Modal;