import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import SearchBar from './SearchBar';
import CreatePasswordModal from './CreatePasswordModal';

function Header ({addPassword, setQuery}) {
    const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
    const onHide = () => (setShowCreatePasswordModal(false));
    const onShow = () => (setShowCreatePasswordModal(true));

    function HandleAddPassword({serviceName, password}) {
        addPassword({serviceName, password});
        onHide();
    }

    return (
        <div>
            <Button onClick={onShow}>Add</Button>
            <SearchBar setQuery={setQuery}/>
            <CreatePasswordModal show={showCreatePasswordModal} onHide={onHide} handleAddPassword={HandleAddPassword}/>
        </div>
        
    );
}

export default Header;