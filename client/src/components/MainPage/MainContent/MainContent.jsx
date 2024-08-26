import PasswordTable from './PasswordTable.jsx';
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function MainContent({passwords, setPasswords, query, openEventAlert, openErrorAlert}) {

    return (
        <Container fluid className='px-sm-5'>
            <Col xs={12} md={{span:8, offset: 2}}>
                <PasswordTable passwords={passwords} setPasswords={setPasswords} query={query} 
                openEventAlert={openEventAlert} openErrorAlert={openErrorAlert}/>
            </Col>
        </Container>

        
    );
}

export default MainContent;