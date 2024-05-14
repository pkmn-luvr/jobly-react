import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Signup from '../Signup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}));

jest.mock('../../contexts/UserContext', () => ({
    useUser: jest.fn(() => ({ setCurrentUser: jest.fn() })) 
}));

describe('Signup', () => {
    let mockSetCurrentUser;
    let mockNavigate;

    beforeAll(() => {
        const localStorageMock = {
            getItem: function(key) {
                return this.store[key] || null;
            },
            setItem: jest.fn(function(key, value) {
                this.store[key] = value.toString();
            }),
            clear: function() {
                this.store = {};
            },
            store: {}
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    });

    beforeEach(() => {
        mockNavigate = jest.fn();
        mockSetCurrentUser = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        useUser.mockReturnValue({ setCurrentUser: mockSetCurrentUser });
        localStorage.setItem.mockClear();
        window.alert = jest.fn(); 
    });

    test('submits the form and calls API with form data', async () => {
        axios.post.mockResolvedValue({ data: { token: 'fakeToken123', user: { username: 'testuser', firstName: 'Test', lastName: 'User' } } });
        render(<Signup />);
        fireEvent.change(screen.getByLabelText("Username:"), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText("Email:"), { target: { value: 'test@email.com' } });
        fireEvent.change(screen.getByLabelText("First Name:"), { target: { value: 'Test' } });
        fireEvent.change(screen.getByLabelText("Last Name:"), { target: { value: 'User' } });
    
        await fireEvent.submit(screen.getByRole('button', { name: "Sign Up" }));
    
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fakeToken123');
        expect(mockSetCurrentUser).toHaveBeenCalledWith({ username: 'testuser', firstName: 'Test', lastName: 'User' });
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    

    test('renders without crashing', () => {
        render(<Signup />);
        expect(screen.getByRole('heading', { name: "Sign Up" })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "Sign Up" })).toBeInTheDocument();
        expect(screen.getByLabelText("Username:")).toBeInTheDocument();
        expect(screen.getByLabelText("Password:")).toBeInTheDocument();
        expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    });

    test('shows an error message on API call failure', async () => {
        axios.post.mockRejectedValue({ response: { data: { message: "Registration failed" } } });
        render(<Signup />);
        fireEvent.change(screen.getByLabelText("Username:"), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText("Email:"), { target: { value: 'test@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: "Sign Up" }));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Registration failed: Registration failed"));
    });
});
