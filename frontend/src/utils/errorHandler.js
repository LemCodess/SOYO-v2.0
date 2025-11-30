import toast from './toast';

/**
 * Extract error message from various error formats
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.error || error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

/**
 * Handle API errors with toast notifications
 */
export const handleApiError = (error, customMessage) => {
  const message = customMessage || getErrorMessage(error);
  toast.error(message);
  console.error('API Error:', error);
};

/**
 * Handle success with toast notification
 */
export const handleApiSuccess = (message, duration) => {
  toast.success(message, duration);
};

/**
 * Format validation errors
 */
export const formatValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.map((err) => err.msg || err.message).join(', ');
  }
  return errors;
};
