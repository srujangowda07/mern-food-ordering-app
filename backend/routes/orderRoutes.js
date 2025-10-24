import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.foodId')
    .isMongoId()
    .withMessage('Valid food ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('paymentMethod')
    .isIn(['cash', 'card', 'upi', 'wallet'])
    .withMessage('Payment method must be cash, card, upi, or wallet'),
  body('deliveryAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('deliveryAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('deliveryAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('deliveryAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('deliveryAddress.phone')
    .isMobilePhone()
    .withMessage('Valid phone number is required')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

/**
 * @route   POST /api/order
 * @desc    Create new order
 * @access  Private
 */
router.post('/', authenticateToken, createOrderValidation, createOrder);

/**
 * @route   GET /api/order/my
 * @desc    Get user's orders
 * @access  Private
 */
router.get('/my', authenticateToken, getMyOrders);

/**
 * @route   GET /api/order/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, getOrderById);

/**
 * @route   PUT /api/order/:id/status
 * @desc    Update order status
 * @access  Private/Admin/Restaurant
 */
router.put('/:id/status', authenticateToken, authorize('admin', 'restaurant'), updateStatusValidation, updateOrderStatus);

export default router;