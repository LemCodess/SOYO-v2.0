import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Writing.css';
import { Input, Button } from '../../components/UI';

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
              <Input
                label="Story Title"
                id="topicName"
                type="text"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="Enter your story title..."
                required
                helperText="Choose a captivating title for your story"
                leftIcon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                }
              />
            </div>

            <div className="form-group">
              <Input
                label="Description"
                id="description"
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your story is about..."
                required
                helperText="Write a brief summary to attract readers"
                leftIcon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                }
              />
            </div>
          </div>

          {/* Classification Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-number">2</span>
              Classification
            </h2>

            <div className="form-group">
              <label htmlFor="category" className="custom-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                className="custom-select"
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
              <Input
                label="Tags"
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="adventure, magic, friendship..."
                required
                helperText="Add relevant tags to help readers find your story"
                leftIcon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="language" className="custom-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                Language <span className="required">*</span>
              </label>
              <select
                id="language"
                className="custom-select"
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
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              }
            >
              Next: Write Content
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => history.push('/')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Writing;
