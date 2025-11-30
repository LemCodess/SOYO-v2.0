import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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
              <button className="navbar-btn navbar-btn-login" onClick={() => history.push('/login')}>
                Log In
              </button>
              <button className="navbar-btn navbar-btn-signup" onClick={() => history.push('/signup')}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button className="navbar-btn navbar-btn-write" onClick={() => history.push('/write')}>
                Write
              </button>
              <button className="navbar-btn navbar-btn-profile" onClick={() => history.push('/profile')}>
                Profile
              </button>
              <button className="navbar-btn navbar-btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
