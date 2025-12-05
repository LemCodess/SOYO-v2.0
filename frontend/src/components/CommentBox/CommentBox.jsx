import React, { useState, useEffect, useRef } from 'react';
import { addComment, fetchComments } from '../../services/storyService';
import './CommentBox.css';

const CommentBox = ({ storyId, isAuthenticated }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    loadComments();
  }, [storyId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await fetchComments(storyId);
      setComments(data.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }

    const trimmedText = commentText.trim();

    if (!trimmedText) {
      alert('Comment cannot be empty');
      return;
    }

    if (trimmedText.length > 500) {
      alert('Comment must be 500 characters or less');
      return;
    }

    // Spam prevention - 1 second cooldown
    const now = Date.now();
    if (now - lastSubmitTime < 1000) {
      alert('Please wait a moment before commenting again');
      return;
    }

    setSubmitting(true);

    try {
      const response = await addComment(storyId, trimmedText);

      // Add new comment to list
      setComments([response.comment, ...comments]);
      setCommentText('');
      setLastSubmitTime(now);

      // Scroll to new comment
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error.response?.data?.error || 'Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="comment-box-container">
      <div className="comment-box-header">
        <h3 className="comment-box-title">
          Comments <span className="comment-count">({comments.length})</span>
        </h3>
      </div>

      {/* Comment Input */}
      <form className="comment-input-form" onSubmit={handleSubmit}>
        <textarea
          className="comment-input"
          placeholder={isAuthenticated ? 'Share your thoughts...' : 'Login to comment'}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          maxLength={500}
          rows={3}
          disabled={!isAuthenticated || submitting}
        />
        <div className="comment-input-footer">
          <span className="character-count">
            {commentText.length}/500
          </span>
          <button
            type="submit"
            className="comment-submit-btn"
            disabled={!isAuthenticated || submitting || !commentText.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <div className="comments-loading">
            <div className="loading-spinner"></div>
            <p>Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            <div className="empty-icon">💬</div>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            <div ref={commentsEndRef} />
            {comments.map((comment, index) => (
              <div key={comment._id || index} className="comment-item">
                <div className="comment-avatar">
                  {comment.username?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-username">{comment.username || 'Anonymous'}</span>
                    <span className="comment-time">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
