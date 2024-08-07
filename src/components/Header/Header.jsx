import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import SearchBar from './SearchBar';
import CreatePasswordModal from './CreatePasswordModal';
import { addPassword } from '../../utils/PasswordUtils';

function Header ({setQuery, setPasswords, passwords}) {
    const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
    const onHide = () => (setShowCreatePasswordModal(false));
    const onShow = () => (setShowCreatePasswordModal(true));

    function handleAddPassword({newServiceName, newPassword}) {
        addPassword({newServiceName, newPassword, passwords, setPasswords});
        onHide();
    }

    return (
        <div>
            <Button onClick={onShow}>Add</Button>
            <SearchBar setQuery={setQuery}/>
            <CreatePasswordModal show={showCreatePasswordModal} onHide={onHide} handleAddPassword={handleAddPassword}/>
        </div>
        
    );
}

export default Header;