import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import CreatePasswordModal from './CreatePasswordModal';
import { addPassword } from '../../../utils/PasswordUtils';
import { createPassword } from '../../../utils/apiUtils';
import './Header.css';
import { useErrorAlert } from '../../../hooks/useAlertStates';

function Header ({ setQuery, setPasswords, openEventAlert, mainOpenErrorAlert, openErrorModal }) {
    const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
    const onHide = () => (setShowCreatePasswordModal(false));
    const onShow = () => (setShowCreatePasswordModal(true));

    function handleAddPassword({newServiceName, newPassword}) {
        onHide();
        createPassword({serviceName: newServiceName, password: newPassword, setPasswords,
                openEventAlert, openErrorAlert:mainOpenErrorAlert, openErrorModal});
    }

    return (
        <Container fluid className='px-sm-5 py-5'>
            <Row className='mx-auto'>
                <Col className='my-auto ps-md-0' xs={{span:7, offset:1}} sm={{span:8, offset:1}} md={{span: 6, offset: 3}} lg={{span: 5, offset: 3}}>
                    <SearchBar setQuery={setQuery}/>
                </Col>
                <Col xs={4} sm={3} md={2} lg={4} className='d-flex ps-md-0 ps-0'>
                    <Button onClick={onShow} className='add-button me-2 '>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Link to={"/"}>
                        <Button className='logout-button d-md-none'>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </Button>
                    </Link>
                </Col>
            </Row>
            <CreatePasswordModal show={showCreatePasswordModal} onHide={onHide} handleAddPassword={handleAddPassword}/>
        </Container>
        
    );
}

export default Header;