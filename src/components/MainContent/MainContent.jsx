import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';

function MainContent({passwords, editPassword, deletePassword, openShowCopyTextAlert, query}) {

    return (
        <div>   
            <PasswordTable passwords={passwords} editPassword={editPassword} 
            deletePassword={deletePassword} openShowCopyTextAlert={openShowCopyTextAlert} query={query}/>
        </div>
    );
}

export default MainContent;