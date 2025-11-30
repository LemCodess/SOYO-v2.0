import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './SignUpForm.css';
import axios from 'axios';

const SignUpForm = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUpClick = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/user/signup', { name, email, password });
      console.log('Received response:', response.data);

      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        setSuccess('Sign up successful! Redirecting to login...');
        setError('');

        // Redirect to login page after successful signup
        setTimeout(() => {
          history.push('/login');
        }, 1500);
      } else {
        setError(response.data.error);
        setSuccess('');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
      setSuccess('');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="sign-up-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUpClick}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="password-instructions">
              Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.
            </p>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit">Sign Up</button>
        </form>
        <p style={{ marginTop: '10px', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Login
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

export default SignUpForm;
