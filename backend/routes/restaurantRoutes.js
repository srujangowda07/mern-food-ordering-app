import express from 'express';
import { body } from 'express-validator';
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurantController.js';
import { getMyRestaurants } from '../controllers/restaurantController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const createRestaurantValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('cuisine')
    .trim()
    .notEmpty()
    .withMessage('Cuisine type is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('deliveryFee')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Delivery fee must be a positive number'),
  body('minimumOrder')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Minimum order must be a positive number')
];

/**
 * @route   GET /api/restaurants
 * @desc    Get all restaurants
 * @access  Public
 */
router.get('/', getAllRestaurants);

/**
 * @route   GET /api/restaurants/:id
 * @desc    Get restaurant by ID with menu
 * @access  Public
 */
// NOTE: keep parameter routes (/:id) AFTER more specific static routes like /my-restaurants

/**
 * @route   GET /api/restaurants/my-restaurants
 * @desc    Get restaurants owned by current user
 * @access  Private/Restaurant/Admin
 */
router.get('/my-restaurants', authenticateToken, authorize('admin', 'restaurant'), getMyRestaurants);

/**
 * @route   GET /api/restaurants/:id
 * @desc    Get restaurant by ID with menu
 * @access  Public
 */
router.get('/:id', getRestaurantById);

/**
 * @route   POST /api/restaurants
 * @desc    Create new restaurant
 * @access  Private/Admin/Restaurant
 */
router.post('/', authenticateToken, authorize('admin', 'restaurant'), createRestaurantValidation, createRestaurant);

/**
 * @route   GET /api/restaurants/my-restaurants
 * @desc    Get restaurants owned by current user
 * @access  Private/Restaurant/Admin
 */
router.get('/my-restaurants', authenticateToken, authorize('admin', 'restaurant'), getMyRestaurants);

/**
 * @route   PUT /api/restaurants/:id
 * @desc    Update restaurant
 * @access  Private/Owner/Admin
 */
router.put('/:id', authenticateToken, updateRestaurant);

/**
 * @route   DELETE /api/restaurants/:id
 * @desc    Delete restaurant
 * @access  Private/Owner/Admin
 */
router.delete('/:id', authenticateToken, deleteRestaurant);

export default router;
