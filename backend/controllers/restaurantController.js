import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
/**
 * @desc    Get all restaurants
 * @route   GET /api/restaurants
 * @access  Public
 */
export const getAllRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { cuisine, search, city } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (cuisine) {
      filter.cuisine = { $regex: cuisine, $options: 'i' };
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (city) {
      filter['address.city'] = { $regex: city, $options: 'i' };
    }

    const restaurants = await Restaurant.find(filter)
      .populate('owner', 'name email phone')
      .sort({ avgRating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Restaurant.countDocuments(filter);

    res.json({
      success: true,
      data: {
        restaurants,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restaurants',
      error: error.message
    });
  }
};

/**
 * @desc    Get restaurant by ID with menu
 * @route   GET /api/restaurants/:id
 * @access  Public
 */
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get menu items
    const menuItems = await Food.find({
      restaurant: req.params.id,
      available: true
    }).sort({ category: 1, name: 1 });
    
    res.json({
      success: true,
      data: {
        restaurant,
        menuItems
      }
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restaurant',
      error: error.message
    });
  }
};

/**
 * @desc    Create new restaurant
 * @route   POST /api/restaurants
 * @access  Private/Admin/Restaurant
 */
export const createRestaurant = async (req, res) => {
  try {
    const restaurantData = {
      ...req.body,
      owner: req.user._id
    };

    const restaurant = await Restaurant.create(restaurantData);
    await restaurant.populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: { restaurant }
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create restaurant',
      error: error.message
    });
  }
};

/**
 * @desc    Update restaurant
 * @route   PUT /api/restaurants/:id
 * @access  Private/Owner/Admin
 */
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check if user owns restaurant or is admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own restaurant'
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: { restaurant: updatedRestaurant }
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update restaurant',
      error: error.message
    });
  }
};

/**
 * @desc    Delete restaurant
 * @route   DELETE /api/restaurants/:id
 * @access  Private/Owner/Admin
 */
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check if user owns restaurant or is admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own restaurant'
      });
    }

    // Soft delete - set isActive to false
    await Restaurant.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete restaurant',
      error: error.message
    });
  }
};

/**
 * @desc    Get restaurants owned by current user
 * @route   GET /api/restaurants/my-restaurants
 * @access  Private/Restaurant/Admin
 */
export const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id, isActive: true }).populate('owner', 'name email phone');

    res.json({
      success: true,
      data: { restaurants }
    });
  } catch (error) {
    console.error('Get my restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your restaurants',
      error: error.message
    });
  }
};
