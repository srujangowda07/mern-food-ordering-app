import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';

const FoodCard = ({ food, onClick }) => {
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    
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

    addToCart(food, quantity);
    toast.success(`${food.name} added to cart!`);
    setQuantity(1);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/food/${food._id}`);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star">☆</span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star-empty">★</span>
      );
    }

    return stars;
  };

  return (
    <div 
      className="food-card"
      onClick={handleCardClick}
    >
      {/* Food Image */}
      <div className="relative overflow-hidden">
        {food.imageUrl ? (
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">🍽️</span>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
          ${food.price.toFixed(2)}
        </div>
        
        {/* Vegetarian/Vegan Badge */}
        {(food.isVegetarian || food.isVegan) && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {food.isVegan ? 'Vegan' : 'Veg'}
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Food Name and Rating */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
            {food.name}
          </h3>
          
          {/* Rating */}
          {food.rating > 0 && (
            <div className="rating-stars text-sm">
              <div className="flex">
                {renderStars(food.rating)}
              </div>
              <span className="ml-2 text-gray-600">
                {food.rating} ({food.totalReviews})
              </span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {food.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {food.category}
          </span>
          {food.spiceLevel && food.spiceLevel !== 'mild' && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
              {food.spiceLevel}
            </span>
          )}
        </div>
        
        {/* Restaurant info */}
        {food.restaurant && (
          <div className="text-xs text-gray-500 mb-3">
            <span className="font-medium">📍</span> {food.restaurant.name}
          </div>
        )}
        
        {/* Preparation time */}
        {food.preparationTime && (
          <div className="text-xs text-gray-500 mb-4">
            ⏱️ {food.preparationTime} min
          </div>
        )}
        
        {/* Add to cart section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center font-medium text-gray-900">{quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
              className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm transition-colors"
            >
              +
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!food.available}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              food.available
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {food.available ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;