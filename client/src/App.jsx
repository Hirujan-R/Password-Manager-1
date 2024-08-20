import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import MainPage from './components/MainPage/MainPage';
import { LoginPage } from './components/LoginPage/LoginPage';
import { RegistrationPage } from './components/RegistrationPage/RegistrationPage'

const App = () => {
  
  return (
    <RegistrationPage />
    
  );
};

export default App;
