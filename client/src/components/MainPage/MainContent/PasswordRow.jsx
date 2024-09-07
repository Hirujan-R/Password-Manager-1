import React, { useState} from 'react';
import { Button } from 'react-bootstrap';
import ViewPasswordModal from './ViewPasswordModal.jsx';
import EditPasswordModal from './EditPasswordModal.jsx';
import DeletePasswordModal from './DeletePasswordModal.jsx';
import { useErrorAlert } from '../../../hooks/useAlertStates.jsx';
import { useViewModal, useEditModal, useDeleteModal } from '../../../hooks/useModalStates.jsx';
import { editPassword, deletePassword } from '../../../utils/apiUtils.jsx';


function PasswordRow({passwords, setPasswords, password, openEventAlert, openErrorAlert, openErrorModal}) {
    
    // Modal for viewing password
     const {showViewModal, hideViewModal, openViewModal} = useViewModal();

    // Modal for editting password
    const {showEditModal, hideEditModal, openEditModal} = useEditModal();

    // Modal for deleting password
    const {showDeleteModal, hideDeleteModal, openDeleteModal} = useDeleteModal();

    
    // Function for handling the changes made to the password.
    function HandleEditPassword({newServiceName, newPassword}) {
        hideEditModal();
        hideViewModal();
        if ((newServiceName != password.service_name) || (newPassword != password.password)) {
            editPassword({newServiceName: newServiceName, newPassword: newPassword, 
                passwordID: password.password_id, setPasswords: setPasswords, openEventAlert: openEventAlert,
                openErrorAlert: openErrorAlert, openErrorModal: openErrorModal });
        }
    }

    // Function for handling deletion password.
    function HandleDeletePassword() {
        hideDeleteModal();
        hideViewModal();
        deletePassword({passwordID: password.password_id, setPasswords, openEventAlert, openErrorAlert, openErrorModal});
    }

    
    return (
        <tr>
            <td>{password.service_name}</td>
            <td>
                <Button variant='primary' onClick={openViewModal}>
                    Show Password
                </Button>
                <ViewPasswordModal show={showViewModal} onHide={hideViewModal} password={password} 
                    editPasswordFunction={openEditModal} deletePasswordFunction={openDeleteModal}/>

                <EditPasswordModal show={showEditModal} onHide={hideEditModal} handleEditPassword={HandleEditPassword}
                    password={password}/>

                <DeletePasswordModal show={showDeleteModal} onHide={hideDeleteModal} password={password} handleDeletePassword={HandleDeletePassword}/>
            </td>
        </tr>
    );
}

export default PasswordRow;