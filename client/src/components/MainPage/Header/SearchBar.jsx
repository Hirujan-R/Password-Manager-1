import React from 'react';
import { Form } from 'react-bootstrap';

function SearchBar ( {setQuery} ) {

    const handleEnterPress = (event) => {
        // Prevents event command when event key is pressed
        if (event.key === 'Enter') {
            event.preventDefault();
        } 
    }

    return (
        // Input field for filtering passwords
        <Form>
            <Form.Control className={'input-field'} onKeyDown={handleEnterPress} onChange={e => setQuery(e.target.value)} placeholder={'Search Service'}/>
        </Form>
    )
}

export default SearchBar;