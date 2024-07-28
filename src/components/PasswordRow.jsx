import React, { useState } from 'react';
import ViewPasswordModal from './Modal.jsx';
import ChangePasswordModal from './ChangePasswordModal';

function CopyPassword(password) {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
}

function PasswordRow({password}) {
    
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    }
    const hideModal = () => {
        setShowModal(false);
    };



    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const bodyContent = (
        <div>
            <p>{password.password}</p>
            <button onClick={() => CopyPassword(password.password)}>Copy</button>
            <button onClick={handleShow}>Edit Password</button>
        </div>
        
    )

    function HandleSaveChanges({serviceName, password}) {
        console.log(serviceName);
        console.log(password);
        handleClose();
    }

    return (
        <tr>
            <td>{password.name}</td>
            <td>
                <button onClick={openModal}>
                    Show Password
                </button>
                <ViewPasswordModal show={showModal} onHide={showModal} bodyContent={bodyContent} />
                <ChangePasswordModal show={show} handleClose={handleClose} />
            </td>
        </tr>
    );
}

export default PasswordRow;