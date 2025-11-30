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
        if (status === 'published') {
          history.push('/'); // Redirect to home after publishing
        } else if (status === 'draft') {
          alert('Draft saved successfully!');
          history.push('/profile'); // Redirect to profile after saving draft
        }
      } else {
        console.error('Error submitting story:', response.data.error);
        alert('Error occurred while saving the story. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to save the story. Please try again later.');
    }
  };

  return (
    <div className="chapter-writing-container">
      <h1>Write Your Chapter</h1>
      <form className="chapter-writing-form">
        <div className="form-group">
          <label htmlFor="styledTitle">Title</label>
          <ReactQuill 
            id="styledTitle"
            theme="snow"
            value={styledTitle}
            onChange={setStyledTitle}
            modules={titleModules}
          />
        </div>

        <div className="form-group">
          <label htmlFor="styledDescription">Description</label>
          <ReactQuill 
            id="styledDescription"
            theme="snow"
            value={styledDescription}
            onChange={setStyledDescription}
            modules={descriptionModules}
          />
        </div>

        <div className="form-group">
          <label htmlFor="chapters">Chapter Content</label>
          <textarea
            id="chapters"
            value={chapters}
            onChange={(e) => setChapters(e.target.value)}
            required
          />
        </div>

        <div className="button-group">
          <button
            type="button"
            className="submit-btn"
            onClick={() => handleSaveOrPublish('draft')}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="submit-btn"
            onClick={() => handleSaveOrPublish('published')}
          >
            Publish
          </button>
          <button type="button" className="cancel-btn" onClick={() => history.push('/write')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chapters;
