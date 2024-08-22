import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import CreatePasswordModal from './CreatePasswordModal';
import { addPassword } from '../../../utils/PasswordUtils';
import './Header.css';
import { useGeneralErrorAlert } from '../../../hooks/useRegistrationStates';

function Header ({ setQuery, setPasswords, passwords, openPasswordCreatedAlert }) {
    const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
    const onHide = () => (setShowCreatePasswordModal(false));
    const onShow = () => (setShowCreatePasswordModal(true));

    
    const {showGeneralErrorAlert, hideGeneralErrorAlert, openGeneralErrorAlert, errorText} = useGeneralErrorAlert({});

    function handleAddPassword({newServiceName, newPassword}) {
        hideGeneralErrorAlert();
        if (newServiceName=="") {
            openGeneralErrorAlert("⚠️ Error: A service name is required. Please enter a service name to proceed.")
        } else if (newPassword=="") {
            openGeneralErrorAlert("⚠️ Error: A password is required. Please enter a password to proceed.")
        } else {
            addPassword({newServiceName, newPassword, passwords, setPasswords});
            onHide();
            openPasswordCreatedAlert();
        }
    }

    return (
            <Container fluid className='px-sm-5 py-5'>
                <Row>
                    <Col xs={{span:7, offset:1}} sm={{span:8, offset:1}} md={{span: 8, offset: 2}} lg={{span: 5, offset: 3}}>
                        <SearchBar setQuery={setQuery}/>
                    </Col>
                    <Col xs={4} sm={2} lg={4} className='d-flex'>
                        <Button onClick={onShow} className='add-button me-2'>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                        <Button className='logout-button d-md-none'>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </Button>
                    </Col>
                </Row>
                <CreatePasswordModal show={showCreatePasswordModal} onHide={onHide} handleAddPassword={handleAddPassword} 
                    showGeneralErrorAlert={showGeneralErrorAlert} hideGeneralErrorAlert={hideGeneralErrorAlert} 
                    errorText={errorText}/>
            </Container>
            
    );
}

export default Header;