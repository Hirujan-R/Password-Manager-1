import React, { useState } from 'react';
import PasswordRow from './PasswordRow';
import { Container, Table, Row, Col } from 'react-bootstrap';
import './PasswordTable.css'


function PasswordTable({passwords, setPasswords, query, openPasswordEdittedAlert, openPasswordDeletedAlert}) {


    function getFilteredItems() {
        if (!query) {
            return passwords;
        }
        return passwords.filter(password => password.name.toLowerCase().includes(query.toLowerCase()));
    }

    const rows = [];
    const tableItems = getFilteredItems(query, passwords);

    

    function CreateRows() {
        while (rows.length > 0) {
            rows.pop();
        }
        tableItems.forEach((password) => {
        rows.push(
            <PasswordRow passwords={passwords} setPasswords={setPasswords} password={password} 
            openPasswordEdittedAlert={openPasswordEdittedAlert} openPasswordDeletedAlert={openPasswordDeletedAlert}/>
        )
    })
    }

    CreateRows();
    

    

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