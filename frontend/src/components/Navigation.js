import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './styles/navigation.css';

const Navigation = () => {
    const { currentUser, logout } = useUser();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Jobly</Link>
            </div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/companies" className="nav-link">Companies</Link>
                </li>
                <li className="nav-item">
                    <Link to="/jobs" className="nav-link">Jobs</Link>
                </li>
                {currentUser ? (
                    <>
                        <li className="nav-item dropdown">
                            <span className="nav-link" onClick={toggleDropdown}>
                                <FontAwesomeIcon icon={faUser} />  {currentUser.username}
                            </span>
                            {dropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li className="dropdown-item">
                                        <Link to="/profile" className="dropdown-link">Profile</Link>
                                    </li>
                                    <li className="dropdown-item">
                                        <button onClick={handleLogout} className="dropdown-link">Logout</button>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </>
                ) : (
                    <>
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/signup" className="nav-link">Signup</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;
