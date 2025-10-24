import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticateToken, authorize, authorizeOwnerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('addresses')
    .optional()
    .isArray()
    .withMessage('Addresses must be an array')
];

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', authenticateToken, authorize('admin'), getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private
 */
router.put('/:id', authenticateToken, updateUserValidation, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/:id', authenticateToken, authorize('admin'), deleteUser);

export default router;
