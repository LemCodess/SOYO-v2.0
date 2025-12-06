import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Button from '../UI/Button';
import './Navbar.css';
import { assets } from '../../assets/assets';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const history = useHistory();
  const location = useLocation();

  const handleNavigation = (path) => {
    history.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('greetingShown');
    setIsLoggedIn(false);
    history.push('/');
  };

  return (
    <nav className='navbar-container'>
      <div className='navbar-content'>
        <div className='navbar-left'>
          <img
            src={assets.logo}
            alt="SOYO"
            className='navbar-logo'
            onClick={() => handleNavigation('/')}
          />
        </div>

        <ul className="navbar-menu">
          <li
            onClick={() => handleNavigation('/')}
            className={location.pathname === '/' ? "active" : ""}
          >
            Home
          </li>
          <li onClick={() => handleNavigation('/')}>
            Discover
          </li>
        </ul>

        <div className="navbar-actions">
          {!isLoggedIn ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => history.push('/login')}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => history.push('/signup')}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => history.push('/profile')}
                leftIcon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                }
              >
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="navbar-logout-btn"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
