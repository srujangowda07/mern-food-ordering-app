import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { orderAPI } from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartDrawer = ({ isOpen, onClose, cart, onRemoveItem, onUpdateQuantity, restaurant }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return restaurant?.deliveryFee || 0;
  };

  const getTax = () => {
    const subtotal = getCartTotal();
    return Math.round(subtotal * 0.1); // 10% tax
  };

  const getFinalTotal = () => {
    return getCartTotal() + getDeliveryFee() + getTax();
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (getCartTotal() < (restaurant?.minimumOrder || 0)) {
      toast.error(`Minimum order amount is $${restaurant.minimumOrder}`);
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          foodId: item.menuItem._id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || ''
        })),
        paymentMethod: 'card', // Valid payment method
        deliveryAddress: {
          street: user.addresses?.[0] || '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: user.phone || '+1234567890'
        },
        notes: ''
      };

      const response = await orderAPI.create(orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        onClose();
        navigate('/orders');
      } else {
        toast.error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
      toast.error(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.menuItem.name}</h3>
                      <p className="text-sm text-gray-600">${item.menuItem.price.toFixed(2)} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.menuItem._id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.menuItem._id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => onRemoveItem(item.menuItem._id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Order Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>${getDeliveryFee().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${getFinalTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Minimum Order Check */}
              {restaurant?.minimumOrder && getCartTotal() < restaurant.minimumOrder && (
                <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  Add ${(restaurant.minimumOrder - getCartTotal()).toFixed(2)} more to reach minimum order
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || (restaurant?.minimumOrder && getCartTotal() < restaurant.minimumOrder)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
