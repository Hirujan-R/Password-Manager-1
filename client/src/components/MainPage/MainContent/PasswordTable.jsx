import React, { useMemo, useState } from 'react';
import PasswordRow from './PasswordRow';
import { Container, Table, Row, Col } from 'react-bootstrap';
import './PasswordTable.css'


function PasswordTable({passwords, setPasswords, query, openEventAlert, openErrorAlert, openErrorModal}) {

    const tableItems = useMemo(() => {
        // Filters displayed passwords based on value entered in searchbar filter
        if (!query) {
            return passwords;
        }
        return passwords.filter(password => password.service_name.toLowerCase().includes(query.toLowerCase()));}
    , [passwords, query]);

    const rows = useMemo(() => {
        // Create a password row for each service password that a user has
        return tableItems.map((password) => (
            <PasswordRow key={password.password_id} passwords={passwords} setPasswords={setPasswords} password={password}
                openEventAlert={openEventAlert} openErrorAlert={openErrorAlert} openErrorModal={openErrorModal}/>
        ));
    }, [tableItems, passwords, setPasswords, openEventAlert, openErrorAlert]);

    
    


    return (
        <Container fluid className='table-container'>
            <Table className='password-table' striped hover bordered>
                <thead>
                    <tr >
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