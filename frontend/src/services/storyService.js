import axios from 'axios';

const API_BASE = '/api/stories';

/**
 * Toggle like on a story
 * @param {String} storyId - Story ID
 * @returns {Promise} - Response with like count and status
 */
export const likeStory = async (storyId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication required to like stories');
  }

  const response = await axios.post(
    `${API_BASE}/${storyId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

/**
 * Add a comment to a story
 * @param {String} storyId - Story ID
 * @param {String} text - Comment text
 * @returns {Promise} - Response with new comment
 */
export const addComment = async (storyId, text) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication required to comment');
  }

  const response = await axios.post(
    `${API_BASE}/${storyId}/comment`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

/**
 * Fetch all comments for a story
 * @param {String} storyId - Story ID
 * @returns {Promise} - Response with comments array
 */
export const fetchComments = async (storyId) => {
  const response = await axios.get(`${API_BASE}/${storyId}/comments`);
  return response.data;
};

/**
 * Fetch like count and status for a story
 * @param {String} storyId - Story ID
 * @returns {Promise} - Response with like count and isLiked status
 */
export const fetchLikes = async (storyId) => {
  const token = localStorage.getItem('token');

  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  const response = await axios.get(`${API_BASE}/${storyId}/likes`, config);
  return response.data;
};
