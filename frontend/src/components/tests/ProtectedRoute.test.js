import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { UserProvider } from '../../contexts/UserContext'; 
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn()
}));

const CompaniesComponent = () => <div>Companies Page</div>;

const renderWithRouter = async (ui, { route = '/', token = null } = {}) => {
    window.history.pushState({}, 'Test page', route);
    jwtDecode.mockImplementation(token => {
        if (token === 'validTokenForAuthorizedUser') {
            return { username: 'authorizedUser', exp: Date.now() / 1000 + 1000 };
        }
        return null;
    });

    if (token) {
        const encodedToken = btoa(JSON.stringify({ username: 'authorizedUser', exp: Date.now() / 1000 + 1000 }));
        localStorage.setItem('token', encodedToken);
    }

    const result = render(
        <UserProvider>
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route index element={<div>Home Page</div>} />
                    </Route>
                    <Route path="/companies" element={<ProtectedRoute />}>
                        <Route index element={<CompaniesComponent />} />
                    </Route>
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        </UserProvider>
    );

    await waitFor(() => {});
    return result;
};

describe('ProtectedRoute', () => {
    afterEach(() => {
        localStorage.clear();
        jest.resetAllMocks();
    });

    test('redirects to login if not authenticated', async () => {
        await renderWithRouter(<ProtectedRoute />, { route: '/companies' });
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    test('renders companies page if authenticated', async () => {
        await renderWithRouter(<ProtectedRoute />, { route: '/companies', token: 'validTokenForAuthorizedUser' });
        await waitFor(() => expect(screen.queryByText('Companies Page')).toBeInTheDocument());
    });
});