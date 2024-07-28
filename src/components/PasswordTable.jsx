import React, { useState } from 'react';
import PasswordRow from './PasswordRow';


function PasswordTable({passwords}) {
    const rows = [];

    passwords.forEach((password) => {
        rows.push(
            <PasswordRow
                password={password} />
        )
    })

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