import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    setCartCount(savedCart.reduce((total, item) => total + item.quantity, 0));
  }, []);

  // Update cart count whenever cart changes
  useEffect(() => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cart]);

  const addToCart = (food, quantity = 1) => {
    const existingCart = [...cart];
    const existingItemIndex = existingCart.findIndex(item => item.food._id === food._id);
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        food: {
          _id: food._id,
          name: food.name,
          price: food.price,
          imageUrl: food.imageUrl
        },
        quantity: quantity
      });
    }
    
    setCart(existingCart);
    localStorage.setItem('cart', JSON.stringify(existingCart));
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.food._id === foodId
        ? { ...item, quantity }
        : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (foodId) => {
    const updatedCart = cart.filter(item => item.food._id !== foodId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.food.price * item.quantity), 0);
  };

  const value = {
    cart,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
