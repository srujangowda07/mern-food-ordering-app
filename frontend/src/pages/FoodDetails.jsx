import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foodAPI } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader, { FullPageLoader } from '../components/Loader.jsx';
import toast from 'react-hot-toast';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedFoods, setRelatedFoods] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        setLoading(true);
        const response = await foodAPI.getById(id);

        if (response.data.success) {
          setFood(response.data.data.food);
          // Fetch related foods from same category
          fetchRelatedFoods(response.data.data.food.category);
        } else {
          toast.error('Food item not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching food details:', error);
        toast.error('Failed to load food details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const fetchRelatedFoods = async (category) => {
    try {
      const response = await foodAPI.getAll({ category, limit: 4 });
      if (response.data.success) {
        setRelatedFoods(response.data.data.foods.filter(f => f._id !== id));
      }
    } catch (error) {
      console.error('Error fetching related foods:', error);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    // Only customers should place orders
    if (user?.role && user.role !== 'customer') {
      toast.error('Only customers can place orders');
      return;
    }

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(item => item.food._id === food._id);
    
    if (existingItemIndex > -1) {
      // Update quantity
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      existingCart.push({
        food: {
          _id: food._id,
          name: food.name,
          price: food.price,
          imageUrl: food.imageUrl
        },
        quantity: quantity
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    toast.success(`${food.name} added to cart!`);
    setQuantity(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }

    return stars;
  };

  if (loading) {
    return <FullPageLoader text="Loading food details..." />;
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Food not found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-orange-600">
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigate('/')} className="hover:text-orange-600">
                {food.category}
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900">{food.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Food Image */}
          <div>
            {food.imageUrl ? (
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-300 rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-gray-500 text-lg">No image available</span>
              </div>
            )}
          </div>

          {/* Food Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{food.name}</h1>
              <p className="text-xl text-orange-600 font-semibold mb-4">
                ${food.price.toFixed(2)}
              </p>
              
              {/* Rating */}
              {food.rating > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {renderStars(food.rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {food.rating} ({food.totalReviews} reviews)
                  </span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  {food.category}
                </span>
                {food.isVegetarian && (
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Vegetarian
                  </span>
                )}
                {food.isVegan && (
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Vegan
                  </span>
                )}
                {food.spiceLevel && food.spiceLevel !== 'mild' && (
                  <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    {food.spiceLevel}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{food.description}</p>
            </div>

            {/* Ingredients */}
            {food.ingredients && food.ingredients.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {food.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation Time */}
            {food.preparationTime && (
              <div className="flex items-center text-gray-600">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Preparation time: {food.preparationTime} minutes</span>
              </div>
            )}

            {/* Add to Cart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!food.available}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    food.available
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {food.available ? `Add to Cart - $${(food.price * quantity).toFixed(2)}` : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Foods */}
        {relatedFoods.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedFoods.map((relatedFood) => (
                <div
                  key={relatedFood._id}
                  onClick={() => navigate(`/food/${relatedFood._id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  {relatedFood.imageUrl && (
                    <img
                      src={relatedFood.imageUrl}
                      alt={relatedFood.name}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{relatedFood.name}</h3>
                    <p className="text-orange-600 font-semibold">${relatedFood.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetails;
