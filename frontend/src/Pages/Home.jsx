import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { BACKEND } from '../assets/Vars';
import Slider from '../Components/Slider'
import Contact from './Contact'
import About from './About'
import Footer from '../Components/Footer' 
import Card from '../Components/Card' 
import Homestay from './Homestay' 
import Hotel from './Hotel'
import AdminBookings from './AdminBookings'
import Listings from './Listings'
import Login from './Login'
import Profile from '../Components/Profile'  
import CheckOut from '../Components/CheckOut'
import { FiMail, FiPhone, FiX } from 'react-icons/fi';
import { useAuth } from '../App';

const Home = () => {
  // Recovery popup state
  const [showRecoveryPopup, setShowRecoveryPopup] = useState(false);
  const [recoveryType, setRecoveryType] = useState(""); // "email" or "phone"
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryOtpSent, setRecoveryOtpSent] = useState(false);
  const [recoveryOtp, setRecoveryOtp] = useState("");
  const [recoveryFormData, setRecoveryFormData] = useState({
    phone: "",
    email: ""
  });
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [recoveryError, setRecoveryError] = useState("");

  const { login } = useAuth();

  // Check if user needs to add recovery contact method
  useEffect(() => {
    const checkUserRecovery = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      
      console.log('Home: Checking user data:', user);
      console.log('Home: Token exists:', !!token);
      console.log('Home: User ID:', user.id);
      console.log('Home: User mobile:', user.mobile);
      console.log('Home: User phone:', user.phone);
      console.log('Home: User time:', user.time);
      console.log('Home: User verified:', user.verified);
      
      if (user.id && token) {
        // Check if user has already completed recovery or seen the popup
        const recoveryCompleted = localStorage.getItem(`recoveryCompleted_${user.id}`);
        const hasSeenRecoveryPopup = localStorage.getItem(`recoveryPopupShown_${user.id}`);
        
        console.log('Home: Recovery completed:', recoveryCompleted);
        console.log('Home: Has seen recovery popup:', hasSeenRecoveryPopup);
        
        // If user has already completed recovery, NEVER show popup again
        if (recoveryCompleted === 'true') {
          console.log('Home: User has completed recovery, never showing popup again');
          return;
        }
        
        // If user has already seen the popup in this session, don't show again
        if (hasSeenRecoveryPopup) {
          console.log('Home: User has already seen recovery popup in this session');
          return;
        }
        
        // Check if user is missing phone or email (only for new signups)
        if (!user.mobile && !user.phone) {
          // Additional check: only show for very new users (within 1 hour of signup)
          const userCreatedAt = new Date(user.time || user.createdAt || Date.now());
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          
          console.log('Home: User missing phone/phone');
          console.log('Home: User created at:', userCreatedAt);
          console.log('Home: One hour ago:', oneHourAgo);
          console.log('Home: Is user new (within 1 hour):', userCreatedAt > oneHourAgo);
          
          if (userCreatedAt > oneHourAgo) {
            console.log('Home: New user missing phone, showing phone recovery popup ONCE');
            setShowRecoveryPopup(true);
            setRecoveryType("phone");
            
            // Mark that user has seen the recovery popup for this session
            localStorage.setItem(`recoveryPopupShown_${user.id}`, 'true');
            
            // NO MORE AUTO-HIDE - popup stays until user action
            // setTimeout(() => {
            //   setShowRecoveryPopup(false);
            // }, 10000);
          } else {
            console.log('Home: User is not a new signup, marking recovery as completed');
            localStorage.setItem(`recoveryCompleted_${user.id}`, 'true');
          }
        } else if (!user.email) {
          // Additional check: only show for very new users (within 1 hour of signup)
          const userCreatedAt = new Date(user.time || user.createdAt || Date.now());
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          
          console.log('Home: User missing email');
          console.log('Home: User created at:', userCreatedAt);
          console.log('Home: One hour ago:', oneHourAgo);
          console.log('Home: Is user new (within 1 hour):', userCreatedAt > oneHourAgo);
          
          if (userCreatedAt > oneHourAgo) {
            console.log('Home: New user missing email, showing email recovery popup ONCE');
            setShowRecoveryPopup(true);
            setRecoveryType("email");
            
            // Mark that user has seen the recovery popup for this session
            localStorage.setItem(`recoveryPopupShown_${user.id}`, 'true');
            
            // NO MORE AUTO-HIDE - popup stays until user action
            // setTimeout(() => {
            //   setShowRecoveryPopup(false);
            // }, 10000);
          } else {
            console.log('Home: User is not a new signup, marking recovery as completed');
            localStorage.setItem(`recoveryCompleted_${user.id}`, 'true');
          }
        } else {
          console.log('Home: User has both phone and email, marking recovery as completed');
          // User has both contact methods, mark recovery as completed forever
          localStorage.setItem(`recoveryCompleted_${user.id}`, 'true');
        }
      } else {
        console.log('Home: No user or token found');
      }
    };

    // Check immediately
    checkUserRecovery();

    // Also check when localStorage changes (for Google signup)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        console.log('Home: Storage changed, rechecking user recovery needs');
        setTimeout(checkUserRecovery, 100); // Small delay to ensure localStorage is updated
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check every 2 seconds for the first 10 seconds (for Google signup redirect)
    let checkCount = 0;
    const interval = setInterval(() => {
      if (checkCount < 5) {
        checkUserRecovery();
        checkCount++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Recovery popup functions
  const handleSendRecoveryOTP = async () => {
    if (recoveryType === "email") {
      if (!recoveryFormData.email || !recoveryFormData.email.includes('@')) {
        setRecoveryError("Please enter a valid email address");
        return;
      }
    } else if (recoveryType === "phone") {
      if (!recoveryFormData.phone || recoveryFormData.phone.length < 10) {
        setRecoveryError("Please enter a valid phone number");
        return;
      }
    }

    setRecoveryLoading(true);
    setRecoveryError("");

    try {
      const endpoint = recoveryType === "email" 
        ? `${BACKEND}/api/v1/otp/send-add-email-otp`  // Use add email endpoint for new emails
        : `${BACKEND}/api/v1/otp/send-phone-recovery-otp`;
      
      const data = recoveryType === "email" 
        ? { email: recoveryFormData.email, userId: JSON.parse(localStorage.getItem('user') || '{}').id }
        : { mobile: recoveryFormData.phone, userId: JSON.parse(localStorage.getItem('user') || '{}').id };

      const response = await axios.post(endpoint, data);

      if (response.status === 200) {
        setRecoveryOtpSent(true);
        setRecoveryError("");
        
        if (response.data.developmentMode) {
          let message = `Development Mode - OTP Generated: ${response.data.otp}`;
          if (recoveryType === "phone" && response.data.smsError) {
            message += ` (SMS Error: ${response.data.smsError})`;
          } else if (recoveryType === "email" && response.data.emailError) {
            message += ` (Email Error: ${response.data.emailError})`;
          }
          setRecoveryMessage(message);
        } else {
          setRecoveryMessage(`OTP sent to your ${recoveryType}!`);
        }
      }
    } catch (err) {
      console.log('Recovery OTP Error:', err);
      let errorMessage = `Failed to send ${recoveryType} OTP. Please try again.`;
      
      if (err.response?.status === 404) {
        if (recoveryType === "email") {
          errorMessage = "Email not found. Please sign up first.";
        } else {
          errorMessage = "User not found. Please sign up again.";
        }
      } else if (err.response?.status === 409) {
        if (recoveryType === "email") {
          errorMessage = "This email is already registered by another user.";
        } else {
          errorMessage = "This phone number is already registered by another user.";
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setRecoveryError(errorMessage);
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleVerifyRecoveryOTP = async (e) => {
    e.preventDefault();
    if (!recoveryOtp || recoveryOtp.length < 4) {
      setRecoveryError("Please enter a valid OTP");
      return;
    }

    setRecoveryLoading(true);
    setRecoveryError("");

    try {
      if (recoveryType === "email") {
        // Verify email OTP using add email endpoint
        const response = await axios.post(`${BACKEND}/api/v1/otp/verify-add-email-otp`, {
          email: recoveryFormData.email,
          otp: recoveryOtp,
          userId: JSON.parse(localStorage.getItem('user') || '{}').id
        });

        if (response.status === 200) {
          // Email is already verified through OTP, just update the user data
          setRecoveryMessage("Email verified and added successfully!");
          setShowRecoveryPopup(false);
          setRecoveryOtpSent(false);
          setRecoveryOtp("");
          
          // Update localStorage with new user data
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          currentUser.email = recoveryFormData.email;
          currentUser.verified = true;
          localStorage.setItem('user', JSON.stringify(currentUser));
          
          // Update authentication context using login function
          if (login) {
            const token = localStorage.getItem('token');
            login(token, currentUser);
          }
          
          // Clear recovery popup tracking since user completed the process
          localStorage.removeItem(`recoveryPopupShown_${currentUser.id}`);
          localStorage.setItem(`recoveryCompleted_${currentUser.id}`, 'true'); // Mark as completed
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('userDataUpdated', { 
            detail: { user: currentUser } 
          }));
          
          // Show success message and redirect to profile
          setTimeout(() => {
            window.location.href = '/profile';
          }, 2000);
        }
      } else {
        // For phone recovery, we need to update the existing user's phone
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Use the phone recovery verification endpoint
        const response = await axios.post(`${BACKEND}/api/v1/otp/verify-phone-recovery-otp`, {
          mobile: recoveryFormData.phone,
          otp: recoveryOtp,
          userId: currentUser.id
        });

        if (response.status === 200) {
          setRecoveryMessage("Phone verified and added successfully!");
          setShowRecoveryPopup(false);
          setRecoveryOtpSent(false);
          setRecoveryOtp("");
          
          // Update localStorage with new user data
          currentUser.mobile = recoveryFormData.phone;
          localStorage.setItem('user', JSON.stringify(currentUser));
          
          // Update authentication context using login function
          if (login) {
            const token = localStorage.getItem('token');
            login(token, currentUser);
          }
          
          // Clear recovery popup tracking since user completed the process
          localStorage.removeItem(`recoveryPopupShown_${currentUser.id}`);
          localStorage.setItem(`recoveryCompleted_${currentUser.id}`, 'true'); // Mark as completed
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('userDataUpdated', { 
            detail: { user: currentUser } 
          }));
          
          // Show success message and redirect to profile
          setTimeout(() => {
            window.location.href = '/profile';
          }, 2000);
        }
      }
    } catch (err) {
      console.log('Recovery OTP Verification Error:', err);
      let errorMessage = `${recoveryType.charAt(0).toUpperCase() + recoveryType.slice(1)} verification failed. Please try again.`;
      
      if (err.response?.status === 400) {
        errorMessage = "Invalid or expired OTP. Please try again.";
      } else if (err.response?.status === 404) {
        errorMessage = "User not found. Please sign up again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setRecoveryError(errorMessage);
    } finally {
      setRecoveryLoading(false);
    }
  };

  const skipRecovery = () => {
    console.log('Skip recovery clicked');
    setShowRecoveryPopup(false);
    setRecoveryOtpSent(false);
    setRecoveryOtp("");
    setRecoveryError("");
    setRecoveryMessage("");
    
    // Mark recovery as completed when user skips
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.id) {
      localStorage.removeItem(`recoveryPopupShown_${currentUser.id}`);
      localStorage.setItem(`recoveryCompleted_${currentUser.id}`, 'true');
      console.log('Home: Recovery marked as completed (skipped)');
    }
  };

  return (
    <div className="min-h-screen">
      <Slider/>  
      <Homestay/> 
      {/* <CheckOut/> */}

      {/* Recovery Popup */}
      {showRecoveryPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'transparent' }}
        >
          <div 
            className="bg-white rounded-2xl p-6 shadow-2xl border-2 border-orange-200 max-w-md w-full mx-4"
            style={{ 
              backgroundColor: 'white',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Add {recoveryType === "email" ? "Email" : "Phone"} for Recovery
              </h3>
              <button
                onClick={skipRecovery}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 text-sm mt-2">
              Adding a {recoveryType} will help you recover your account if needed. You can skip this step.
            </p>

            {recoveryError && (
              <div className="mt-4 p-3 text-red-600 rounded-lg text-center bg-red-50 border border-red-200">
                {recoveryError}
              </div>
            )}

            {recoveryMessage && (
              <div className="mt-4 p-3 text-green-600 rounded-lg text-center bg-green-50 border border-green-200">
                {recoveryMessage}
              </div>
            )}

            {!recoveryOtpSent ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    {recoveryType === "email" ? "Email Address" : "Phone Number"}
                  </label>
                  <div className="relative">
                    {recoveryType === "email" ? (
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    ) : (
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    )}
                    <input
                      type={recoveryType === "email" ? "email" : "tel"}
                      value={recoveryFormData[recoveryType]}
                      onChange={(e) => setRecoveryFormData(prev => ({ ...prev, [recoveryType]: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder={`Enter your ${recoveryType}`}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSendRecoveryOTP}
                    disabled={recoveryLoading}
                    className={`flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-orange-600 hover:to-yellow-600 ${
                      recoveryLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {recoveryLoading ? "Sending..." : "Send OTP"}
                  </button>
                  <button
                    onClick={skipRecovery}
                    className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-all duration-200"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Enter OTP</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={recoveryOtp}
                      onChange={(e) => setRecoveryOtp(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleVerifyRecoveryOTP}
                    disabled={recoveryLoading}
                    className={`flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-green-600 hover:to-blue-600 ${
                      recoveryLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {recoveryLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    onClick={skipRecovery}
                    className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-all duration-200"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
