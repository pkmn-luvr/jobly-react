import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { UserProvider } from '../../contexts/UserContext';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode');

const CompaniesComponent = () => <div>Companies Page</div>;
const LoginComponent = () => <div>Login Page</div>;

const renderWithRouter = ({ route = '/', token = null } = {}) => {
    if (token) {
        jwtDecode.mockImplementation(() => ({ username: 'authorizedUser', exp: Date.now() / 1000 + 1000 }));
        localStorage.setItem('token', token);
    }

    return render(
        <UserProvider>
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route index element={<div>Home Page</div>} />
                    </Route>
                    <Route path="/companies" element={<ProtectedRoute />}>
                        <Route index element={<CompaniesComponent />} />
                    </Route>
                    <Route path="/login" element={<LoginComponent />} />
                </Routes>
            </MemoryRouter>
        </UserProvider>
    );
};

describe('ProtectedRoute', () => {
    afterEach(() => {
        localStorage.clear();
        jest.resetAllMocks();
    });

    test('redirects to login if not authenticated', async () => {
        renderWithRouter({ route: '/companies' });
        await waitFor(() => expect(screen.getByText('Login Page')).toBeInTheDocument());
    });

    test('renders companies page if authenticated', async () => {
        renderWithRouter({ route: '/companies', token: 'validTokenForAuthorizedUser' });
        
        await waitFor(() => {
            expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
            expect(screen.getByText('Companies Page')).toBeInTheDocument();
        });
    });
});
