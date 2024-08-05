import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import SearchBar from './SearchBar';
import CreatePasswordModal from './CreatePasswordModal';

function Header (createButtonFunction) {
    const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
    const onHide = () => (setShowCreatePasswordModal(false));
    const onShow = () => (setShowCreatePasswordModal(true));

    return (
        <div>
            <Button onClick={onShow}>Add</Button>
            <SearchBar/>
            <CreatePasswordModal show={showCreatePasswordModal} onHide={onHide}/>
        </div>
        
    );
}

export default Header;