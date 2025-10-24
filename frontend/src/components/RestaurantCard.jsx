import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
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

  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {restaurant.imageUrl && (
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {restaurant.name}
        </h3>
        
        <p className="text-gray-600 mb-3 line-clamp-2">
          {restaurant.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex">
              {renderStars(restaurant.avgRating)}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {restaurant.avgRating} ({restaurant.totalReviews} reviews)
            </span>
          </div>
          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {restaurant.cuisine}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <span className="font-medium">Delivery:</span>
            <span className="ml-1">${restaurant.deliveryFee}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Min:</span>
            <span className="ml-1">${restaurant.minimumOrder}</span>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-500">
          <p>{restaurant.address.street}, {restaurant.address.city}</p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
