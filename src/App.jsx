import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import MainContent from './components/MainContent/MainContent.jsx';
import Header from './components/Header/Header.jsx';

const App = () => {

  const PASSWORDS = [
    {name: "Amazon", password: "Happy1"},
    {name: "Google", password: "Happy2"},
    {name: "Facebook", password: "Happy3"},
    {name: "Apple", password: "Happy4"},
  ];

  return (
    <div className="App">
      <Header/>
      <div>
        <MainContent passwords={PASSWORDS}></MainContent>
      </div>

    </div>
  );
};

export default App;
