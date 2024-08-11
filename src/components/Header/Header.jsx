import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
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
            <Container fluid className='p-5'>
                <Row>
                    <Col xs={{span: 4, offset: 4}}>
                        <SearchBar setQuery={setQuery}/>
                    </Col>
                    <Col xs={4} className='d-flex'>
                        <Button onClick={onShow}>Add</Button>
                    </Col>
                </Row>
                <CreatePasswordModal show={showCreatePasswordModal} onHide={onHide} handleAddPassword={handleAddPassword}/>
            </Container>
            
            
        
    );
}

export default Header;