import axiosInstance from './axios';
import { ENDPOINTS } from '../config/api.config';

/**
 * Create or update a story
 */
export const createOrUpdateStory = async (storyData) => {
  const response = await axiosInstance.post(ENDPOINTS.STORIES.BASE, storyData);
  return response.data;
};

/**
 * Get published stories with optional search
 */
export const getPublishedStories = async (searchQuery = '') => {
  const response = await axiosInstance.get(ENDPOINTS.STORIES.PUBLISHED, {
    params: { searchQuery },
  });
  return response.data;
};

/**
 * Get user's draft stories
 */
export const getUserDrafts = async () => {
  const response = await axiosInstance.get(ENDPOINTS.STORIES.DRAFTS);
  return response.data;
};

/**
 * Get story by ID
 */
export const getStoryById = async (id) => {
  const response = await axiosInstance.get(ENDPOINTS.STORIES.BY_ID(id));
  return response.data;
};

/**
 * Delete a draft story
 */
export const deleteStory = async (id) => {
  const response = await axiosInstance.delete(ENDPOINTS.STORIES.BY_ID(id));
  return response.data;
};
