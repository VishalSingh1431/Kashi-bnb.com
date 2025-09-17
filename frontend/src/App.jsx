import { useState, useEffect, createContext, useContext, useCallback } from "react";
import "./App.css";
import { bg_main, BACKEND } from "./assets/Vars";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Slider from "./Components/Slider";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Footer from "./Components/Footer"; 
import HotelPage from "./Components/HotelPage";
import Activities from "./Pages/Activities";
import Listings from "./Pages/Listings";
import Signup from "./Pages/signup";
import Login from "./Pages/Login";
import Profile from "./Components/Profile"; 
import Owner from "./Pages/owner";
import Tourist from "./Pages/Tourist";
import Checkout from './Pages/Checkout';
import NumberForm from "./Components/NumberForm";
import ScrollToTop from "./Components/ScrollToTop";
import Tour from "./Pages/Tour";
import AuthCallback from "./Pages/AuthCallback";
import ForgotPassword from "./Pages/ForgotPassword";
import AdminRequests from "./Pages/AdminRequests";
import OwnerBookings from "./Pages/OwnerBookings";
import TeamMemberDashboard from "./Pages/TeamMemberDashboard"; 

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Only clear if there's a parsing error, not for other issues
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    // Run immediately for faster initial load
    checkAuth();
    
    // Listen for storage changes to update auth state (only for cross-tab changes)
    const handleStorageChange = (event) => {
      // Only respond to changes from other tabs, not same tab
      if (event.key === 'token' || event.key === 'user') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom auth state change events
    const handleAuthStateChange = (event) => {
      const { isLoggedIn: newIsLoggedIn, user: newUser } = event.detail;
      setIsLoggedIn(newIsLoggedIn);
      setUser(newUser);
    };
    window.addEventListener('authStateChanged', handleAuthStateChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []); // Removed isLoggedIn dependency to prevent infinite loops

  // Add global error handler to prevent crashes
  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error('Global error caught:', event.error);
      // Don't logout on JavaScript errors, just log them
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Don't logout on promise rejections, just log them
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    // Dispatch custom event for auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isLoggedIn: true, user: userData } }));
  }, []);

  const logout = useCallback((redirectToLogin = false) => {
    // Prevent multiple simultaneous logout calls
    if (!localStorage.getItem("token") && !localStorage.getItem("user")) {
      console.log('Logout: Already logged out, skipping');
      return;
    }
    
    // Clear recovery popup tracking for this user before clearing user data
    const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
    if (currentUser.id) {
      localStorage.removeItem(`recoveryPopupShown_${currentUser.id}`);
      localStorage.removeItem(`recoveryCompleted_${currentUser.id}`);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    // Dispatch custom event for auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isLoggedIn: false, user: null } }));
    
    // Redirect to login page if requested
    if (redirectToLogin) {
      window.location.href = '/login';
    }
  }, []);

  const validateToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(`${BACKEND}/api/v1/user/check`, {
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return true;
      } else if (response.status === 401 || response.status === 403) {
        // Only logout on actual authentication errors, not network issues
        console.log('Token validation failed with auth error, logging out');
        logout(true); // Redirect to login page
        return false;
      } else {
        // For other HTTP errors, don't logout - might be server issues
        console.log('Token validation failed with non-auth error:', response.status);
        return false;
      }
    } catch (error) {
      // Don't logout on network errors - could be temporary connectivity issues
      console.error('Token validation network error:', error);
      return false; // Return false but don't logout
    }
  }, [logout]);

  // Function to refresh user data from backend
  const refreshUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(`${BACKEND}/api/v1/user/me`, {
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.success && userData.user) {
          // Update local storage and state with fresh user data
          localStorage.setItem("user", JSON.stringify(userData.user));
          setUser(userData.user);
          // Dispatch custom event for auth state change
          window.dispatchEvent(new CustomEvent('authStateChanged', { 
            detail: { isLoggedIn: true, user: userData.user } 
          }));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return false;
    }
  }, []);

  const authValue = {
    isLoggedIn,
    user,
    login,
    logout,
    isLoading,
    validateToken,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen" style={{ backgroundColor: '#f3eadb' }}>
          <Navbar />
          <RouteAwareSpacer />
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/number" element={<NumberForm/>} />
            <Route path="/about" element={<About />} />
            <Route path="/activities" element={<Activities/>} />
            <Route path="/add-listing" element={<Listings/>} />
             
            <Route path="/tour" element={<Tour/>} /> 
            <Route path="/profile" element={<Profile/>} />
            <Route path="/owner" element={<Owner/>} />
            <Route path="/tourist" element={<Tourist/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/hotel/:id" element={<HotelPage/>} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/admin/requests" element={<AdminRequests />} />
            <Route path="/owner-bookings/:hotelId" element={<OwnerBookings />} />
            <Route path="/team/dashboard" element={<TeamMemberDashboard />} />

          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

// Spacer component: no gap on home, offset elsewhere
const RouteAwareSpacer = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <div aria-hidden="true" className={isHome ? "h-0" : "h-16 sm:h-20 md:h-28 lg:h-32 xl:h-36"}></div>
  );
};
