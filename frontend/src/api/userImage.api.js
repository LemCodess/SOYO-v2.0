import axiosInstance from './axios';
import { ENDPOINTS } from '../config/api.config';

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post(
    ENDPOINTS.USER.UPLOAD_PICTURE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * Delete profile picture
 */
export const deleteProfilePicture = async () => {
  const response = await axiosInstance.delete(ENDPOINTS.USER.DELETE_PICTURE);
  return response.data;
};

/**
 * Get profile picture
 */
export const getProfilePicture = async () => {
  const response = await axiosInstance.get(ENDPOINTS.USER.GET_PICTURE);
  return response.data;
};
