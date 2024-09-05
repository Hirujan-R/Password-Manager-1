import React, { useMemo, useState } from 'react';
import PasswordRow from './PasswordRow';
import { Container, Table, Row, Col } from 'react-bootstrap';
import './PasswordTable.css'


function PasswordTable({passwords, setPasswords, query, openEventAlert, openErrorAlert, openErrorModal}) {

    const tableItems = useMemo(() => {
        if (!query) {
            return passwords;
        }
        return passwords.filter(password => password.service_name.toLowerCase().includes(query.toLowerCase()));}
    , [passwords, query]);

    const rows = useMemo(() => {
        return tableItems.map((password) => (
            <PasswordRow passwords={passwords} setPasswords={setPasswords} password={password}
                openEventAlert={openEventAlert} openErrorAlert={openErrorAlert} openErrorModal={openErrorModal}/>
        ));
    }, [tableItems, passwords, setPasswords, openEventAlert, openErrorAlert]);

    
    


    return (
        <Container fluid className='table-container'>
            <Table className='border border-primary' striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </Container>

    );
}



export default PasswordTable;