import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import CreatePasswordModal from './CreatePasswordModal';
import { createPassword } from '../../../utils/apiUtils';
import './Header.css';
import { useErrorAlert } from '../../../hooks/useAlertStates';

function Header ({ setQuery, setPasswords, openEventAlert, mainOpenErrorAlert, openErrorModal }) {
    // State management for CreatePasswordModal
    const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
    const onHide = () => (setShowCreatePasswordModal(false));
    const onShow = () => (setShowCreatePasswordModal(true));

    function handleAddPassword({newServiceName, newPassword}) {
        // Hides CreatePasswordModal
        onHide();
        // Calls API function to create password
        createPassword({serviceName: newServiceName, password: newPassword, setPasswords,
                openEventAlert, openErrorAlert:mainOpenErrorAlert, openErrorModal});
    }

    return (
        <Container fluid className='px-sm-5 py-5'>
            <Row className='mx-auto'>
                {/*Searchbar*/}
                <Col className='my-auto ps-md-0' xs={{span:7}} sm={{span:8, offset:1}} md={{span: 6, offset: 3}} lg={{span: 5, offset: 3}}>
                    <SearchBar setQuery={setQuery}/>
                </Col>
                <Col xs={5} sm={3} md={2} lg={4} className='d-flex ps-md-0 ps-0'>
                    {/*Add password button that opens CreatePasswordModal*/}
                    <Button onClick={onShow} className='primary-button add-button me-2 '>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    {/*Settings button that navigates to settings page*/}
                    <Link to={'/settings'}>
                        <Button className='primary-button settings-button me-2 d-md-none'>
                            <FontAwesomeIcon icon={faGear} />
                        </Button>
                    </Link>
                    {/*Logout button that navigates to login page*/}
                    <Link to={"/"}>
                        <Button className='primary-button logout-button d-md-none'>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </Button>
                    </Link>
                </Col>
            </Row>
            {/*CreatePasswordModal*/}
            <CreatePasswordModal show={showCreatePasswordModal} onHide={onHide} handleAddPassword={handleAddPassword}/>
        </Container>
        
    );
}

export default Header;