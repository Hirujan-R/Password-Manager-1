import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';

function MainContent({passwords}) {

    const [currentPasswordTable, setPasswordTable] = useState(<PasswordTable passwords={passwords} saveChanges={SaveChanges}/>);

    function SaveChanges({serviceName, password}) {
        console.log(serviceName);
        console.log(password);
        passwords.push({name: serviceName, password: password});
        setPasswordTable(<PasswordTable passwords={passwords} saveChanges={SaveChanges}/>);
    }

    return (
        <div>
            {currentPasswordTable}
        </div>
    );
}

export default MainContent;