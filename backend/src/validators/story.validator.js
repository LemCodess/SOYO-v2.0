const { body, param, query, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new ApiError(400, errorMessages));
  }
  next();
};

/**
 * Story creation/update validation
 */
const storyValidation = [
  body('topicName')
    .trim()
    .notEmpty().withMessage('Story title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Story description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn([
      'Action',
      'Adventure',
      'Fanfiction',
      'Fantasy',
      'Horror',
      'Humor',
      'Mystery',
      'Poetry',
      'Romance',
      'Science Fiction',
    ]).withMessage('Invalid category selected'),

  body('tags')
    .trim()
    .notEmpty().withMessage('Tags are required')
    .isLength({ max: 200 }).withMessage('Tags must not exceed 200 characters'),

  body('language')
    .trim()
    .notEmpty().withMessage('Language is required')
    .isIn(['English', 'Bangla']).withMessage('Invalid language selected'),

  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['draft', 'published']).withMessage('Status must be either "draft" or "published"'),

  body('chapters')
    .optional()
    .isString().withMessage('Chapters must be a string'),

  body('_id')
    .optional()
    .isMongoId().withMessage('Invalid story ID'),

  validate,
];

/**
 * Story ID validation
 */
const storyIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid story ID format'),

  validate,
];

/**
 * Search query validation
 */
const searchValidation = [
  query('searchQuery')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query must not exceed 100 characters'),

  validate,
];

module.exports = {
  storyValidation,
  storyIdValidation,
  searchValidation,
};
