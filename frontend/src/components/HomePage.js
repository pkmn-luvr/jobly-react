import React from 'react';
import { useUser } from '../contexts/UserContext';
import './styles/HomePage.css';


function HomePage() {
  const { currentUser } = useUser();

  return (
      <div className="homepage">
          <h1>Jobly</h1>
          <p>All jobs in one, convenient place.</p>
          {currentUser && (
              <p className="welcome-message">Welcome back, {currentUser.firstName}!</p>
          )}
      </div>
  );
}

export default HomePage;
