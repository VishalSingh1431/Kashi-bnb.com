import { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import { bg_main } from "./assets/Vars";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import Tour from "./Pages/Tour"; 

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

    checkAuth();
    
    // Listen for storage changes to update auth state
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom auth state change events
    const handleAuthStateChange = (event) => {
      const { isLoggedIn: newIsLoggedIn, user: newUser } = event.detail;
      setIsLoggedIn(newIsLoggedIn);
      setUser(newUser);
    };
    window.addEventListener('authStateChanged', handleAuthStateChange);
    
    // Removed automatic token validation to prevent unwanted logouts
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, [isLoggedIn]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    // Dispatch custom event for auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isLoggedIn: true, user: userData } }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    // Dispatch custom event for auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isLoggedIn: false, user: null } }));
  };

  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND || 'http://localhost:3000'}/api/v1/user/check`, {
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return true;
      } else {
        // Token is invalid, logout
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
      return false;
    }
  };

  const authValue = {
    isLoggedIn,
    user,
    login,
    logout,
    isLoading,
    validateToken
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="min-h-screen" style={{ backgroundColor: '#f3eadb' }}>
          <Navbar />
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
            <Route path="/hotel/:id" element={<HotelPage/>} />
            <Route path="/checkout/:id" element={<Checkout />} />

          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
