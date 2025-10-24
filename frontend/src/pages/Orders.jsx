import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { orderAPI } from '../utils/api.js';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';

const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await orderAPI.getMy(params);
      
      if (response.data.success) {
        setOrders(response.data.data.orders);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      preparing: 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium',
      ready: 'bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium',
      'out-for-delivery': 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your orders</h1>
          <Link
            to="/login"
            className="btn-primary"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
            <p className="text-gray-600 mt-1">Track your order history and status</p>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="large" text="Loading your orders..." />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3">📦</span>
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={getStatusColor(order.status)}>
                      {order.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="text-xl font-bold text-orange-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <span className="bg-gray-100 text-gray-600 p-1 rounded mr-2">🏪</span>
                    Restaurant: {order.restaurant.name}
                  </h4>
                  <p className="text-sm text-gray-600 ml-6">
                    {order.restaurant.address.street}, {order.restaurant.address.city}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <span className="bg-gray-100 text-gray-600 p-1 rounded mr-2">🍽️</span>
                    Items:
                  </h4>
                  <div className="space-y-1 ml-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Delivery Fee:</span>
                    <span>${order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tax:</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-orange-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">📝 Notes:</span> {order.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h3>
            <p className="text-gray-600 mb-8">
              {statusFilter 
                ? `No orders with status "${statusFilter}" found`
                : "You haven't placed any orders yet"
              }
            </p>
            <Link
              to="/"
              className="btn-primary"
            >
              Browse Food Items
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;