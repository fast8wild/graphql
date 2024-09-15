// auth.js
// Provides utility functions for handling authentication tasks, such as JWT management.
import { useState, useEffect } from 'react';

export function getJWT() {
    return localStorage.getItem('hasura-jwt');
}

export function setJWT(token) {
    localStorage.setItem('hasura-jwt', token);
}

export function removeJWT() {
    localStorage.removeItem('hasura-jwt');
}

export function isPossiblyLoggedIn() {
    return !!getJWT();
}

export function parseJwt(token) {
    if (!token) {
        throw new Error('Invalid token: Token is null or undefined');
    }

    const base64Url = token.split('.')[1];
    if (!base64Url) {
        throw new Error('Invalid token: Token does not contain a payload');
    }

    const base64 = atob(base64Url.replace(/-/g, '+').replace(/_/g, '/'));
    const jsonPayload = JSON.parse(decodeURIComponent(escape(base64)));
    
    if (!jsonPayload['https://hasura.io/jwt/claims'] || !jsonPayload['https://hasura.io/jwt/claims']['x-hasura-user-id']) {
        throw new Error('Invalid token: Token does not contain required claims');
    }
    
    return {
        userId: jsonPayload['https://hasura.io/jwt/claims']['x-hasura-user-id'],
    };
}

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!getJWT());

    const login = (token) => {
        setJWT(token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        removeJWT();
        setIsLoggedIn(false);
    };

    useEffect(() => {
        setIsLoggedIn(!!getJWT());
    }, []);

    return { isLoggedIn, login, logout };
}