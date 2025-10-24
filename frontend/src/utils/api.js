import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: false, // We'll use localStorage for JWT
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle other errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export const foodAPI = {
  getAll: (params) => api.get('/foods', { params }),
  getById: (id) => api.get(`/foods/${id}`),
  getMy: (params) => api.get('/foods/my-foods', { params }),
  create: (formData) => api.post('/foods', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/foods/${id}`, data),
  delete: (id) => api.delete(`/foods/${id}`),
  toggleAvailability: (id) => api.put(`/foods/${id}/toggle`),
};

export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
  getMy: (params) => api.get('/restaurants/my-restaurants', { params })
};

export const orderAPI = {
  create: (data) => api.post('/order', data),
  getMy: (params) => api.get('/order/my', { params }),
  getById: (id) => api.get(`/order/${id}`),
  updateStatus: (id, status) => api.put(`/order/${id}/status`, { status }),
};

export default api;