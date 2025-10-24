import { useState } from 'react';
import { Link } from 'react-router-dom';

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  // Mock data for testing
  const mockRestaurants = [
    {
      _id: '1',
      name: "Karim's",
      description: "Legendary Mughlai flavours from Old Delhi",
      cuisine: "Mughlai",
      avgRating: 4.5,
      totalReviews: 150,
      deliveryFee: 30,
      minimumOrder: 200,
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop",
      address: { street: "Jamma Masjid Area", city: "New Delhi" }
    },
    {
      _id: '2',
      name: "MTR (Mavalli Tiffin Rooms)",
      description: "Classic South Indian breakfast and filter coffee",
      cuisine: "South Indian",
      avgRating: 4.3,
      totalReviews: 89,
      deliveryFee: 25,
      minimumOrder: 150,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop",
      address: { street: "Lalbagh Road", city: "Bengaluru" }
    }
  ];

  const cuisines = ['Mughlai', 'South Indian', 'North Indian', 'Hyderabadi'];

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏪 All Restaurants
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of authentic Indian restaurants
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Bar */}
            <div>
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Cuisine Filter */}
            <div>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-700">
            <span className="font-semibold">{filteredRestaurants.length}</span> restaurants found
          </p>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
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
                      <span className="ml-1">₹{restaurant.deliveryFee}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Min:</span>
                      <span className="ml-1">₹{restaurant.minimumOrder}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    <p>{restaurant.address.street}, {restaurant.address.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;