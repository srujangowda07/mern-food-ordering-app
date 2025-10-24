import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodAPI } from '../utils/api.js';
import FoodCard from '../components/FoodCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Filter from '../components/Filter.jsx';
import Loader, { GridLoader } from '../components/Loader.jsx';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 1000 }
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, [searchTerm, filters]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        category: filters.category || undefined,
        minPrice: filters.priceRange.min || undefined,
        maxPrice: filters.priceRange.max || undefined,
      };

      const response = await foodAPI.getAll(params);
      
      if (response.data.success) {
        setFoods(response.data.data.foods);
      } else {
        toast.error('Failed to fetch food items');
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast.error('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await foodAPI.getAll({ limit: 1000 });
      if (response.data.success) {
        const uniqueCategories = [...new Set(response.data.data.foods.map(food => food.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">
            Delicious Food Delivered to Your Door
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fadeIn">
            Order from your favorite restaurants and get it delivered to your doorstep in minutes
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fadeIn">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for delicious food..."
            />
          </div>
        </div>
      </div>

      <div className="container section-padding">
        {/* Filters */}
        <Filter
          onFilterChange={handleFilterChange}
          categories={categories}
        />

        {/* Food Items Grid */}
        {loading ? (
          <GridLoader count={8} />
        ) : foods.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm ? `Search results for "${searchTerm}"` : 'Popular Food Items'}
              </h2>
              <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {foods.length} item{foods.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            <div className="grid-responsive">
              {foods.map((food) => (
                <FoodCard 
                  key={food._id} 
                  food={food}
                  onClick={() => navigate(`/food/${food._id}`)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm || filters.category || filters.priceRange.min > 0 || filters.priceRange.max < 1000
                ? 'No food items found'
                : 'No food items available'
              }
            </h3>
            <p className="text-gray-600 mb-8">
              {searchTerm || filters.category || filters.priceRange.min > 0 || filters.priceRange.max < 1000
                ? 'Try adjusting your search or filters'
                : 'Check back later for new items'
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: '', priceRange: { min: 0, max: 1000 } });
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Get your food delivered in 30 minutes or less</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Food</h3>
            <p className="text-gray-600">Fresh ingredients and delicious recipes from top restaurants</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Payment</h3>
            <p className="text-gray-600">Secure and convenient payment options</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;