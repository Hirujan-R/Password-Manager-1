import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function MainContent({passwords, setPasswords, openShowCopyTextAlert, query}) {

    return (
        <Container fluid className='px-sm-5'>
            <Col xs={12} md={{span:8, offset: 2}}>
                <PasswordTable passwords={passwords} setPasswords={setPasswords} 
                openShowCopyTextAlert={openShowCopyTextAlert} query={query}/>
            </Col>
        </Container>

        
    );
}

export default MainContent;