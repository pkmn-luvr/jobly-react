import React, { useState, useEffect } from 'react';
import './App.css';
import AppRoutes from './Routes';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { UserProvider } from './contexts/UserContext';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));  // Define the token state

    // Effect to decode user from token if token exists
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        console.log("Retrieved token:", storedToken);  // Log token retrieval
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                console.log("Decoded token:", decoded);  // Log decoded token
                setCurrentUser(decoded);
            } catch (error) {
                console.log("Error decoding token:", error);
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null);
        }
    }, [token]);  // Depend on token to re-run effect when it changes

    // Login function to authenticate user and set token
    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:3001/auth/login', credentials);
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    // Signup function to register user and set token
    const signup = async (userData) => {
        try {
            const response = await axios.post('http://localhost:3001/auth/register', userData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    // Logout function to clear user session
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
    };

    return (
        <UserProvider value={{ currentUser, login, logout, signup }}>
            <div className="App">
                <AppRoutes />
            </div>
        </UserProvider>
    );
}

export default App;
