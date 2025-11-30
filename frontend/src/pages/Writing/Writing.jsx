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
      <h1>Create a New Story</h1>
      <form onSubmit={handleNext} className="writing-form">
        <div className="form-group">
          <label htmlFor="topicName">Topic Name</label>
          <input
            type="text"
            id="topicName"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select Category</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Fanfiction">Fanfiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
            <option value="Humor">Humor</option>
            <option value="Mystery">Mystery</option>
            <option value="Poetry">Poetry</option>
            <option value="Romance">Romance</option>
            <option value="Science fiction">Science fiction</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          >
            <option value="" disabled>Select Language</option>
            <option value="English">English</option>
            <option value="Bangla">Bangla</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">
             Next
          </button>
          <button type="button" className="cancel-btn" onClick={() => history.push('/')}>
             Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Writing;
