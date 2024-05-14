import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../HomePage'; 
import { UserProvider, useUser } from '../../contexts/UserContext'; 

jest.mock('../../contexts/UserContext', () => {
    const originalModule = jest.requireActual('../../contexts/UserContext');
    return {
      ...originalModule,
      useUser: jest.fn()
    };
  });
  
  describe('HomePage', () => {
    it('renders without crashing', () => {
      useUser.mockReturnValue({
        currentUser: { firstName: 'Marissa' }
      });
      render(
        <UserProvider>
          <HomePage />
        </UserProvider>
      );
      expect(screen.getByText('Jobly')).toBeInTheDocument();
      expect(screen.getByText('All jobs in one, convenient place.')).toBeInTheDocument();
      expect(screen.getByText('Welcome back, Marissa!')).toBeInTheDocument();
    });
  
    it('renders without user', () => {
      useUser.mockReturnValue({
        currentUser: null
      });
      render(
        <UserProvider>
          <HomePage />
        </UserProvider>
      );
      expect(screen.queryByText('Welcome back,')).not.toBeInTheDocument();
    });
  });