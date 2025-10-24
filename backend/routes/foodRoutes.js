import express from 'express';
import { body } from 'express-validator';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getFoodCategories,
  getMyFoods,
  toggleFoodAvailability
} from '../controllers/foodController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Validation middleware
const createFoodValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Food name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('restaurantId')
    .optional()
    .isMongoId()
    .withMessage('Valid restaurant ID is required')
];

/**
 * @route   GET /api/foods
 * @desc    Get all food items with search and filter
 * @access  Public
 */
router.get('/', getAllFoods);

/**
 * @route   GET /api/foods/categories
 * @desc    Get all food categories
 * @access  Public
 */
router.get('/categories', getFoodCategories);

/**
 * @route   GET /api/foods/:id
 * @desc    Get food by ID
 * @access  Public
 */
router.get('/:id', getFoodById);

/**
 * @route   GET /api/foods/my-foods
 * @desc    Get restaurant's food items
 * @access  Private/Restaurant/Admin
 */
router.get('/my-foods', authenticateToken, authorize('admin', 'restaurant'), getMyFoods);

/**
 * @route   POST /api/foods
 * @desc    Create new food item
 * @access  Private/Admin/Restaurant
 */
router.post('/', authenticateToken, authorize('admin', 'restaurant'), upload.single('image'), createFoodValidation, createFood);

/**
 * @route   PUT /api/foods/:id
 * @desc    Update food item
 * @access  Private/Admin/Restaurant
 */
router.put('/:id', authenticateToken, authorize('admin', 'restaurant'), updateFood);

/**
 * @route   PUT /api/foods/:id/toggle
 * @desc    Toggle food availability
 * @access  Private/Restaurant/Admin
 */
router.put('/:id/toggle', authenticateToken, authorize('admin', 'restaurant'), toggleFoodAvailability);

/**
 * @route   DELETE /api/foods/:id
 * @desc    Delete food item
 * @access  Private/Admin/Restaurant
 */
router.delete('/:id', authenticateToken, authorize('admin', 'restaurant'), deleteFood);

export default router;