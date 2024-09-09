import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import SettingsPage from './components/SettingsPage/SettingsPage.jsx';
import AppRouter from './AppRouter';

const App = () => {
  
  return (
    <AppRouter />
    
  );
};

export default App;
