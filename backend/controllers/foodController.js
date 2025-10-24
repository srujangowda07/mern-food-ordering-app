import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';
import cloudinary from '../config/cloudinary.js';

/**
 * @desc    Get all food items with search and filter
 * @route   GET /api/foods
 * @access  Public
 */
export const getAllFoods = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      restaurant,
      limit = 20,
      page = 1
    } = req.query;

    // Build filter object
    const filter = { available: true };

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Filter by restaurant
    if (restaurant) {
      filter.restaurant = restaurant;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const foods = await Food.find(filter)
      .populate('restaurant', 'name address phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Food.countDocuments(filter);

    res.json({
      success: true,
      data: {
        foods,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food items',
      error: error.message
    });
  }
};

/**
 * @desc    Get food by ID
 * @route   GET /api/foods/:id
 * @access  Public
 */
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('restaurant', 'name address phone');

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.json({
      success: true,
      data: { food }
    });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food item',
      error: error.message
    });
  }
};

/**
 * @desc    Create new food item
 * @route   POST /api/foods
 * @access  Private/Admin/Restaurant
 */
export const createFood = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      category,
      restaurantId: bodyRestaurantId,
      preparationTime,
      ingredients,
      isVegetarian,
      isVegan,
      spiceLevel
    } = req.body;

    // If restaurantId isn't provided in the request body, try to use
    // the first restaurant owned by the authenticated user.
    let restaurantId = bodyRestaurantId;
    if (!restaurantId) {
      const ownedRestaurants = await Restaurant.find({ owner: req.user._id, isActive: true }).limit(1);
      if (ownedRestaurants.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No restaurant found for this user. Please create a restaurant first.'
        });
      }
      restaurantId = ownedRestaurants[0]._id;
    }

    // Verify restaurant exists and user owns it
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check if user owns the restaurant or is admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only add food to your own restaurant.'
      });
    }

    // Handle image upload
    let imageUrl = 'https://via.placeholder.com/300';
    if (req.file) {
      imageUrl = req.file.path;
    }

    const food = await Food.create({
      name,
      description,
      price,
      category,
      imageUrl,
      restaurant: restaurantId,
      preparationTime: preparationTime || 15,
      ingredients: ingredients ? ingredients.split(',').map(ing => ing.trim()) : [],
      isVegetarian: isVegetarian === 'true' || isVegetarian === true,
      isVegan: isVegan === 'true' || isVegan === true,
      spiceLevel: spiceLevel || 'mild'
    });

    await food.populate('restaurant', 'name address phone');

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: { food }
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create food item',
      error: error.message
    });
  }
};

/**
 * @desc    Update food item
 * @route   PUT /api/foods/:id
 * @access  Private/Admin/Restaurant
 */
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check if user owns the restaurant or is admin
    const restaurant = await Restaurant.findById(food.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update food from your own restaurant.'
      });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('restaurant', 'name address phone');

    res.json({
      success: true,
      message: 'Food item updated successfully',
      data: { food: updatedFood }
    });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update food item',
      error: error.message
    });
  }
};

/**
 * @desc    Delete food item
 * @route   DELETE /api/foods/:id
 * @access  Private/Admin/Restaurant
 */
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check if user owns the restaurant or is admin
    const restaurant = await Restaurant.findById(food.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete food from your own restaurant.'
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete food item',
      error: error.message
    });
  }
};

/**
 * @desc    Get food categories
 * @route   GET /api/foods/categories
 * @access  Public
 */
export const getFoodCategories = async (req, res) => {
  try {
    const categories = await Food.distinct('category', { available: true });
    
    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

/**
 * @desc    Get restaurant's food items
 * @route   GET /api/foods/my-foods
 * @access  Private/Restaurant/Admin
 */
export const getMyFoods = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find restaurants owned by the user
    const restaurants = await Restaurant.find({ owner: req.user._id });
    const restaurantIds = restaurants.map(r => r._id);

    if (restaurantIds.length === 0) {
      return res.json({
        success: true,
        data: {
          foods: [],
          pagination: {
            current: parseInt(page),
            pages: 0,
            total: 0,
            limit: parseInt(limit)
          }
        }
      });
    }

    const filter = { restaurant: { $in: restaurantIds } };
    if (status) {
      filter.available = status === 'available';
    }

    const foods = await Food.find(filter)
      .populate('restaurant', 'name address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Food.countDocuments(filter);

    res.json({
      success: true,
      data: {
        foods,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your food items',
      error: error.message
    });
  }
};

/**
 * @desc    Toggle food availability
 * @route   PUT /api/foods/:id/toggle
 * @access  Private/Restaurant/Admin
 */
export const toggleFoodAvailability = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check if user owns the restaurant or is admin
    const restaurant = await Restaurant.findById(food.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update food from your own restaurant.'
      });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      { available: !food.available },
      { new: true, runValidators: true }
    ).populate('restaurant', 'name address');

    res.json({
      success: true,
      message: `Food item ${updatedFood.available ? 'enabled' : 'disabled'} successfully`,
      data: { food: updatedFood }
    });
  } catch (error) {
    console.error('Toggle food availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle food availability',
      error: error.message
    });
  }
};