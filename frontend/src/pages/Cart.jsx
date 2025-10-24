import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { orderAPI } from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';

const Cart = () => {
  const { isAuthenticated, user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // If logged-in user is a restaurant owner, prevent use of the customer cart
  if (user?.role === 'restaurant') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏪</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
            <p className="text-gray-600 mb-6">
              You are logged in as a restaurant owner. The cart and checkout are for customers only.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/owner/restaurants/new')}
                className="btn-secondary"
              >
                Create / Manage Restaurant
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    // Block restaurant owners from placing orders (double-check)
    if (user?.role === 'restaurant') {
      toast.error('Restaurant owners cannot place customer orders. Use the dashboard to manage your restaurant.');
      navigate('/dashboard');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Demo checkout - show alert instead of real payment
    const confirmed = window.confirm(
      `Place order for $${(getCartTotal() + 2.99 + (getCartTotal() * 0.1)).toFixed(2)}?\n\nThis is a demo - no real payment will be processed.`
    );

    if (!confirmed) return;

    setIsPlacingOrder(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          foodId: item.food._id,
          quantity: item.quantity,
          specialInstructions: ''
        })),
        paymentMethod: 'card', // Valid payment method
        deliveryAddress: {
          street: user.addresses?.[0] || '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: user.phone || '+1234567890'
        },
        notes: 'Demo order - no real payment processed'
      };

      const response = await orderAPI.create(orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully! This is a demo.');
        // Clear cart
        clearCart();
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 text-lg">Add some delicious food items to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary btn-lg"
            >
              Browse Food Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-600 mt-1">Review your items before checkout</p>
          </div>
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
            <span className="font-semibold">
              {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3">🛒</span>
                Cart Items
              </h2>
              
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <CartItem
                    key={index}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3">📋</span>
                Order Summary
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2">
                  <span>Subtotal ({getCartItemCount()} items):</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t">
                  <span>Delivery Fee:</span>
                  <span className="font-medium">$2.99</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax (10%):</span>
                  <span className="font-medium">${(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg text-orange-600">
                    <span>Total:</span>
                    <span>${(getCartTotal() + 2.99 + (getCartTotal() * 0.1)).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isPlacingOrder ? (
                  <Loader size="small" text="" />
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Place Order (Demo)
                  </>
                )}
              </button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  <span className="font-medium">ℹ️ Demo Mode:</span> No real payment will be processed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;