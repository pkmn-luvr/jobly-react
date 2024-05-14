import React, { createContext, useContext, useEffect, useState } from 'react';  
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import useLocalStorage from '../hooks/useLocalStorage'; 


const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useLocalStorage('token');

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const decoded = jwtDecode(token);
                    setCurrentUser(decoded);
                    console.log('Current user set to:', decoded);
                } catch (error) {
                    console.error('Error decoding token:', error);
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
        };
        fetchCurrentUser();
    }, [token]);
    

    const applyToJob = (username, jobId) => {
        try {
            const appliedJobs = JSON.parse(localStorage.getItem(`applied_jobs_${username}`)) || [];
            if (!appliedJobs.includes(jobId)) {
                appliedJobs.push(jobId);
                localStorage.setItem(`applied_jobs_${username}`, JSON.stringify(appliedJobs));
            }
        } catch (error) {
            throw error;
        }
    };
    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:3001/auth/token', credentials);
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            const decoded = jwtDecode(token);
            setCurrentUser(decoded); 
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null); 
        axios.defaults.headers.common['Authorization'] = null;
    };    

    const signup = async (userData) => {
        try {
            const response = await axios.post('http://localhost:3001/auth/register', userData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            const decoded = jwtDecode(token);
            setCurrentUser(decoded);
        } catch (error) {
            throw error;
        }
    };

    const updateUser = async (userData) => {
        if (!currentUser || !currentUser.username) {
            alert("You must be logged in to update your profile.");
            return;
        }
    
        console.log("Starting user update with data:", userData);
        try {
            const response = await axios.patch(`http://localhost:3001/users/${currentUser.username}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log("API response received:", response.data);
            const updatedUser = response.data;
            setCurrentUser(updatedUser); 
        } catch (error) {
            console.error("Failed to update user data", error.response ? error.response.data : error);
        }
        
    };

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, applyToJob, login, logout, signup, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
