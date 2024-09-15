import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from './components/login'
import { ProfilePage } from './components/profile'
import { useAuth } from './utils/auth'
import './css/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'))
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
}

root.render(<App />);