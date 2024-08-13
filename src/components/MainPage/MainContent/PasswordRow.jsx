import React, { useState} from 'react';
import { Button } from 'react-bootstrap';
import ViewPasswordModal from './ViewPasswordModal.jsx';
import EditPasswordModal from './EditPasswordModal.jsx';
import DeletePasswordModal from './DeletePasswordModal.jsx';
import { useViewModal, useEditModal, useDeleteModal, useEmptyUsernameAlert, useEmptyPasswordAlert } from '../../../hooks/usePasswordRowStates.jsx';
import { editPassword, deletePassword } from '../../../utils/PasswordUtils.jsx';


function PasswordRow({passwords, setPasswords, password}) {
    
    // Modal for viewing password
     const {showViewModal, hideViewModal, openViewModal} = useViewModal();


    // Modal for editting password
    const {showEditModal, hideEditModal, openEditModal} = useEditModal();

    // Modal for deleting passwor
    const {showDeleteModal, hideDeleteModal, openDeleteModal} = useDeleteModal();

    const {showEmptyUsernameAlert, hideEmptyUsernameAlert, openEmptyUsernameAlert} = useEmptyUsernameAlert();

    const {showEmptyPasswordAlert, hideEmptyPasswordAlert, openEmptyPasswordAlert} = useEmptyPasswordAlert();
    


    // Function for handling the changes made to the password.
    function HandleEditPassword({newServiceName, newPassword}) {
        if (newServiceName=="") {openEmptyUsernameAlert();}
        else if (newPassword=="") {openEmptyPasswordAlert();}
        else {
            const passwordIndex = password.index;
            editPassword({newServiceName, newPassword, passwordIndex, passwords, setPasswords});
            hideEditModal();
            hideViewModal();
        }
        
    }

    // Function for handling the changes made to the password.
    function HandleDeletePassword() {
        const passwordIndex = password.index;
        deletePassword({passwordIndex, passwords, setPasswords});
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
                    editPasswordFunction={openEditModal} deletePasswordFunction={openDeleteModal}/>
                <EditPasswordModal show={showEditModal} onHide={hideEditModal} handleEditPassword={HandleEditPassword}
                    password={password} showEmptyUsernameAlert={showEmptyUsernameAlert} 
                    hideEmptyUsernameAlert={hideEmptyUsernameAlert} showEmptyPasswordAlert={showEmptyPasswordAlert}
                    hideEmptyPasswordAlert={hideEmptyPasswordAlert}/>
                <DeletePasswordModal show={showDeleteModal} onHide={hideDeleteModal} password={password} handleDeletePassword={HandleDeletePassword}/>
            </td>
        </tr>
    );
}

export default PasswordRow;