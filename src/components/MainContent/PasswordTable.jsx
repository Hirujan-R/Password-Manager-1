import React, { useState } from 'react';
import PasswordRow from './PasswordRow';


function PasswordTable({passwords, editPassword, deletePassword, query}) {


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
            <PasswordRow password={password} editPassword={editPassword} deletePassword={deletePassword} />
        )
    })
    }

    CreateRows();
    

    

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Password</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
}



export default PasswordTable;