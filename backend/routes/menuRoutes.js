import express from 'express';
import { body } from 'express-validator';
import {
  getMenuItems,
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/foodController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const createMenuItemValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Menu item name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Description must be between 10 and 300 characters'),
  body('price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('preparationTime')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Preparation time must be at least 1 minute'),
  body('spiceLevel')
    .optional()
    .isIn(['mild', 'medium', 'hot', 'extra-hot'])
    .withMessage('Spice level must be mild, medium, hot, or extra-hot')
];

/**
 * @route   GET /api/restaurants/:id/menu
 * @desc    Get menu items for a restaurant
 * @access  Public
 */
router.get('/restaurants/:id/menu', getMenuItems);

/**
 * @route   POST /api/restaurants/:id/menu
 * @desc    Create new menu item
 * @access  Private/Restaurant/Admin
 */
router.post('/restaurants/:id/menu', authenticateToken, authorize('restaurant', 'admin'), createMenuItemValidation, createMenuItem);

/**
 * @route   GET /api/menu/:id
 * @desc    Get menu item by ID
 * @access  Public
 */
router.get('/:id', getMenuItemById);

/**
 * @route   PUT /api/menu/:id
 * @desc    Update menu item
 * @access  Private/Restaurant/Admin
 */
router.put('/:id', authenticateToken, authorize('restaurant', 'admin'), updateMenuItem);

/**
 * @route   DELETE /api/menu/:id
 * @desc    Delete menu item
 * @access  Private/Restaurant/Admin
 */
router.delete('/:id', authenticateToken, authorize('restaurant', 'admin'), deleteMenuItem);

export default router;
