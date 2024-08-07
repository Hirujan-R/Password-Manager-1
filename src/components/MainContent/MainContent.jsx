import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';

function MainContent({passwords, EditPassword, query}) {

    return (
        <div>   
            <PasswordTable passwords={passwords} EditPassword={EditPassword} query={query}/>
        </div>
    );
}

export default MainContent;