import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './Story.css';

const Story = () => {
  const { id } = useParams();
  const history = useHistory();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make Authorization header optional for public access
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/stories/${id}`, {
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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="story-reader-container">
        <div className="story-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="story-reader-container">
        <div className="story-reader-content">
          <div className="story-error">
            <div className="error-icon">📖</div>
            <h2 className="error-title">Story Not Found</h2>
            <p className="error-message">We couldn't find the story you're looking for.</p>
            <button className="back-button" onClick={() => history.push('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if current user is the author
  const isAuthor = currentUserId && story.userId?._id === currentUserId;

  const handleEditStory = () => {
    history.push({
      pathname: '/chapters',
      state: { storyData: story }
    });
  };

  return (
    <div className="story-reader-container">
      <div className="story-reader-content">
        <div className="story-card">
          {/* Edit Button - Only visible to author */}
          {isAuthor && (
            <div className="story-actions">
              <button className="edit-story-btn" onClick={handleEditStory}>
                ✏️ Edit Story
              </button>
            </div>
          )}

          {/* Cover Image */}
          {story.coverImage && (
            <div className="story-cover-banner">
              <img src={story.coverImage} alt={story.topicName} />
            </div>
          )}

          {/* Story Header with Meta Info */}
          <div className="story-header">
            {story.category && (
              <div className="story-category-badge">{story.category}</div>
            )}

            <div className="story-meta">
              {story.userId?.name && (
                <div className="story-meta-item">
                  <span className="story-meta-icon">✍️</span>
                  <span>by {story.userId.name}</span>
                </div>
              )}
              {story.createdAt && (
                <div className="story-meta-item">
                  <span className="story-meta-icon">📅</span>
                  <span>{formatDate(story.createdAt)}</span>
                </div>
              )}
              {story.language && (
                <div className="story-meta-item">
                  <span className="story-meta-icon">🌐</span>
                  <span>{story.language}</span>
                </div>
              )}
              {story.tags && (
                <div className="story-meta-item">
                  <span className="story-meta-icon">🏷️</span>
                  <span>{story.tags}</span>
                </div>
              )}
            </div>
          </div>

          {/* Title Section */}
          <div className="story-title-section">
            <h3 className="story-section-label">Title</h3>
            <div
              className="story-title-display"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(story.topicName)
              }}
            />
          </div>

          {/* Description Section */}
          <div className="story-description-section">
            <h3 className="story-section-label">Description</h3>
            <div
              className="story-description-display"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(story.description)
              }}
            />
          </div>

          {/* Chapter Content */}
          {story.chapters && (
            <div className="chapter-content">
              <div className="chapter-header">
                <div className="chapter-icon">📚</div>
                <h3 className="chapter-title">Chapter</h3>
              </div>
              <p className="chapter-text">{story.chapters}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;
