import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { BACKEND } from '../assets/Vars';
import { Mail, Phone, Lock, Eye, EyeOff, Smartphone, User, X } from "lucide-react";
import { useAuth } from '../App';

/*
 * PHONE SIGNUP TEMPORARILY HIDDEN FROM UI - WILL RE-ENABLE LATER
 * All phone OTP functionality is preserved but hidden from user interface
 * Only Google signup is currently visible to users
 * All code remains intact for easy restoration
 */

const Signup = () => {
  const [signupMethod, setSignupMethod] = useState("google"); // Temporarily hidden: "phone" or "google"
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    otp: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [success, setSuccess] = useState(false);
  // Recovery popup state removed - now handled by Home.jsx and Profile.jsx
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  // Check for message from URL (e.g., from Google OAuth redirect)
  useEffect(() => {
    const message = searchParams.get('message');
    const token = searchParams.get('token');
    const userData = searchParams.get('userData');
    
    if (message) {
      setError(message);
      navigate('/signup', { replace: true });
    }
    
    // Handle Google signup success
    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        
        console.log('Google signup: Processing user data:', user);
        
        // Store user data in localStorage and update auth context
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update authentication context
        login(token, user);
        
        console.log('Google signup: User data stored and auth context updated');
        
        // Recovery popup is now handled by Home.jsx - redirect to home
        // setShowRecoveryPopup(true); // This line is removed
        // setRecoveryType("phone"); // This line is removed
        
        // Check for redirect parameter and navigate accordingly
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          navigate(decodeURIComponent(redirectUrl), { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing Google user data:', error);
        setError('Failed to process Google signup data');
      }
    }
  }, [searchParams, navigate]);

  // Check if user needs to add recovery contact method after login
  // This useEffect is no longer needed as recovery is handled by Home.jsx and Profile.jsx
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   const token = localStorage.getItem('token');
    
  //   if (user.id && token) {
  //     // Check if user is missing phone or email
  //     if (!user.mobile && !user.phone) {
  //       // Google user without phone - show phone recovery popup
  //       // setShowRecoveryPopup(true); // This line is removed
  //       // setRecoveryType("phone"); // This line is removed
  //     } else if (!user.email) {
  //       // Phone user without email - show email recovery popup
  //       // setShowRecoveryPopup(true); // This line is removed
  //       // setRecoveryType("email"); // This line is removed
  //     }
  //   }
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Phone OTP Signup Flow
  const handleSendPhoneOTP = async () => {
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Please enter your name");
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BACKEND}/api/v1/otp/send-signup-otp`, {
        name: formData.name,
        mobile: formData.phone,
        email: formData.email
      });

      if (response.status === 200) {
        setOtpSent(true);
        setError("");
        
        if (response.data.developmentMode) {
          let devMessage = `Development Mode - OTP: ${response.data.otp}`;
          if (response.data.smsError) {
            devMessage += ` (SMS Error: ${response.data.smsError})`;
          }
          setMessage(devMessage);
        } else {
          setMessage("OTP sent successfully! Check your phone for the verification code.");
        }
      }
    } catch (err) {
      console.log('Phone OTP Error:', err);
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (err.response?.status === 409) {
        errorMessage = "This phone number is already registered. Please login instead.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BACKEND}/api/v1/otp/verify-signup-otp`, {
        name: formData.name,
        mobile: formData.phone,
        otp: formData.otp
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Phone signup: Response received:', response.data);
        
        // Store user data in localStorage and update auth context
        if (response.data.token && response.data.user) {
          console.log('Phone signup: Storing user data in localStorage');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Update authentication context
          login(response.data.token, response.data.user);
          
          // Verify data was stored
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');
          console.log('Phone signup: Stored token:', !!storedToken);
          console.log('Phone signup: Stored user:', storedUser);
        } else {
          console.error('Phone signup: Missing token or user data in response');
        }
        
        // Check for redirect parameter and navigate accordingly
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          navigate(decodeURIComponent(redirectUrl));
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.log('Phone OTP Verification Error:', err);
      let errorMessage = "OTP verification failed. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google Signup Flow
  const handleGoogleSignup = () => {
    const redirectUrl = searchParams.get('redirect');
    const googleAuthUrl = `${BACKEND}/api/v1/auth/google?action=signup`;
    
    if (redirectUrl) {
      window.location.href = `${googleAuthUrl}&redirect=${encodeURIComponent(redirectUrl)}`;
    } else {
      window.location.href = googleAuthUrl;
    }
  };

  // Recovery Flow (Email/Phone)
  // This function is no longer needed as recovery is handled by Home.jsx and Profile.jsx
  // const handleSendRecoveryOTP = async () => {
  //   if (recoveryType === "email") {
  //     if (!formData.email || !formData.email.includes('@')) {
  //       setError("Please enter a valid email address");
  //       return;
  //     }
  //   } else if (recoveryType === "phone") {
  //     if (!formData.phone || formData.phone.length < 10) {
  //       setError("Please enter a valid phone number");
  //       return;
  //     }
  //     // For phone recovery, we need the user's name and ID from localStorage
  //     const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  //     if (!currentUser.name) {
  //       setError("User name not found. Please try again.");
  //       return;
  //     }
  //     if (!currentUser.id) {
  //       setError("User session not found. Please sign up again.");
  //       return;
  //     }
  //     // Update formData with the user's name
  //     setFormData(prev => ({ ...prev, name: currentUser.name }));
  //   }

  //   setRecoveryLoading(true);
  //   setError("");

  //   try {
  //     const endpoint = recoveryType === "email" 
  //       ? `${BACKEND}/api/v1/otp/send-email-otp`
  //       : `${BACKEND}/api/v1/otp/send-phone-recovery-otp`;
      
  //     const data = recoveryType === "email" 
  //       ? { email: formData.email }
  //       : { mobile: formData.phone, userId: JSON.parse(localStorage.getItem('user') || '{}').id };

  //     const response = await axios.post(endpoint, data);

  //     if (response.status === 200) {
  //       setRecoveryOtpSent(true);
  //       setError("");
        
  //       if (response.data.developmentMode) {
  //         setMessage(`Development Mode - OTP Generated: ${response.data.otp}`);
  //       } else {
  //         setMessage(`OTP sent to your ${recoveryType}!`);
  //       }
  //     }
  //   } catch (err) {
  //     console.log('Recovery OTP Error:', err);
  //     let errorMessage = `Failed to send ${recoveryType} OTP. Please try again.`;
      
  //     if (err.response?.status === 404) {
  //       errorMessage = "User not found. Please sign up again.";
  //     } else if (err.response?.status === 409) {
  //       errorMessage = "This contact method is already registered by another user.";
  //     } else if (err.response?.status === 429) {
  //       errorMessage = "Too many OTP requests. Please wait before trying again.";
  //     } else if (err.response?.data?.message) {
  //       errorMessage = err.response.data.message;
  //     }
      
  //     setError(errorMessage);
  //   } finally {
  //     setRecoveryLoading(false);
  //   }
  // };

  // const handleVerifyRecoveryOTP = async (e) => {
  //   e.preventDefault();
  //   if (!recoveryOtp || recoveryOtp.length < 4) {
  //     setError("Please enter a valid OTP");
  //     return;
  //   }

  //   setRecoveryLoading(true);
  //   setError("");

  //   try {
  //     if (recoveryType === "email") {
  //       // Verify email OTP
  //       const response = await axios.post(`${BACKEND}/api/v1/otp/verify-email-otp`, {
  //         email: formData.email,
  //         otp: recoveryOtp
  //       });

  //       if (response.status === 200) {
  //         // Update user with email
  //         await axios.post(`${BACKEND}/api/v1/otp/update-user-email`, {
  //           userId: response.data.user.id,
  //           email: formData.email
  //         });

  //         setMessage("Email verified and added successfully!");
  //         setShowRecoveryPopup(false);
  //         setRecoveryOtpSent(false);
  //         setRecoveryOtp("");
          
  //         // Update localStorage with new user data
  //         const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  //         currentUser.email = formData.email;
  //         currentUser.verified = true;
  //         localStorage.setItem('user', JSON.stringify(currentUser));
          
  //         // Update the auth context to reflect the new user data
  //         if (login) {
  //           const token = localStorage.getItem('token');
  //           login(token, currentUser);
  //         }
          
  //         // Redirect to home after successful verification
  //         setTimeout(() => {
  //           navigate('/');
  //         }, 2000);
  //       }
  //     } else {
  //       // For phone recovery, we need to update the existing user's phone
  //       const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
  //       // Use the phone recovery verification endpoint
  //       const response = await axios.post(`${BACKEND}/api/v1/otp/verify-phone-recovery-otp`, {
  //         mobile: formData.phone,
  //         otp: recoveryOtp,
  //         userId: currentUser.id
  //       });

  //       if (response.status === 200) {
  //         setMessage("Phone verified and added successfully!");
  //         setShowRecoveryPopup(false);
  //         setRecoveryOtpSent(false);
  //         setRecoveryOtp("");
          
  //         // Update localStorage with new user data
  //         const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  //         currentUser.mobile = formData.phone;
  //         localStorage.setItem('user', JSON.stringify(currentUser));
          
  //         // Update the auth context to reflect the new user data
  //         if (login) {
  //           const token = localStorage.getItem('token');
  //           login(token, currentUser);
  //         }
          
  //         // Redirect to home after successful verification
  //         setTimeout(() => {
  //           navigate('/');
  //         }, 2000);
  //       }
  //     }
  //   } catch (err) {
  //     console.log('Recovery OTP Verification Error:', err);
  //     let errorMessage = `${recoveryType.charAt(0).toUpperCase() + recoveryType.slice(1)} verification failed. Please try again.`;
      
  //     if (err.response?.status === 400) {
  //       errorMessage = "Invalid or expired OTP. Please try again.";
  //     } else if (err.response?.status === 404) {
  //       errorMessage = "User not found. Please sign up again.";
  //     } else if (err.response?.data?.message) {
  //       errorMessage = err.response.data.message;
  //     }
      
  //     setError(errorMessage);
  //   } finally {
  //     setRecoveryLoading(false);
  //   }
  // };

  // const skipRecovery = () => {
  //   setShowRecoveryPopup(false);
    
  //   // Check if user is already logged in
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   const token = localStorage.getItem('token');
    
  //   if (user.id && token) {
  //     // User is logged in, redirect to home
  //     navigate('/');
  //   } else {
  //     // User is not logged in, redirect to home after delay
  //     setTimeout(() => {
  //       navigate('/');
  //     }, 1000);
  //   }
  // };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 flex justify-center items-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-100 text-center">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold">Account Created Successfully!</h2>
          <p className="text-gray-700">
            Your account has been created successfully! Redirecting to home...
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                const redirectUrl = searchParams.get('redirect');
                if (redirectUrl) {
                  navigate(decodeURIComponent(redirectUrl));
                } else {
                  navigate('/');
                }
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 flex justify-center items-center bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Choose your preferred way to sign up</p>
        </div>

        {/* Method Selection - TEMPORARILY HIDDEN */}
        {/* 
        <div className="flex gap-2">
          <button
            onClick={() => setSignupMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              signupMethod === "phone"
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Phone className="h-5 w-5" />
            <span className="hidden sm:inline">Phone OTP</span>
          </button>
          <button
            onClick={() => setSignupMethod("google")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              signupMethod === "google"
                ? "bg-red-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="hidden sm:inline">Google</span>
          </button>
        </div>
        */}

        {error && (
          <div className="p-3 text-red-600 rounded-lg text-center bg-red-50 border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 text-green-600 rounded-lg text-center bg-green-50 border border-green-200">
            {message}
          </div>
        )}

        {/* Phone OTP Signup - TEMPORARILY HIDDEN */}
        {/* 
        {signupMethod === "phone" && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSendPhoneOTP(); }} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter your full name as you'd like it to appear</p>
                </div>

                <div>
                  <label className="block text-gray-500 mb-2 font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">We'll send an OTP to verify your phone number</p>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading}
                  className={`w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl ${
                    otpLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {otpLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOTP} className="space-y-4">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Verify OTP</h3>
                  <p className="text-gray-600 text-sm">
                    We've sent a 6-digit OTP to {formData.phone}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Enter OTP</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setFormData(prev => ({ ...prev, otp: "" }));
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Change Phone Number
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        */}

        {/* Google Signup */}
        {signupMethod === "google" && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="h-10 w-10 text-white" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <p className="text-gray-600 mb-6">Sign up with your Google account for a seamless experience</p>
              <button
                onClick={handleGoogleSignup}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium transition-all duration-200 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {/* Recovery Popup - REMOVED - Now handled by Home.jsx and Profile.jsx */}
      {/* {showRecoveryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Add {recoveryType === "email" ? "Email" : "Phone"} for Recovery
              </h3>
              <button
                onClick={skipRecovery}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 text-sm">
              Adding a {recoveryType} will help you recover your account if needed. You can skip this step.
            </p>

            {!recoveryOtpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    {recoveryType === "email" ? "Email Address" : "Phone Number"}
                  </label>
                  <div className="relative">
                    {recoveryType === "email" ? (
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    ) : (
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    )}
                    <input
                      type={recoveryType === "email" ? "email" : "tel"}
                      value={formData[recoveryType]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [recoveryType]: e.target.value }))}
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
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Enter OTP</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
      )} */}
    </div>
  );
}

export default Signup;
