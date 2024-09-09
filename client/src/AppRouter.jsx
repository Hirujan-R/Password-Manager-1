import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import MainPage from './components/MainPage/MainPage';
import SettingsPage from './components/SettingsPage/SettingsPage';




function AppRouter() {

    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/registration' element={<RegistrationPage />} />
                <Route path='main' element={<MainPage />} />
                <Route path='settings' element={<SettingsPage />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;
