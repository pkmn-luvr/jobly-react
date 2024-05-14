import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import Navigation from '../Navigation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../../contexts/UserContext');

describe('Navigation', () => {
  let mockLogout;
  let mockNavigate;

  beforeEach(() => {
    mockLogout = jest.fn();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    useUser.mockReturnValue({ currentUser: null, logout: mockLogout });
  });

  test('renders login and signup links when not authenticated', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  test('renders home, companies, jobs, profile, and logout when authenticated', () => {
    useUser.mockReturnValue({ currentUser: { username: 'testuser' }, logout: mockLogout });

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();

    // Click on the user dropdown to open it
    fireEvent.click(screen.getByText('testuser'));

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('logout redirects to login page', () => {
    useUser.mockReturnValue({ currentUser: { username: 'testuser' }, logout: mockLogout });

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('testuser'));

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
