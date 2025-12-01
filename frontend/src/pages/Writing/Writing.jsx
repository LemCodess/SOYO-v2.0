import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Writing.css';

const Writing = () => {
  const [topicName, setTopicName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [language, setLanguage] = useState('');
  const history = useHistory();

  const handleNext = (e,status) => {
    e.preventDefault();
    
    const storyData = {
      topicName,
      description,
      category,
      tags,
      language,
      status
    };

    // Pass story data to the Chapters page
    history.push('/chapters', { storyData });
  };

  return (
    <div className="writing-container">
      <div className="writing-content">
        {/* Header */}
        <div className="writing-header">
          <h1 className="writing-title">Create Your Story</h1>
          <p className="writing-subtitle">Share your imagination with the world</p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-step">
            <div className="progress-circle active">1</div>
            <span className="progress-label">Story Details</span>
          </div>
          <span className="progress-arrow">→</span>
          <div className="progress-step">
            <div className="progress-circle inactive">2</div>
            <span className="progress-label inactive">Write Content</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleNext} className="writing-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-number">1</span>
              Basic Information
            </h2>

            <div className="form-group">
              <label htmlFor="topicName">
                Story Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="topicName"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="Enter your story title..."
                required
              />
              <p className="form-hint">Choose a captivating title for your story</p>
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your story is about..."
                required
              />
              <p className="form-hint">Write a brief summary to attract readers</p>
            </div>
          </div>

          {/* Classification Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-number">2</span>
              Classification
            </h2>

            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Fanfiction">Fanfiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Humor">Humor</option>
                <option value="Mystery">Mystery</option>
                <option value="Poetry">Poetry</option>
                <option value="Romance">Romance</option>
                <option value="Science fiction">Science Fiction</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">
                Tags <span className="required">*</span>
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="adventure, magic, friendship..."
                required
              />
              <p className="form-hint">Add relevant tags to help readers find your story</p>
            </div>

            <div className="form-group">
              <label htmlFor="language">
                Language <span className="required">*</span>
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
              >
                <option value="" disabled>Select language</option>
                <option value="English">English</option>
                <option value="Bangla">Bangla</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button type="submit" className="submit-btn">
              Next: Write Content
            </button>
            <button type="button" className="cancel-btn" onClick={() => history.push('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Writing;
