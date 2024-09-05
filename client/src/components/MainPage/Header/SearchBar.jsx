import React from 'react';
import { Form } from 'react-bootstrap';

function SearchBar ( {setQuery} ) {

    return (
        <Form>
            <Form.Control className={'border border-primary'} onChange={e => setQuery(e.target.value)} placeholder={'Search Service'}/>
        </Form>
    )
}

export default SearchBar;