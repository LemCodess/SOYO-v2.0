import React, { useState, useEffect, useRef } from 'react';
import { addComment, fetchComments } from '../../services/storyService';
import './CommentBox.css';
import { Input, Button } from '../UI';

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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Comments <span className="comment-count">({comments.length})</span>
        </h3>
      </div>

      {/* Comment Input */}
      <form className="comment-input-form" onSubmit={handleSubmit}>
        <Input
          type="textarea"
          placeholder={isAuthenticated ? 'Share your thoughts...' : 'Login to comment'}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          maxLength={500}
          rows={3}
          disabled={!isAuthenticated || submitting}
          helperText={`${commentText.length}/500 characters`}
          leftIcon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          }
        />
        <div className="comment-input-footer">
          <Button
            type="submit"
            variant="primary"
            disabled={!isAuthenticated || submitting || !commentText.trim()}
            loading={submitting}
            rightIcon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            }
          >
            Post Comment
          </Button>
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
            <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
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
