import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Chapters.css';
import axios from 'axios';
import { Input, Button } from '../../components/UI';

const Chapters = () => {
  const location = useLocation();
  const history = useHistory();
  const { storyData } = location.state || {};

  const [chapters, setChapters] = useState(storyData?.chapters || '');
  const [styledTitle, setStyledTitle] = useState(storyData?.topicName || '');
  const [styledDescription, setStyledDescription] = useState(storyData?.description || '');
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(storyData?.coverImage || null);
  const [error, setError] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Disable toolbar for title and description - plain text only
  const titleModules = { toolbar: false };
  const descriptionModules = { toolbar: false };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handleSaveOrPublish = async (status) => {
    const formData = new FormData();

    // Add all story data to FormData
    formData.append('topicName', styledTitle);
    formData.append('description', styledDescription);
    formData.append('category', storyData?.category || '');
    formData.append('tags', storyData?.tags || '');
    formData.append('language', storyData?.language || '');
    formData.append('chapters', chapters);
    formData.append('status', status);

    if (storyData?._id) {
      formData.append('_id', storyData._id);
    }

    // Add cover image if selected
    if (coverImage) {
      formData.append('cover', coverImage);
    }

    try {
      setUploadingCover(true);
      const response = await axios.post('/api/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
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
    } finally {
      setUploadingCover(false);
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
          {/* Cover Image Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-number">1</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Cover Image (Optional)
            </h2>

            <div className="form-group">
              <label htmlFor="coverImage" className="custom-label">
                Story Cover
              </label>
              {coverPreview ? (
                <div className="cover-preview-container">
                  <img src={coverPreview} alt="Cover preview" className="cover-preview" />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleRemoveCover}
                    leftIcon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    }
                  >
                    Remove Cover
                  </Button>
                </div>
              ) : (
                <div className="cover-upload-area">
                  <label htmlFor="cover-input" className="cover-upload-label">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="upload-icon-svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <p>Click to upload cover image</p>
                    <p className="upload-hint">Recommended: 1000x1000px, max 5MB</p>
                  </label>
                  <input
                    id="cover-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleCoverImageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Title & Description Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-number">2</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              Story Details
            </h2>

            <div className="form-group">
              <label htmlFor="styledTitle" className="custom-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M10 3v18M14 3v18"></path>
                </svg>
                Title <span className="required">*</span>
              </label>
              <div className="quill-editor-wrapper">
                <ReactQuill
                  id="styledTitle"
                  theme="snow"
                  value={styledTitle}
                  onChange={setStyledTitle}
                  modules={titleModules}
                  placeholder="Enter your story title..."
                />
              </div>
              <p className="form-hint">Keep it simple and captivating</p>
            </div>

            <div className="form-group">
              <label htmlFor="styledDescription" className="custom-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="17" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="17" y1="18" x2="3" y2="18"></line>
                </svg>
                Description <span className="required">*</span>
              </label>
              <div className="quill-editor-wrapper">
                <ReactQuill
                  id="styledDescription"
                  theme="snow"
                  value={styledDescription}
                  onChange={setStyledDescription}
                  modules={descriptionModules}
                  placeholder="Describe your story in a few sentences..."
                />
              </div>
              <p className="form-hint">Write a brief summary to attract readers</p>
            </div>
          </div>

          {/* Chapter Content Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-number">3</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
              Chapter Content
            </h2>

            <div className="form-group">
              <Input
                label="Your Story"
                id="chapters"
                type="textarea"
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
                placeholder="Start writing your story here..."
                required
                helperText="Write your chapter content. Let your creativity flow!"
                leftIcon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <Button
              type="button"
              variant="success"
              size="lg"
              fullWidth
              onClick={() => handleSaveOrPublish('draft')}
              disabled={uploadingCover}
              loading={uploadingCover}
              leftIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
              }
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => handleSaveOrPublish('published')}
              disabled={uploadingCover}
              loading={uploadingCover}
              rightIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              }
            >
              Publish Story
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => history.push('/write')}
              leftIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5"></path>
                  <path d="M12 19l-7-7 7-7"></path>
                </svg>
              }
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chapters;
