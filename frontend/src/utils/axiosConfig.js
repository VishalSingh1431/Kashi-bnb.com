import axios from 'axios';
import { BACKEND } from '../assets/Vars';

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
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
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
      
      // Redirect to login page
      window.location.href = '/login';
      
      // Prevent the original error from being thrown
      return Promise.resolve();
    }
    
    // For other errors, let them pass through
    return Promise.reject(error);
  }
);

export default api;
