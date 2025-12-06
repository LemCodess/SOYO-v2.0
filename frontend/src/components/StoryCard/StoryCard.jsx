import React from 'react';
import { useHistory } from 'react-router-dom';
import CategoryBadge from '../CategoryBadge/CategoryBadge';
import './StoryCard.css';

const StoryCard = ({ story }) => {
  const history = useHistory();

  const handleCardClick = () => {
    history.push(`/story/${story._id}`);
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const getDescription = () => {
    const desc = stripHtml(story.description || '');
    return desc.length > 150 ? desc.substring(0, 150) + '...' : desc;
  };

  const getTitle = () => {
    return stripHtml(story.topicName || 'Untitled Story');
  };

  // Calculate reading time (average 200 words per minute)
  const getReadingTime = () => {
    const content = stripHtml(story.chapterContent || '');
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes < 1 ? '< 1 min' : `${minutes} min read`;
  };

  // Generate category-based placeholder cover
  const getCoverGradient = (category) => {
    const gradients = {
      'Action': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Adventure': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Fanfiction': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'Fantasy': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Horror': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'Humor': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'Mystery': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'Poetry': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'Romance': 'linear-gradient(135deg, #ffecd2 30%, #fcb69f 100%)',
      'Science fiction': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    };
    return gradients[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  return (
    <div className="story-card" onClick={handleCardClick}>
      <div
        className="story-card-cover"
        style={
          story.coverImage
            ? { backgroundImage: `url(${story.coverImage})` }
            : { background: getCoverGradient(story.category) }
        }
      >
        <div className="story-card-category-overlay">
          <CategoryBadge category={story.category} />
        </div>
      </div>

      <div className="story-card-content">
        <h3 className="story-card-title">{getTitle()}</h3>
        <p className="story-card-author">
          by <span className="author-name">{story.userId?.name || 'Anonymous'}</span>
        </p>
        <p className="story-card-description">{getDescription()}</p>

        <div className="story-card-footer">
          <div className="story-card-stats">
            <span className="story-card-stat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {story.likes?.length || 0}
            </span>
            <span className="story-card-stat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {story.comments?.length || 0}
            </span>
            <span className="story-card-stat story-card-time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {getReadingTime()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
