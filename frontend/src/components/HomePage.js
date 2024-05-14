import React from 'react';
import { useUser } from '../contexts/UserContext';

const HomePage = () => {
  const { currentUser } = useUser(); 

  console.log(currentUser);  

  return (
    <div>
      <h1>Jobly</h1>
      <p>All jobs in one, convenient place.</p>
      {currentUser && <p>Welcome back, {currentUser.firstName || 'User'}!</p>}
    </div>
  );
};

export default HomePage;
