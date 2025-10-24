import { useState } from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      onRemove(item.food._id);
      return;
    }
    setQuantity(newQuantity);
    onUpdateQuantity(item.food._id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.food._id);
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {/* Food Image */}
      <div className="flex-shrink-0">
        {item.food.imageUrl ? (
          <img
            src={item.food.imageUrl}
            alt={item.food.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xl">🍽️</span>
          </div>
        )}
      </div>
      
      {/* Food Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.food.name}
        </h3>
        <p className="text-sm text-gray-600">
          ${item.food.price.toFixed(2)} each
        </p>
        {item.specialInstructions && (
          <p className="text-xs text-gray-500 mt-1">
            Note: {item.specialInstructions}
          </p>
        )}
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
          disabled={quantity <= 1}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <span className="w-8 text-center font-medium text-gray-900">
          {quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      {/* Price and Remove */}
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          ${(item.food.price * quantity).toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;