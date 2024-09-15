import React from 'react'
import { useState } from 'react';
import { apiLogin } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth} from '../utils/auth'

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await apiLogin(username, password);
            if (response.error) {
                setError('Invalid credentials. Please try again.');
            } else {
                login(response.token);
                navigate('/profile', { replace: true });
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <>
        <div className='welcome'>WELCOME TO GRAPHQL</div>
        <form onSubmit={handleLogin}>
            <input className='login-field' id='login-username' placeholder='Username' type='text' onChange={(elem) => setUsername(elem.target.value)}/><br />
            <input className='login-field'id='login-password'placeholder='Password' type='password' onChange={(elem) => setPassword(elem.target.value)}/><br />
            <button type='Submit' className='login-button'>Log In</button>
        </form>
        </>
    )
}