import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = ({ setIsLoggedIn, setName }) => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/login', { email, password });
      console.log('Received response:', response.data);

      if (response.status === 200) {
        // Store the token, userId, and userName in localStorage for persistence
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.userName);

        // Update the state with login success and user information
        setSuccess('Login successful!');
        setError('');
        setIsLoggedIn(true);
        setName(response.data.userName);

        // Redirect to the homepage
        setTimeout(() => {
          history.push('/');
        }, 500);
      } else {
        // Handle login failure
        setError(response.data.error || 'Login failed. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      // Handle any other errors (e.g., network or server errors)
      setError('Login failed. Please try again.');
      setSuccess('');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLoginClick}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password:"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit">Login</button>
        </form>
        <p style={{ marginTop: '10px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Sign Up
          </Link>
        </p>
        <p style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
