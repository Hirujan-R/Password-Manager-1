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
        <div className='container fixed-top align-items-center p-5'>
            <Container fluid>
                <Row className='justify-content-center'>
                    <Col xs={4}></Col>
                    <Col xs={4} className='align-items-center'>
                        <SearchBar setQuery={setQuery}/>
                    </Col>
                    <Col xs={4} className='d-flex align-items-center'>
                        <Button onClick={onShow}>Add</Button>
                    </Col>
                </Row>
                
            </Container>
            
            
            <CreatePasswordModal show={showCreatePasswordModal} onHide={onHide} handleAddPassword={handleAddPassword}/>
        </div>
        
    );
}

export default Header;