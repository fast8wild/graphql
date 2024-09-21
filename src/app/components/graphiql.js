import React from 'react'
import { useState, useCallback, useEffect, useRef } from 'react'
import { graphqlRequest } from '../utils/api';
import { useAuth, getJWT, parseJwt } from '../utils/auth'
import { useNavigate, Navigate } from 'react-router-dom';



export function GraphIQLPage() {
    const { isLoggedIn, logout } = useAuth();
    const [output, setOutput] = useState("")
    const [input, setInput] = useState("")
    const navigate = useNavigate();

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    }

    const toProfile = () => navigate('/profile', { replace: true });

    async function getOutput() {
        try {
            if (input) {
                const res = await graphqlRequest(input,{})
                setOutput(JSON.stringify(res))
            }
        } catch (err) {
            console.error('Error loading data:', err);
            setOutput('Not a Valid GraphQL Query')
        }
    }

    return (
        <div className='profile-page'>
            <button className='logout-button' onClick={handleLogout}>Logout</button> <br />
            <button className='toProfile-button' onClick={toProfile}>Profile</button> <br />
            <div className='query-in container'>
                <div className='header'>Input</div>
                <textarea className='input-graphiql' onChange={(elem) => setInput(elem.target.value)}></textarea>
                <button className='submit-graphiql' onClick={getOutput}>Submit</button> <br />
            </div><br />
            <div className='query-out container'>
                <div className='header'>Output</div>
                <textarea className='output-graphiql' value={output} onChange={(elem) => setOutput(elem.target.value)}></textarea>
            </div><br />
        </div>
    )
}