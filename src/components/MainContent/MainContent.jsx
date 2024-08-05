import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';

function MainContent({passwords, saveChanges}) {

    return (
        <div>   
            <PasswordTable passwords={passwords} saveChanges={saveChanges}/>
        </div>
    );
}

export default MainContent;