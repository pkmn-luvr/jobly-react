import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import FormComponent from './Forms';


const Login = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({ ...prevCredentials, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(credentials);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed! Please check your username and password.');
        }
    };

    const inputs = [
        { label: 'Username:', type: 'text', name: 'username', value: credentials.username, onChange: handleChange },
        { label: 'Password:', type: 'password', name: 'password', value: credentials.password, onChange: handleChange }
    ];

    return <FormComponent title="Log In" inputs={inputs} handleSubmit={handleSubmit} />;
};

export default Login;
