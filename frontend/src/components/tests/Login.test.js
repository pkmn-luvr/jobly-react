import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Login from '../Login';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

jest.mock('../../contexts/UserContext', () => ({
    useUser: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}));

describe('Login', () => {
    let mockLogin;
    let mockNavigate;

    beforeEach(() => {
        mockLogin = jest.fn();
        mockNavigate = jest.fn();
        useUser.mockReturnValue({ login: mockLogin });
        useNavigate.mockReturnValue(mockNavigate);
        window.alert = jest.fn(); 
    });

    test('renders without crashing', () => {
        render(<Login />);
        expect(screen.getByRole('heading', { name: "Log In" })).toBeInTheDocument();
        expect(screen.getByLabelText("Username:")).toBeInTheDocument();
        expect(screen.getByLabelText("Password:")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "Log In" })).toBeInTheDocument();
    });

    test('submits the form and calls login function with credentials', async () => {
        render(<Login />);
        fireEvent.change(screen.getByLabelText("Username:"), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText("Password:"), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: "Log In" }));

        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' }));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('displays an alert on failed login', async () => {
        mockLogin.mockRejectedValue(new Error('Login failed'));
        render(<Login />);
        fireEvent.click(screen.getByRole('button', { name: "Log In" }));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Login failed! Please check your username and password.'));
    });
});
