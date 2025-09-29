import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { BACKEND } from "../assets/Vars";
import { useAuth } from "../App";
import { Mail, Phone, Lock, Eye, EyeOff, Smartphone } from "lucide-react";

/*
 * LOGIN METHODS AVAILABLE:
 * 1. Email/Password login - Primary method
 * 2. Google OAuth login - Alternative method
 * 
 * PHONE LOGIN TEMPORARILY HIDDEN FROM UI - WILL RE-ENABLE LATER
 * All phone OTP functionality is preserved but hidden from user interface
 * All code remains intact for easy restoration
 */

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email"); // "email", "phone", or "google"
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  // Check for message from URL (e.g., from Google OAuth redirect)
  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setError(message);
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Phone OTP Login Flow
  const handleSendPhoneOTP = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BACKEND}/api/v1/otp/send-login-otp`, {
        mobile: formData.phone
      });

      if (response.status === 200) {
        setOtpSent(true);
        setError("");
        
        // Show different messages based on user type
        if (response.data.userType === 'google') {
          setMessage("OTP sent successfully! This Google account has a verified phone number and can log in via OTP.");
        } else {
          setMessage("OTP sent successfully! Check your phone for the verification code.");
        }
      }
    } catch (err) {
      console.log('Phone OTP Error:', err);
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (err.response?.status === 404) {
        errorMessage = "Phone number not found. Please sign up first.";
      } else if (err.response?.status === 400 && err.response?.data?.needsPhoneNumber) {
        errorMessage = "This Google account doesn't have a verified phone number. Please add a phone number to your profile first.";
      } else if (err.response?.status === 400 && err.response?.data?.needsPhoneVerification) {
        errorMessage = "This phone number is not verified. Please verify your phone number first.";
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
      const response = await axios.post(`${BACKEND}/api/v1/otp/verify-login-otp`, {
        mobile: formData.phone,
        otp: formData.otp
      });

      if (response.status === 200) {
        login(response.data.token, response.data.user);
        
        // Check for redirect parameter and navigate accordingly
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          navigate(decodeURIComponent(redirectUrl));
        } else {
          navigate("/");
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

  // Email/Password Login Flow
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BACKEND}/api/v1/user/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200) {
        login(response.data.token, response.data.user);
        
        // Check for redirect parameter and navigate accordingly
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          navigate(decodeURIComponent(redirectUrl));
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.log('Email Login Error:', err);
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response?.status === 401) {
        if (err.response.data.message.includes("not found")) {
          errorMessage = "Email not found. Please check your email or sign up.";
        } else if (err.response.data.message.includes("Incorrect password")) {
          errorMessage = "Incorrect password. Please try again.";
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.response?.status === 403) {
        errorMessage = "Email not verified. Please verify your email before logging in.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Flow
  const handleGoogleLogin = () => {
    const redirectUrl = searchParams.get('redirect');
    const googleAuthUrl = `${BACKEND}/api/v1/auth/google?action=login`;
    
    if (redirectUrl) {
      window.location.href = `${googleAuthUrl}&redirect=${encodeURIComponent(redirectUrl)}`;
    } else {
      window.location.href = googleAuthUrl;
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 flex justify-center items-center bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Method Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              loginMethod === "email"
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Mail className="h-5 w-5" />
            <span className="hidden sm:inline">Email</span>
          </button>
          <button
            onClick={() => setLoginMethod("google")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              loginMethod === "google"
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

        {error && (
          <div className="p-3 text-red-600 rounded-lg text-center bg-red-50 border border-red-200">
            {error}
            {error.includes("not found") && (
              <div className="mt-2 text-sm">
                <p className="text-gray-600">This email address is not registered. Please sign up first.</p>
                <button
                  onClick={() => navigate('/signup')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Go to Signup
                </button>
              </div>
            )}
            {error.includes("Email not verified") && (
              <div className="mt-2 text-sm">
                <p className="text-gray-600">Please check your email and click the verification link before logging in.</p>
                <button
                  onClick={() => setLoginMethod("google")}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Use Google Login Instead
                </button>
              </div>
            )}
            {error.includes("doesn't have a verified phone number") && (
              <div className="mt-2 text-sm">
                <p className="text-gray-600">You need to add a verified phone number to your Google account first.</p>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Go to Profile to Add Phone
                  </button>
                  <button
                    onClick={() => setLoginMethod("google")}
                    className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Use Google Login Instead
                  </button>
                </div>
              </div>
            )}
            {error.includes("not verified") && (
              <div className="mt-2 text-sm">
                <p className="text-gray-600">Your phone number needs to be verified before you can log in with OTP.</p>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Go to Profile to Verify Phone
                  </button>
                  <button
                    onClick={() => setLoginMethod("google")}
                    className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Use Google Login Instead
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {message && (
          <div className="p-3 text-green-600 rounded-lg text-center bg-green-50 border border-green-200">
            {message}
          </div>
        )}

        {/* Email/Password Login */}
        {loginMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        )}

        {/* Phone OTP Login - TEMPORARILY HIDDEN */}
        {/* 
        {loginMethod === "phone" && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSendPhoneOTP(); }} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
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
                  {loading ? "Verifying..." : "Verify OTP"}
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

        {/* Google Login */}
        {loginMethod === "google" && (
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
              <p className="text-gray-600 mb-6">Sign in with your Google account for a seamless experience</p>
              <button
                onClick={handleGoogleLogin}
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
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;