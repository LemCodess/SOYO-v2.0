import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Story.css';

const Story = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        // Make Authorization header optional for public access
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:5000/api/stories/${id}`, {
          headers,
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        console.log('Fetched story data:', result);
        setStory(result);
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };

    fetchStory();
  }, [id]); 

  return (
    <div className="story-reader-container">
      {story ? (
        <>
          <h2>Title</h2>
          <ReactQuill value={story.topicName} readOnly={true} theme="bubble" />
          <h2>Description</h2>
          <ReactQuill value={story.description} readOnly={true} theme="bubble" />
          <div className="chapter-content">
            <h2>Chapter</h2>
            <p>{story.chapters}</p>
          </div>
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Story;
