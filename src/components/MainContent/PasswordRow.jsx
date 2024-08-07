import React, { useState} from 'react';
import { Button } from 'react-bootstrap';
import ViewPasswordModal from './ViewPasswordModal.jsx';
import EditPasswordModal from './EditPasswordModal.jsx';
import DeletePasswordModal from './DeletePasswordModal.jsx';


function PasswordRow({password, editPassword, deletePassword, openShowCopyTextAlert}) {
    
    // Modal for viewing password
    const [showViewModal, setShowViewModal] = useState(false);
    const openViewModal = () => setShowViewModal(true);
    const hideViewModal = () => setShowViewModal(false);


    // Modal for editting password
    const [showEditModal, setShowEditModal] = useState(false);
    const openEditModal = () => setShowEditModal(true);
    const hideEditModal = () => setShowEditModal(false);

    // Modal for deleting password
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const openDeleteModal = () => setShowDeleteModal(true);
    const hideDeleteModal = () => setShowDeleteModal(false);
    


    // Function for handling the changes made to the password.
    function HandleEditPassword({newServiceName, newPassword}) {
        const passwordIndex = password.index;
        editPassword({newServiceName, newPassword, passwordIndex});
        hideEditModal();
        hideViewModal();
    }

    // Function for handling the changes made to the password.
    function HandleDeletePassword() {
        const passwordIndex = password.index;
        deletePassword({passwordIndex});
        hideDeleteModal();
        hideViewModal();
    }

    


    return (
        <tr>
            <td>{password.name}</td>
            <td>
                <Button variant='primary' onClick={openViewModal}>
                    Show Password
                </Button>
                <ViewPasswordModal show={showViewModal} onHide={hideViewModal} password={password} 
                editPasswordFunction={openEditModal} deletePasswordFunction={openDeleteModal} 
                openShowCopyTextAlert={openShowCopyTextAlert}/>
                <EditPasswordModal show={showEditModal} onHide={hideEditModal} handleEditPassword={HandleEditPassword}/>
                <DeletePasswordModal show={showDeleteModal} onHide={hideDeleteModal} password={password} handleDeletePassword={HandleDeletePassword}/>
            </td>
        </tr>
    );
}

export default PasswordRow;