import React, { useState} from 'react';
import { Button } from 'react-bootstrap';
import ViewPasswordModal from './ViewPasswordModal.jsx';
import EditPasswordModal from './EditPasswordModal.jsx';


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
    const onHide = () => setShow(false);
    const handleShow = () => setShow(true);


    // Function for handling the changes made to the password.
    function HandleSaveChanges({serviceName, password}) {
        saveChanges({serviceName, password});
        onHide();
        hideModal();
      }

    


    return (
        <tr>
            <td>{password.name}</td>
            <td>
                <Button variant='primary' onClick={openModal}>
                    Show Password
                </Button>
                <ViewPasswordModal show={showModal} onHide={hideModal} password={password} editPasswordFunction={handleShow} />
                <EditPasswordModal show={show} onHide={onHide} handleSaveChanges={HandleSaveChanges}/>
            </td>
        </tr>
    );
}

export default PasswordRow;