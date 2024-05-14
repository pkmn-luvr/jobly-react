import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { UserProvider } from '../../contexts/UserContext';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode');

const CompaniesComponent = () => <div>Companies Page</div>;

const renderWithRouter = async (ui, { route = '/', token = null } = {}) => {
    window.history.pushState({}, 'Test page', route);

    if (token) {
        jwtDecode.mockImplementation(() => ({ username: 'authorizedUser', exp: Date.now() / 1000 + 1000 }));
        localStorage.setItem('token', token);
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

    await waitFor(() => {}); // Wait for any effects to run
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

        // Add a delay to ensure the context updates
        await new Promise((r) => setTimeout(r, 100));

        await waitFor(() => expect(screen.getByText('Companies Page')).toBeInTheDocument());
    });
});
