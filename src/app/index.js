import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom'
import { LoginPage } from './components/login'
import { ProfilePage } from './components/profile'
import { useAuth } from './utils/auth'
import './css/index.css';
import { GraphIQLPage } from './components/graphiql';

const root = ReactDOM.createRoot(document.getElementById('root'))
function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="" element={<LoginPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="graphiql" element={<GraphIQLPage />} />
            </Routes>
        </HashRouter>
    );
}

root.render(<App />);