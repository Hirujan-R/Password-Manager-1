import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import CreatePasswordModal from './CreatePasswordModal';
import { useEmptyUsernameAlert, useEmptyPasswordAlert } from '../../../hooks/usePasswordRowStates';
import { addPassword } from '../../../utils/PasswordUtils';
import './Header.css';

function Header ({setQuery, setPasswords, passwords}) {
    const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
    const onHide = () => (setShowCreatePasswordModal(false));
    const onShow = () => (setShowCreatePasswordModal(true));

    // Alert that triggers if there no value in the username field.
    const {showEmptyUsernameAlert, hideEmptyUsernameAlert, openEmptyUsernameAlert} = useEmptyUsernameAlert();

    // Alert that triggers if there no value in the password field.
    const {showEmptyPasswordAlert, hideEmptyPasswordAlert, openEmptyPasswordAlert} = useEmptyPasswordAlert();

    function handleAddPassword({newServiceName, newPassword}) {
        hideEmptyUsernameAlert();
        hideEmptyPasswordAlert();
        if (newServiceName=="") {openEmptyUsernameAlert();}
        else if (newPassword=="") {openEmptyPasswordAlert();}
        else {
            addPassword({newServiceName, newPassword, passwords, setPasswords});
            onHide();
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
                    showEmptyUsernameAlert={showEmptyUsernameAlert} hideEmptyUsernameAlert={hideEmptyUsernameAlert} 
                    showEmptyPasswordAlert={showEmptyPasswordAlert} hideEmptyPasswordAlert={hideEmptyPasswordAlert}/>
            </Container>
            
            
        
    );
}

export default Header;