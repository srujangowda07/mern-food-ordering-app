import { useState } from 'react';

const Filter = ({ onFilterChange, categories = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange({
      category,
      priceRange
    });
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = {
      ...priceRange,
      [type]: parseInt(value) || 0
    };
    setPriceRange(newPriceRange);
    onFilterChange({
      category: selectedCategory,
      priceRange: newPriceRange
    });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 1000 });
    onFilterChange({
      category: '',
      priceRange: { min: 0, max: 1000 }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3">🔍</span>
          Filter Options
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || priceRange.min > 0 || priceRange.max < 1000) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                Category: {selectedCategory}
                <button
                  onClick={() => handleCategoryChange('')}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}
            {(priceRange.min > 0 || priceRange.max < 1000) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                Price: ${priceRange.min} - ${priceRange.max}
                <button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 1000 });
                    onFilterChange({
                      category: selectedCategory,
                      priceRange: { min: 0, max: 1000 }
                    });
                  }}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;