import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { UserProvider, useUser } from './UserContext';
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';

jest.mock('jwt-decode');
jest.mock('axios');

const TestComponent = () => {
  const { currentUser, login, logout, signup, updateUser } = useUser();

  console.log("Current User in TestComponent:", currentUser);

  return (
    <div>
      <div>{currentUser ? currentUser.username : 'No User'}</div>
      <button onClick={() => login({ username: 'testuser', password: 'password' })}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => signup({ username: 'newuser', password: 'password' })}>Signup</button>
      <button onClick={() => updateUser({ firstName: 'Updated' })}>Update User</button>
    </div>
  );
};

describe('UserContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should set currentUser based on token', async () => {
    const token = 'validTokenForAuthorizedUser';
    jwtDecode.mockReturnValue({ username: 'authorizedUser', exp: Date.now() / 1000 + 1000 });
    localStorage.setItem('token', token);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    console.log('Token in localStorage:', localStorage.getItem('token')); // Add logging
    await waitFor(() => expect(screen.getByText('authorizedUser')).toBeInTheDocument());
  });

  test('should handle login', async () => {
    const token = 'validTokenForAuthorizedUser';
    const decodedToken = { username: 'testuser', exp: Date.now() / 1000 + 1000 };
    jwtDecode.mockReturnValue(decodedToken);
    axios.post.mockResolvedValue({ data: { token } });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());
    expect(localStorage.getItem('token')).toBe(token); 
  });

  test('should handle logout', async () => {
    const token = 'validTokenForAuthorizedUser';
    jwtDecode.mockReturnValue({ username: 'testuser', exp: Date.now() / 1000 + 1000 });
    localStorage.setItem('token', token);
  
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
  
    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());
  
    act(() => {
      screen.getByText('Logout').click();
    });
  
    await waitFor(() => expect(screen.getByText('No User')).toBeInTheDocument());
    expect(localStorage.getItem('token')).toBe(null); 
  });  

  test('should handle signup', async () => {
    const token = 'validTokenForNewUser';
    const decodedToken = { username: 'newuser', exp: Date.now() / 1000 + 1000 };
    jwtDecode.mockReturnValue(decodedToken);
    axios.post.mockResolvedValue({ data: { token } });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    act(() => {
      screen.getByText('Signup').click();
    });

    await waitFor(() => expect(screen.getByText('newuser')).toBeInTheDocument());
    expect(localStorage.getItem('token')).toBe(token);
  });

  test('should handle updateUser', async () => {
    const token = 'validTokenForAuthorizedUser';
    const decodedToken = { username: 'testuser', exp: Date.now() / 1000 + 1000 };
    jwtDecode.mockReturnValue(decodedToken);
    localStorage.setItem('token', token);
    axios.patch.mockResolvedValue({ data: { username: 'testuser', firstName: 'Updated' } });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());

    act(() => {
      screen.getByText('Update User').click();
    });

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());
  });
});
