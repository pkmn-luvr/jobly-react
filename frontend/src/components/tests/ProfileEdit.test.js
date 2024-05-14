import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ProfileEdit from '../ProfileEdit';
import { useUser } from '../../contexts/UserContext';

jest.mock('../../contexts/UserContext', () => ({
    useUser: jest.fn()
}));

describe('ProfileEdit', () => {
    const mockUpdateUser = jest.fn();
    const currentUser = {
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
    };

    beforeEach(() => {
        useUser.mockReturnValue({
            currentUser,
            updateUser: mockUpdateUser
        });
        jest.clearAllMocks();
        window.alert = jest.fn(); 
    });

    test('renders without crashing', () => {
        render(<ProfileEdit />);
        expect(screen.getByRole('heading', { name: 'Edit Profile' })).toBeInTheDocument();
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    });

    test('handles form submission correctly', async () => {
        mockUpdateUser.mockResolvedValue({ message: "Profile updated successfully!" });
        render(<ProfileEdit />);
        fireEvent.change(screen.getByLabelText("First Name:"), { target: { value: 'Jane' } });
        fireEvent.change(screen.getByLabelText("Last Name:"), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText("Email:"), { target: { value: 'jane@example.com' } });
        fireEvent.submit(screen.getByRole('button', { name: "Edit Profile" }));

        await waitFor(() => expect(mockUpdateUser).toHaveBeenCalledWith({
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com'
        }));
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Profile updated successfully!"));
    });

    test('updates state on input changes', () => {
        const { getByLabelText } = render(<ProfileEdit />);
        const firstNameInput = getByLabelText('First Name:');
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
        expect(firstNameInput.value).toBe('Jane');
    });

    test('displays an error message on API call failure', async () => {
        mockUpdateUser.mockRejectedValue(new Error("Failed to update profile!"));
        
        render(<ProfileEdit />);
        fireEvent.change(screen.getByLabelText("First Name:"), { target: { value: 'Jane' } });
        fireEvent.change(screen.getByLabelText("Last Name:"), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText("Email:"), { target: { value: 'jane@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));

        await waitFor(() => expect(mockUpdateUser).toHaveBeenCalled());
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Failed to update profile!"));
    });
});
