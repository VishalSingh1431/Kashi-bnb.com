// Authentication utility functions
import { useNavigate } from 'react-router-dom';

// Check if JWT token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('authUser');
};

// Handle JWT expiration - redirect to login
export const handleTokenExpiration = (navigate, redirectPath = null) => {
  console.log('JWT token expired, redirecting to login');
  clearAuthData();
  
  // Get current path for redirect after login
  const currentPath = redirectPath || window.location.pathname + window.location.search;
  
  // Redirect to login with current path as redirect parameter
  navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
};

// Check authentication status
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return { isAuthenticated: false, token: null, user: null };
  }
  
  if (isTokenExpired(token)) {
    clearAuthData();
    return { isAuthenticated: false, token: null, user: null };
  }
  
  try {
    const userData = JSON.parse(user);
    return { isAuthenticated: true, token, user: userData };
  } catch (error) {
    console.error('Error parsing user data:', error);
    clearAuthData();
    return { isAuthenticated: false, token: null, user: null };
  }
};

// Create auth header with token validation
export const createAuthHeader = () => {
  const { isAuthenticated, token } = checkAuthStatus();
  
  if (!isAuthenticated || !token) {
    return null;
  }
  
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

// Axios interceptor for handling 401/411 responses
export const setupAuthInterceptor = (axiosInstance, navigate) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 411)) {
        console.log('Authentication error detected, redirecting to login');
        handleTokenExpiration(navigate);
      }
      return Promise.reject(error);
    }
  );
};
