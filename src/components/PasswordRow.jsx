import React, { useState } from 'react';
import ViewPasswordModal from './Modal.jsx';
import ChangePasswordModal from './ChangePasswordModal';

function CopyPassword(password) {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
}

function PasswordRow({password, saveChanges}) {
    
    // Modal for viewing password
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    }
    const hideModal = () => {
        setShowModal(false);
    };


    // Modal for editting password
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    // Function for handling the changes made to the password.
    function HandleSaveChanges({serviceName, password}) {
        saveChanges({serviceName, password});
        handleClose();
        hideModal();
      }

    // Contains content in the Modal for showing the password.
    const bodyContent = (
        <div>
            <p>{password.password}</p>
            <button onClick={() => CopyPassword(password.password)}>Copy</button>
            <button onClick={handleShow}>Edit Password</button>
        </div>
        
    )


    return (
        <tr>
            <td>{password.name}</td>
            <td>
                <button onClick={openModal}>
                    Show Password
                </button>
                <ViewPasswordModal show={showModal} onHide={showModal} bodyContent={bodyContent} />
                <ChangePasswordModal show={show} handleClose={handleClose} handleSaveChanges={HandleSaveChanges}/>
            </td>
        </tr>
    );
}

export default PasswordRow;