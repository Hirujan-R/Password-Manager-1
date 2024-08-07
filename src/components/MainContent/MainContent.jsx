import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';

function MainContent({passwords, editPassword, deletePassword, query}) {

    return (
        <div>   
            <PasswordTable passwords={passwords} editPassword={editPassword} deletePassword={deletePassword} query={query}/>
        </div>
    );
}

export default MainContent;