import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

function SearchBar ( {setQuery} ) {

    return (
        <Form>
            <Form.Control type='text' onChange={e => setQuery(e.target.value)}></Form.Control>
        </Form>
    )
}

export default SearchBar;