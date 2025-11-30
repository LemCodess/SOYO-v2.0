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
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/user/login', {
        email: email.trim(),
        password
      });

      console.log('Login response:', response.data);

      if (response.status === 200) {
        // Store the token, userId, and userName in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.userName);

        // Update the state
        setSuccess('Login successful! Redirecting...');
        setError('');
        setIsLoggedIn(true);
        setName(response.data.userName);

        // Redirect to homepage
        setTimeout(() => {
          history.push('/');
        }, 800);
      }
    } catch (error) {
      console.error('Login error:', error);

      // Extract error message from server response
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.error ||
                            error.response.data?.message ||
                            'Login failed. Please check your credentials.';
        setError(errorMessage);
      } else if (error.request) {
        // Request made but no response
        setError('No response from server. Please check your connection.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form">
        <h2>Welcome Back</h2>
        <p style={{ color: '#718096', marginBottom: '24px', fontSize: '14px' }}>
          Log in to continue to SOYO
        </p>
        <form onSubmit={handleLoginClick}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}
          {success && <div className="success-message">✓ {success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
            Sign Up
          </Link>
        </p>
        <p style={{ marginTop: '12px', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#718096', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
