import React, { useState, useEffect } from 'react';
import { likeStory, fetchLikes } from '../../services/storyService';
import './LikeButton.css';

const LikeButton = ({ storyId, isAuthenticated }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLikes = async () => {
      try {
        const data = await fetchLikes(storyId);
        setLikes(data.likes);
        setIsLiked(data.isLiked);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    loadLikes();
  }, [storyId]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like stories');
      return;
    }

    if (loading) return;

    // Optimistic UI update
    const previousLikes = likes;
    const previousIsLiked = isLiked;

    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    setLoading(true);

    try {
      const response = await likeStory(storyId);
      // Update with server response
      setLikes(response.likes);
      setIsLiked(response.isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLikes(previousLikes);
      setIsLiked(previousIsLiked);
      alert('Failed to update like. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`like-button ${isLiked ? 'liked' : ''} ${loading ? 'loading' : ''}`}
      onClick={handleLike}
      disabled={loading}
      title={isLiked ? 'Unlike' : 'Like'}
    >
      <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
      <span className="like-count">{likes}</span>
    </button>
  );
};

export default LikeButton;
