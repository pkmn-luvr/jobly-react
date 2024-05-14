import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';  
import FormComponent from './Forms';


const Signup = () => {
    const { setCurrentUser } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.username || !formData.password || formData.password.length < 5 || !formData.email.includes('@')) {
            alert("Please fill out the form correctly.");
            return;
        }
        try {
            const registerResponse = await axios.post('http://localhost:3001/auth/register', formData);
            localStorage.setItem('token', registerResponse.data.token);
            setCurrentUser(registerResponse.data.user);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
            alert(`Registration failed: ${error.response?.data?.message || 'Please check your input.'}`);
        }
    };

    const inputs = [
        { label: 'Username:', type: 'text', name: 'username', value: formData.username, onChange: handleChange },
        { label: 'Password:', type: 'password', name: 'password', value: formData.password, onChange: handleChange },
        { label: 'First Name:', type: 'text', name: 'firstName', value: formData.firstName, onChange: handleChange },
        { label: 'Last Name:', type: 'text', name: 'lastName', value: formData.lastName, onChange: handleChange },
        { label: 'Email:', type: 'email', name: 'email', value: formData.email, onChange: handleChange }
    ];

    return <FormComponent title="Sign Up" inputs={inputs} handleSubmit={handleSubmit} />;
};

export default Signup;