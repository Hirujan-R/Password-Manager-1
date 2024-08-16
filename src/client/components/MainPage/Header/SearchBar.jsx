import React from 'react';
import { Input } from '../../Input';

function SearchBar ( {setQuery} ) {

    return (
        <Input formControlClassName='border border-primary' onChange={e => setQuery(e.target.value)}/>
    )
}

export default SearchBar;