import React, { useState } from 'react';
import PasswordRow from './PasswordRow';


function PasswordTable({passwords, saveChanges}) {

    const rows = [];

    function CreateRows() {
        while (rows.length > 0) {
            rows.pop();
        }
        passwords.forEach((password) => {
        rows.push(
            <PasswordRow password={password} saveChanges={saveChanges} />
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