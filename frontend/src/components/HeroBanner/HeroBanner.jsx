import React from 'react';
import { useHistory } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = ({ isLoggedIn }) => {
  const history = useHistory();

  const handleStartReading = () => {
    // Scroll to stories section
    const storiesSection = document.getElementById('stories-section');
    if (storiesSection) {
      storiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartWriting = () => {
    if (isLoggedIn) {
      history.push('/write');
    } else {
      history.push('/signup');
    }
  };

  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h1 className="hero-title">Discover Stories, Share Yours</h1>
        <p className="hero-subtitle">
          Where every imagination finds its voice. Read thousands of stories or create your own masterpiece.
        </p>
        <div className="hero-actions">
          <button className="hero-btn hero-btn-primary" onClick={handleStartReading}>
            Start Reading
          </button>
          <button className="hero-btn hero-btn-secondary" onClick={handleStartWriting}>
            {isLoggedIn ? 'Start Writing' : 'Join Now'}
          </button>
        </div>
      </div>
      <div className="hero-decoration">
        <div className="floating-card card-1"></div>
        <div className="floating-card card-2"></div>
        <div className="floating-card card-3"></div>
      </div>
    </div>
  );
};

export default HeroBanner;
