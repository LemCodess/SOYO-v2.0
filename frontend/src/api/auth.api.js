import axiosInstance from './axios';
import { ENDPOINTS } from '../config/api.config';

/**
 * User signup
 */
export const signup = async (name, email, password) => {
  const response = await axiosInstance.post(ENDPOINTS.AUTH.SIGNUP, {
    name,
    email,
    password,
  });
  return response.data;
};

/**
 * User login
 */
export const login = async (email, password) => {
  const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });
  return response.data;
};

/**
 * User logout
 */
export const logout = async () => {
  const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
  return response.data;
};

/**
 * Get user profile
 */
export const getProfile = async () => {
  const response = await axiosInstance.get(ENDPOINTS.AUTH.PROFILE);
  return response.data;
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {
    refreshToken,
  });
  return response.data;
};
