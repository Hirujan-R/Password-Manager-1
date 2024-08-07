import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';

function MainContent({passwords, setPasswords, openShowCopyTextAlert, query}) {

    return (
        <div>   
            <PasswordTable passwords={passwords} setPasswords={setPasswords} 
            openShowCopyTextAlert={openShowCopyTextAlert} query={query}/>
        </div>
    );
}

export default MainContent;