import SearchBar from './SearchBar.jsx';
import PasswordTable from './PasswordTable.jsx';

function FilterablePasswordTable({passwords}) {
    return (
        <div>
            <SearchBar />
            <PasswordTable passwords={passwords} />
        </div>
    );
}

export default FilterablePasswordTable;