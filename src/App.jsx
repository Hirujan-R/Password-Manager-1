import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import ChangePasswordModal from './components/EditPasswordModal.jsx';
import FilterablePasswordTable from './components/FilterablePasswordTable.jsx';

const App = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const PASSWORDS = [
    {name: "Amazon", password: "Happy1"},
    {name: "Google", password: "Happy2"},
    {name: "Facebook", password: "Happy3"},
    {name: "Apple", password: "Happy4"},
  ];

  return (
    <div className="App">
      
      <div>
        <FilterablePasswordTable passwords={PASSWORDS}></FilterablePasswordTable>
      </div>

      <ChangePasswordModal show={show} handleClose={handleClose} />
    </div>
  );
};

export default App;
