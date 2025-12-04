export const API_CONFIG = {
  // In production (Vercel), use relative URLs since frontend and backend are on same domain
  // In development, use localhost backend
  BASE_URL: import.meta.env.VITE_API_URL ||
            (import.meta.env.PROD ? '' : 'http://localhost:5000'),
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

export const ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    PROFILE: '/api/auth/profile',
  },
  // Stories
  STORIES: {
    BASE: '/api/stories',
    PUBLISHED: '/api/stories/published',
    DRAFTS: '/api/stories/drafts',
    BY_ID: (id) => `/api/stories/${id}`,
  },
  // User
  USER: {
    UPLOAD_PICTURE: '/api/user/upload-profile-picture',
    DELETE_PICTURE: '/api/user/profile-picture',
    GET_PICTURE: '/api/user/profile-picture',
  },
};
