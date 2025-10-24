import React from 'react';

const Loader = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-orange-500 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

// Full page loader
export const FullPageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">{text}</p>
      </div>
    </div>
  );
};

// Inline loader for buttons
export const ButtonLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    </div>
  );
};

// Card loader for food items
export const CardLoader = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

// Grid loader for multiple cards
export const GridLoader = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardLoader key={index} />
      ))}
    </div>
  );
};

// Dots loader
export const DotsLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-gray-600 ml-2">{text}</span>
    </div>
  );
};

export default Loader;