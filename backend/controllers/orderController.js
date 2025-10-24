import Order from '../models/Order.js';
import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';

/**
 * @desc    Create new order
 * @route   POST /api/order
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, deliveryAddress, notes } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const validatedItems = [];
    let restaurantId = null;

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      
      if (!food || !food.available) {
        return res.status(400).json({
          success: false,
          message: `Food item ${item.foodId} not found or unavailable`
        });
      }

      // Set restaurant ID from first item
      if (!restaurantId) {
        restaurantId = food.restaurant;
      }

      // Check if all items are from the same restaurant
      if (food.restaurant.toString() !== restaurantId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'All items must be from the same restaurant'
        });
      }

      const itemTotal = food.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || ''
      });
    }

    // Get restaurant details
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Calculate delivery fee and tax
    const deliveryFee = restaurant.deliveryFee || 0;
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const total = subtotal + deliveryFee + tax;

    // Check minimum order (only if restaurant has a minimum order set)
    if (restaurant.minimumOrder && subtotal < restaurant.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is $${restaurant.minimumOrder}`
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      items: validatedItems,
      subtotal,
      deliveryFee,
      tax,
      total,
      paymentMethod,
      deliveryAddress,
      notes,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
    });

    await order.populate([
      { path: 'restaurant', select: 'name address phone' },
      { path: 'user', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * @desc    Get user's orders
 * @route   GET /api/order/my
 * @access  Private
 */
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('restaurant', 'name address phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/order/:id
 * @access  Private
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name address phone')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/order/:id/status
 * @access  Private/Admin/Restaurant
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can update this order
    const isRestaurantOwner = order.restaurant.owner && order.restaurant.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRestaurantOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only restaurant owners and admins can update order status'
      });
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        ...(status === 'delivered' && { actualDeliveryTime: new Date() })
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'restaurant', select: 'name address phone' },
      { path: 'user', select: 'name email phone' }
    ]);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};