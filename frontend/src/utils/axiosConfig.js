import axios from 'axios';
import { BACKEND } from '../assets/Vars';
import { isTokenExpired, clearAuthData } from './authUtils';

// Create axios instance
const api = axios.create({
  baseURL: BACKEND,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired before sending request
      if (isTokenExpired(token)) {
        console.log('Token expired, clearing auth data');
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors (401, 403, 411)
    if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 411) {
      console.log('Authentication error detected:', error.response.status);
      
      // Clear auth data
      clearAuthData();
      
      // Clear recovery popup tracking
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id) {
        localStorage.removeItem(`recoveryPopupShown_${currentUser.id}`);
        localStorage.removeItem(`recoveryCompleted_${currentUser.id}`);
      }
      
      // Dispatch auth state change event
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { isLoggedIn: false, user: null } 
      }));
      
      // Redirect to login page with current path
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      
      // Prevent the original error from being thrown
      return Promise.resolve();
    }
    
    // For other errors, let them pass through
    return Promise.reject(error);
  }
);

export default api;
