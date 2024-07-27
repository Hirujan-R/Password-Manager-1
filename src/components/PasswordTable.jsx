import React, { useState } from 'react';
import Modal from './Modal.jsx';

function CopyPassword(password) {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
}

function PasswordRow({password}) {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(!showModal);
    };

    return (
        <tr>
            <td>{password.name}</td>
            <td>
                <button onClick={openModal}>
                    {showModal ? "Hide Password" : "Show Password"}
                </button>
                <Modal show={showModal}>
                    <p>{password.password}</p>
                    <button onClick={() => CopyPassword(password.password)}>Copy</button>
                    <button>Edit Password</button>
                </Modal>
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