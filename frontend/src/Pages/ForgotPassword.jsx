import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { BACKEND } from '../assets/Vars';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const renderTabButton = (tab, icon, label) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
        activeTab === tab
          ? "bg-orange-500 text-white shadow-lg"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const handleSendOTP = async () => {
    if (!formData.mobile) {
      setError('Please enter your mobile number');
      return;
    }

    if (formData.mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND}/api/v1/forgot-password/send-mobile-otp`, {
        mobile: formData.mobile
      });

      setMessage(response.data.message);
      setOtpSent(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND}/api/v1/forgot-password/send-email`, {
        email: formData.email
      });

      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.mobile || !formData.otp || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND}/api/v1/forgot-password/reset-with-otp`, {
        mobile: formData.mobile,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithToken = async (e) => {
    e.preventDefault();
    
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Get token and email from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    if (!token || !email) {
      setError('Invalid reset link');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND}/api/v1/forgot-password/reset-with-token`, {
        token,
        email,
        newPassword: formData.newPassword
      });

      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 flex justify-center items-center bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
          <p className="text-gray-600">Choose how you'd like to reset your password</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2">
          {renderTabButton('email', <Mail className="h-5 w-5" />, 'Email')}
          {renderTabButton('mobile', <Phone className="h-5 w-5" />, 'Mobile OTP')}
        </div>

        {/* Error and Success Messages */}
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

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <button
              onClick={handleSendEmail}
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>

            <div className="text-center text-sm text-gray-600">
              Check your email for a password reset link
            </div>
          </div>
        )}

        {/* Mobile OTP Tab */}
        {activeTab === 'mobile' && (
          <form onSubmit={handleResetWithOTP} className="space-y-4">
            <div>
              <label htmlFor="mobile" className="block text-gray-700 mb-2 font-medium">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  maxLength="10"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={otpLoading}
                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl ${
                  otpLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {otpLoading ? 'Sending...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <div>
                  <label htmlFor="otp" className="block text-gray-700 mb-2 font-medium">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    maxLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center text-lg tracking-widest transition-all duration-200"
                    placeholder="000000"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-gray-700 mb-2 font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
