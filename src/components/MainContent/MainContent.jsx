import PasswordTable from './PasswordTable.jsx';
import { useState } from 'react';

function MainContent({initialPasswords}) {

    const [passwords, setPasswords] = useState(initialPasswords);
    
    function SaveChanges({serviceName, password}) {
        console.log(serviceName);
        console.log(password);
        const updatedPasswords = [...passwords, {name: serviceName, password: password }];
        setPasswords(updatedPasswords);
    }

    return (
        <div>   
            <PasswordTable passwords={passwords} saveChanges={SaveChanges}/>
        </div>
    );
}

export default MainContent;