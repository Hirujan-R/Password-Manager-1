import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function MainContent({passwords, setPasswords, openShowCopyTextAlert, query}) {

    return (
        <Container fluid className='px-5'>
            <Col xs={{span: 4, offset: 4}}>
                <PasswordTable passwords={passwords} setPasswords={setPasswords} 
                openShowCopyTextAlert={openShowCopyTextAlert} query={query}/>
            </Col>
        </Container>

        
    );
}

export default MainContent;