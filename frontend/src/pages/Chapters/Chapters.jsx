import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import './Chapters.css';
import axios from 'axios';

const Chapters = () => {
  const location = useLocation();
  const history = useHistory();
  const { storyData } = location.state || {};

  const [chapters, setChapters] = useState(storyData?.chapters || '');
  const [styledTitle, setStyledTitle] = useState(storyData?.topicName || '');
  const [styledDescription, setStyledDescription] = useState(storyData?.description || '');
  const [error, setError] = useState(null);

  // Toolbar options for title and description
  const titleModules = { toolbar: [['bold', 'italic', 'underline', 'clean']] };
  const descriptionModules = { toolbar: [['bold', 'italic', 'underline', 'clean']] };

  const handleSaveOrPublish = async (status) => {
    const chapterData = {
      ...storyData,
      topicName: styledTitle,
      description: styledDescription,
      chapters,
      status,  // Either 'draft' or 'published'
    };

    try {
      const response = await axios.post('/api/stories', chapterData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Handle both 200 (update) and 201 (create) statuses
      if (response.status === 200 || response.status === 201) {
        const isUpdate = response.status === 200;

        if (status === 'published') {
          alert(isUpdate ? 'Story updated and published successfully!' : 'Story published successfully!');
          history.push('/'); // Redirect to home after publishing
        } else if (status === 'draft') {
          alert(isUpdate ? 'Draft updated successfully!' : 'Draft saved successfully!');
          history.push('/profile'); // Redirect to profile after saving draft
        }
      } else {
        console.error('Error submitting story:', response.data.error);
        alert('Error occurred while saving the story. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save the story. Please try again later.');
    }
  };

  return (
    <div className="chapters-container">
      <div className="chapters-content">
        {/* Header */}
        <div className="chapters-header">
          <h1 className="chapters-title">Write Your Content</h1>
          <p className="chapters-subtitle">Bring your story to life</p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-step">
            <div className="progress-circle completed">✓</div>
            <span className="progress-label">Story Details</span>
          </div>
          <span className="progress-arrow">→</span>
          <div className="progress-step">
            <div className="progress-circle active">2</div>
            <span className="progress-label">Write Content</span>
          </div>
        </div>

        {/* Form */}
        <form className="chapters-form">
          {/* Title & Description Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-number">1</span>
              Style Your Story
            </h2>

            <div className="form-group">
              <label htmlFor="styledTitle">
                Styled Title <span className="required">*</span>
              </label>
              <div className="quill-editor-wrapper">
                <ReactQuill
                  id="styledTitle"
                  theme="snow"
                  value={styledTitle}
                  onChange={setStyledTitle}
                  modules={titleModules}
                  placeholder="Add formatting to your title..."
                />
              </div>
              <p className="form-hint">Use bold, italic, or underline to make your title stand out</p>
            </div>

            <div className="form-group">
              <label htmlFor="styledDescription">
                Styled Description <span className="required">*</span>
              </label>
              <div className="quill-editor-wrapper">
                <ReactQuill
                  id="styledDescription"
                  theme="snow"
                  value={styledDescription}
                  onChange={setStyledDescription}
                  modules={descriptionModules}
                  placeholder="Add formatting to your description..."
                />
              </div>
              <p className="form-hint">Format your description to make it more engaging</p>
            </div>
          </div>

          {/* Chapter Content Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-number">2</span>
              Chapter Content
            </h2>

            <div className="form-group">
              <label htmlFor="chapters">
                Your Story <span className="required">*</span>
              </label>
              <textarea
                id="chapters"
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
                placeholder="Start writing your story here..."
                required
              />
              <p className="form-hint">Write your chapter content. Let your creativity flow!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button
              type="button"
              className="draft-btn"
              onClick={() => handleSaveOrPublish('draft')}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="submit-btn"
              onClick={() => handleSaveOrPublish('published')}
            >
              Publish Story
            </button>
            <button type="button" className="cancel-btn" onClick={() => history.push('/write')}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chapters;
