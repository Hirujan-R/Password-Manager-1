import React from 'react';
import { Form } from 'react-bootstrap';

function SearchBar ( {setQuery} ) {

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        } 
    }

    return (
        <Form>
            <Form.Control className={'input-field'} onKeyDown={handleEnterPress} onChange={e => setQuery(e.target.value)} placeholder={'Search Service'}/>
        </Form>
    )
}

export default SearchBar;