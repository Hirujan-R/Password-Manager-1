import React, { useState } from 'react';
import ViewPasswordModal from './Modal.jsx';

function CopyPassword(password) {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
}

function PasswordRow({password}) {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    }

    const hideModal = () => {
        setShowModal(false);
    };

    const bodyContent = (
        <div>
            <p>{password.password}</p>
            <button onClick={() => CopyPassword(password.password)}>Copy</button>
            <button>Edit Password</button>
        </div>
        
    )

    return (
        <tr>
            <td>{password.name}</td>
            <td>
                <button onClick={openModal}>
                    Show Password
                </button>
                <ViewPasswordModal show={showModal} onHide={showModal} bodyContent={bodyContent} />
            </td>
        </tr>
    );
}

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