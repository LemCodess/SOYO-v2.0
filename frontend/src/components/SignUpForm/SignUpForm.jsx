import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './SignUpForm.css';
import axios from 'axios';
import toast from '../../utils/toast';

const SignUpForm = ({ setIsLoggedIn, setName: setGlobalName }) => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    if (password.length < 8) return 'Password must be at least 8 characters long';

    return null;
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/user/signup', {
        name: name.trim(),
        email: email.trim(),
        password
      });

      console.log('Signup response:', response.data);

      if (response.status === 201) {
        // Store user data and token in localStorage (auto-login)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.userName);

        // Update auth state
        setIsLoggedIn(true);
        setGlobalName(response.data.userName);

        // Show success toast
        toast.success('Account created successfully! Welcome to SOYO!');

        setSuccess('Account created successfully! Redirecting...');
        setError('');

        // Redirect to home page
        setTimeout(() => {
          history.push('/');
        }, 800);
      }
    } catch (error) {
      console.error('Signup error:', error);

      // Extract error message from server response
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.error ||
                            error.response.data?.message ||
                            'Signup failed. Please try again.';
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
    <div className="signup-page-container">
      <div className="sign-up-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSignUpClick}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
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
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="password-instructions">
              Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.
            </p>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}
          {success && <div className="success-message">✓ {success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
            Log In
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

export default SignUpForm;
