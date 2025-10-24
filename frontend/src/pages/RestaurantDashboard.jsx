import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { orderAPI, foodAPI, restaurantAPI } from '../utils/api.js';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [myRestaurants, setMyRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [showAddFood, setShowAddFood] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    ingredients: '',
    isVegetarian: false,
    isVegan: false,
    spiceLevel: 'mild'
  });
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    cuisine: '',
    description: ''
  });

  useEffect(() => {
    if (user?.role === 'restaurant') {
      fetchRestaurantData();
      fetchMyRestaurants();
    }
  }, [user]);

  const fetchMyRestaurants = async () => {
    try {
      const resp = await restaurantAPI.getMy();
      if (resp.data.success) {
        setMyRestaurants(resp.data.data.restaurants || []);
        if ((resp.data.data.restaurants || []).length > 0) {
          setSelectedRestaurantId(resp.data.data.restaurants[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newRestaurant.name,
        address: {
          street: newRestaurant.street,
          city: newRestaurant.city,
          state: newRestaurant.state,
          zipCode: newRestaurant.zipCode
        },
        cuisine: newRestaurant.cuisine,
        description: newRestaurant.description
      };

      const resp = await restaurantAPI.create(payload);
      if (resp.data.success) {
        toast.success('Restaurant created successfully');
        // Clear form
        setNewRestaurant({ name: '', street: '', city: '', state: '', zipCode: '', cuisine: '', description: '' });
        // Refresh restaurants and select the new one
        await fetchMyRestaurants();
        const createdId = resp.data.data.restaurant?._id;
        if (createdId) setSelectedRestaurantId(createdId);
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast.error('Failed to create restaurant');
    }
  };

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      // Fetch restaurant's food items
      const foodsResponse = await foodAPI.getMy();
      if (foodsResponse.data.success) {
        setFoods(foodsResponse.data.data.foods);
      }
      // Note: Orders would need backend endpoints for restaurant-specific orders
      setOrders([]);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Failed to load restaurant data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateStatus(orderId, newStatus);
      if (response.data.success) {
        toast.success('Order status updated successfully');
        fetchRestaurantData();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newFood.name);
      formData.append('description', newFood.description);
      formData.append('price', newFood.price);
      formData.append('category', newFood.category);
      formData.append('preparationTime', newFood.preparationTime);
      formData.append('ingredients', newFood.ingredients);
      formData.append('isVegetarian', newFood.isVegetarian);
      formData.append('isVegan', newFood.isVegan);
      formData.append('spiceLevel', newFood.spiceLevel);
      // Use selected restaurant ID (owner's restaurant). If none selected, omit and backend will try to
      // associate with the owner's first restaurant or return a helpful error.
      if (selectedRestaurantId) {
        formData.append('restaurantId', selectedRestaurantId);
      }

      const response = await foodAPI.create(formData);
      if (response.data.success) {
        toast.success('Food item added successfully');
        setShowAddFood(false);
        setNewFood({
          name: '',
          description: '',
          price: '',
          category: '',
          preparationTime: '',
          ingredients: '',
          isVegetarian: false,
          isVegan: false,
          spiceLevel: 'mild'
        });
        fetchRestaurantData();
      }
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error('Failed to add food item');
    }
  };

  const toggleFoodAvailability = async (foodId) => {
    try {
      const response = await foodAPI.toggleAvailability(foodId);
      if (response.data.success) {
        toast.success('Food availability updated');
        fetchRestaurantData();
      }
    } catch (error) {
      console.error('Error toggling food availability:', error);
      toast.error('Failed to update food availability');
    }
  };

  const deleteFood = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        const response = await foodAPI.delete(foodId);
        if (response.data.success) {
          toast.success('Food item deleted successfully');
          fetchRestaurantData();
        }
      } catch (error) {
        console.error('Error deleting food:', error);
        toast.error('Failed to delete food item');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      'out-for-delivery': 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (user?.role !== 'restaurant') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to restaurant owners.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant orders and menu</p>
          {/* Show current restaurant (if any) and allow switching when owner has multiple */}
          <div className="mt-3">
            {myRestaurants.length > 1 ? (
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Active Restaurant:</label>
                <select
                  value={selectedRestaurantId || ''}
                  onChange={(e) => setSelectedRestaurantId(e.target.value)}
                  className="input-field"
                >
                  {myRestaurants.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>
            ) : myRestaurants.length === 1 ? (
              <div className="text-sm text-gray-700">Active Restaurant: {myRestaurants[0].name}</div>
            ) : (
              <div className="mt-3 bg-white rounded-lg p-4 border">
                <h3 className="text-lg font-semibold mb-2">Create your restaurant</h3>
                <form onSubmit={handleCreateRestaurant} className="space-y-2">
                  <input
                    required
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                    placeholder="Restaurant name"
                    className="input-field w-full"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      required
                      value={newRestaurant.street}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, street: e.target.value })}
                      placeholder="Street address"
                      className="input-field w-full"
                    />
                    <input
                      required
                      value={newRestaurant.city}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, city: e.target.value })}
                      placeholder="City"
                      className="input-field w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      required
                      value={newRestaurant.state}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, state: e.target.value })}
                      placeholder="State"
                      className="input-field w-full"
                    />
                    <input
                      required
                      value={newRestaurant.zipCode}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, zipCode: e.target.value })}
                      placeholder="ZIP code"
                      className="input-field w-full"
                    />
                  </div>
                  <input
                    required
                    value={newRestaurant.cuisine}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
                    placeholder="Cuisine (e.g. Italian, Indian)"
                    className="input-field w-full"
                  />
                  <textarea
                    value={newRestaurant.description}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
                    placeholder="Short description (optional)"
                    className="input-field w-full"
                    rows={3}
                  />
                  <div className="flex items-center space-x-2">
                    <button type="submit" className="btn btn-primary">Create Restaurant</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'menu'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Menu Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              <div className="flex space-x-2">
                <select className="input-field">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size="large" text="Loading orders..." />
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-xl font-bold text-orange-600">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span>{item.name} x {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'confirmed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Confirm Order
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'preparing')}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'ready')}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'out-for-delivery')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Out for Delivery
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h3>
                <p className="text-gray-600">Orders will appear here when customers place them.</p>
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
              <button 
                onClick={() => setShowAddFood(true)}
                className="btn-primary"
              >
                Add New Item
              </button>
            </div>

            {showAddFood && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Food Item</h3>
                <form onSubmit={handleAddFood} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newFood.name}
                        onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newFood.price}
                        onChange={(e) => setNewFood({...newFood, price: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={newFood.category}
                        onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
                      <input
                        type="number"
                        value={newFood.preparationTime}
                        onChange={(e) => setNewFood({...newFood, preparationTime: e.target.value})}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newFood.description}
                      onChange={(e) => setNewFood({...newFood, description: e.target.value})}
                      className="input-field"
                      rows="3"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma-separated)</label>
                    <input
                      type="text"
                      value={newFood.ingredients}
                      onChange={(e) => setNewFood({...newFood, ingredients: e.target.value})}
                      className="input-field"
                      placeholder="e.g., Tomato, Cheese, Basil"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newFood.isVegetarian}
                        onChange={(e) => setNewFood({...newFood, isVegetarian: e.target.checked})}
                        className="mr-2"
                      />
                      Vegetarian
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newFood.isVegan}
                        onChange={(e) => setNewFood({...newFood, isVegan: e.target.checked})}
                        className="mr-2"
                      />
                      Vegan
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spice Level</label>
                    <select
                      value={newFood.spiceLevel}
                      onChange={(e) => setNewFood({...newFood, spiceLevel: e.target.value})}
                      className="input-field"
                    >
                      <option value="mild">Mild</option>
                      <option value="medium">Medium</option>
                      <option value="hot">Hot</option>
                      <option value="extra-hot">Extra Hot</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="input-field"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button type="submit" className="btn-primary">
                      Add Food Item
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddFood(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size="large" text="Loading menu items..." />
              </div>
            ) : foods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foods.map((food) => (
                  <div key={food._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {food.imageUrl && (
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{food.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          food.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {food.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{food.description}</p>
                      <p className="text-orange-600 font-semibold mb-3">${food.price}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleFoodAvailability(food._id)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            food.available 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {food.available ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => deleteFood(food._id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-medium hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No menu items yet</h3>
                <p className="text-gray-600 mb-8">Add your first food item to get started.</p>
                <button 
                  onClick={() => setShowAddFood(true)}
                  className="btn-primary"
                >
                  Add Menu Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$0.00</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">0.0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics Coming Soon</h3>
              <p className="text-gray-600">Detailed analytics and insights will be available here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
