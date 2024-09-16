import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Modal.css';

function Modal({ show, onHide, className="", modalTitle, bodyContent, footerContent, 
    titleClassName="", headerClassName="", bodyClassName="", footerClassName="", isCloseButton=true, backdrop=true, keyboard=true}) 
{
    // Modal that is used for variety of cases such as viewing, editting, and changing passwords
    return (
        <BootstrapModal show={show} onHide={onHide} className={`modal ${className}`} backdrop={backdrop} keyboard={keyboard}>
            <BootstrapModal.Header className={`modal-header ${headerClassName}`}>
                <BootstrapModal.Title className={titleClassName}>{modalTitle}</BootstrapModal.Title>
                {isCloseButton && (
                    <Button className='modal-close' onClick={onHide}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                )}
            </BootstrapModal.Header>
            <BootstrapModal.Body className={`modal-body ${bodyClassName}`}>
                {bodyContent}
            </BootstrapModal.Body>
            <BootstrapModal.Footer className={`modal-footer ${footerClassName}`}>
                {footerContent}
            </BootstrapModal.Footer>
        </BootstrapModal>  
    );
}

export default Modal;