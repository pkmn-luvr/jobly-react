import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import FormComponent from './Forms';

const ProfileEdit = () => {
    const { currentUser, updateUser } = useUser();
    const [userData, setUserData] = useState({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        email: currentUser?.email || ''
    });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        console.log("Current user updated:", currentUser);
        setUserData({
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            email: currentUser?.email || ''
        });
    }, [currentUser]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsUpdating(true);

        try {
            await updateUser(userData);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile!');
        } finally {
            setIsUpdating(false);
        }
    };

    const inputs = [
        { label: 'Username:', type: 'text', name: 'username', value: currentUser?.username || '', disabled: true },
        { label: 'First Name:', type: 'text', name: 'firstName', value: userData.firstName, onChange: handleChange },
        { label: 'Last Name:', type: 'text', name: 'lastName', value: userData.lastName, onChange: handleChange },
        { label: 'Email:', type: 'email', name: 'email', value: userData.email, onChange: handleChange }
    ];

    return <FormComponent title="Edit Profile" inputs={inputs} handleSubmit={handleSubmit} />;
};

export default ProfileEdit;