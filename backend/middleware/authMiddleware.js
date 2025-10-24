import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        error: 'UNAUTHORIZED' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        error: 'UNAUTHORIZED' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'UNAUTHORIZED' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        error: 'TOKEN_EXPIRED' 
      });
    }
    return res.status(500).json({ 
      message: 'Authentication error',
      error: error.message 
    });
  }
};

// Check if user has required role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'UNAUTHORIZED' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        error: 'FORBIDDEN' 
      });
    }

    next();
  };
};

// Check if user owns resource or is admin
export const authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required',
      error: 'UNAUTHORIZED' 
    });
  }

  const resourceOwnerId = req.params.userId || req.body.user || req.body.owner;
  
  if (req.user.role === 'admin' || req.user._id.toString() === resourceOwnerId) {
    return next();
  }

  return res.status(403).json({ 
    message: 'Access denied. You can only access your own resources',
    error: 'FORBIDDEN' 
  });
};
