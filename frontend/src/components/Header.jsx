import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useState } from 'react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="text-3xl">🍔</div>
            <span className="text-2xl font-bold text-gradient">FoodOrder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Hide Home link for restaurant owners — they use the dashboard as their home */}
            {user?.role !== 'restaurant' && (
              <Link
                to="/"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50"
              >
                Home
              </Link>
            )}
            
            {isAuthenticated && (
              <>
                {user?.role === 'restaurant' ? (
                  <Link
                    to="/restaurant-dashboard"
                    className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/orders"
                      className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/cart"
                      className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50 relative"
                    >
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  👋 Welcome, {user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-orange-600 p-2 rounded-lg hover:bg-orange-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white">
            <div className="flex flex-col space-y-2">
              {user?.role !== 'restaurant' && (
                <Link
                  to="/"
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              )}
              
              {isAuthenticated && (
                <>
                  {user?.role === 'restaurant' ? (
                    <Link
                      to="/restaurant-dashboard"
                      className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/orders"
                        className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        to="/cart"
                        className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-orange-50 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                      </Link>
                    </>
                  )}
                </>
              )}
              
              {isAuthenticated ? (
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-700 mb-2 px-4">
                    Welcome, {user?.name}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;