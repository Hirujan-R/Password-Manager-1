import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';

function MainContent({passwords, saveChanges, query}) {

    return (
        <div>   
            <PasswordTable passwords={passwords} saveChanges={saveChanges} query={query}/>
        </div>
    );
}

export default MainContent;