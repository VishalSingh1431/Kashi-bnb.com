import React, { useState, useEffect } from 'react';
import { FiEdit, FiSave, FiLogOut, FiUser, FiMail, FiPhone, FiMapPin, FiClock, FiX, FiCheck, FiShield } from 'react-icons/fi';
import api from '../../utils/axiosConfig';
import { BACKEND } from '../../assets/Vars';
import { useAuth } from '../../App';

const PersonalInfo = ({ userData, editMode, profileFormData, handleProfileInputChange, handleSaveProfile, setEditMode, handleLogout, successMessage }) => {
  const { login } = useAuth();
  const [originalData, setOriginalData] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationField, setVerificationField] = useState(''); // Which field needs verification

  // Store original data when entering edit mode
  useEffect(() => {
    if (editMode) {
      const original = {
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
        address: userData.address || ''
      };
      setOriginalData(original);
      setOtpVerified(false);
      setOtpSent(false);
      setOtp('');
      setOtpError('');
      setOtpMessage('');
      setVerificationField('');
    }
  }, [editMode, userData]);

  // Check if any field has changed
  const hasChanges = () => {
    return (
      profileFormData.first_name !== originalData.first_name ||
      profileFormData.last_name !== originalData.last_name ||
      profileFormData.email !== originalData.email ||
      profileFormData.mobile !== originalData.mobile ||
      profileFormData.address !== originalData.address
    );
  };

  // Check which specific field changed
  const getChangedField = () => {
    if (profileFormData.first_name !== originalData.first_name) return 'first_name';
    if (profileFormData.last_name !== originalData.last_name) return 'last_name';
    if (profileFormData.email !== originalData.email) return 'email';
    if (profileFormData.mobile !== originalData.mobile) return 'mobile';
    if (profileFormData.address !== originalData.address) return 'address';
    return null;
  };

  // Check if changed field needs OTP verification
  const needsVerification = (field) => {
    // Mobile and email always need verification
    if (field === 'mobile' || field === 'email') return true;
    // First name, last name and address don't need OTP verification
    return false;
  };

  const handleSendOTP = async () => {
    const changedField = getChangedField();
    if (!changedField) return;

    setOtpError('');

    try {
      let endpoint, data;

      if (changedField === 'mobile') {
        endpoint = `${BACKEND}/api/v1/otp/send-phone-recovery-otp`;
        data = { mobile: profileFormData.mobile, userId: userData.id };
      } else if (changedField === 'email') {
        endpoint = `${BACKEND}/api/v1/otp/send-add-email-otp`;  // Use add email endpoint
        data = { email: profileFormData.email, userId: userData.id };  // Include userId
      } else {
        setOtpError("This field doesn't require OTP verification");
        return;
      }

      const response = await api.post(endpoint.replace(BACKEND, ''), data);

      if (response.status === 200) {
        setOtpSent(true);
        setVerificationField(changedField);
        setOtpError('');
        
        if (response.data.developmentMode) {
          let message = `Development Mode - OTP Generated: ${response.data.otp}`;
          if (changedField === 'phone' && response.data.smsError) {
            message += ` (SMS Error: ${response.data.smsError})`;
          } else if (changedField === 'email' && response.data.emailError) {
            message += ` (Email Error: ${response.data.emailError})`;
          }
          setOtpMessage(message);
        } else {
          setOtpMessage(`OTP sent to your ${changedField}!`);
        }
      }
    } catch (err) {
      console.log('OTP Error:', err);
      let errorMessage = `Failed to send ${verificationField} OTP. Please try again.`;
      
      if (err.response?.status === 404) {
        if (verificationField === 'email') {
          errorMessage = "User not found. Please check your user ID.";
        } else {
          errorMessage = "User not found. Please check your user ID.";
        }
      } else if (err.response?.status === 409) {
        if (verificationField === 'email') {
          errorMessage = "This email is already registered by another user.";
        } else {
          errorMessage = "This phone number is already registered by another user.";
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setOtpError(errorMessage);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setOtpError("Please enter a valid OTP");
      return;
    }

    setOtpVerifying(true);
    setOtpError('');

    try {
      let endpoint, data;

      if (verificationField === 'mobile') {
        endpoint = `${BACKEND}/api/v1/otp/verify-phone-recovery-otp`;
        data = { mobile: profileFormData.mobile, otp: otp, userId: userData.id };
      } else if (verificationField === 'email') {
        endpoint = `${BACKEND}/api/v1/otp/verify-add-email-otp`;  // Use add email verification endpoint
        data = { email: profileFormData.email, otp: otp, userId: userData.id };  // Include userId
      }

      const response = await api.post(endpoint.replace(BACKEND, ''), data);

      if (response.status === 200) {
        setOtpMessage(`${verificationField.charAt(0).toUpperCase() + verificationField.slice(1)} verified successfully! You can now save your profile.`);
        setOtpVerified(true);
        setOtpSent(false);
        setOtp('');
        
        // Update user data after successful verification using backend response
        if (response.data.user) {
          const updatedUserData = { ...userData, ...response.data.user };
          
          // Update localStorage
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          
          // Update authentication context
          if (login) {
            const token = localStorage.getItem('token');
            login(token, updatedUserData);
          }
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('userDataUpdated', { 
            detail: { user: updatedUserData } 
          }));
        }
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setOtpMessage('');
        }, 3000);
      }
    } catch (err) {
      console.log('OTP Verification Error:', err);
      let errorMessage = `${verificationField.charAt(0).toUpperCase() + verificationField.slice(1)} verification failed. Please try again.`;
      
      if (err.response?.status === 400) {
        errorMessage = "Invalid or expired OTP. Please try again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setOtpError(errorMessage);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSaveProfileWithVerification = () => {
    const changedField = getChangedField();
    
    // If no changes, allow save
    if (!changedField) {
      handleSaveProfile();
      return;
    }

    // If field needs verification but not verified, prevent save
    if (needsVerification(changedField) && !otpVerified) {
      setOtpError(`Please verify your ${changedField} with OTP before saving`);
      return;
    }
    
    // If field doesn't need verification or is verified, allow save
    handleSaveProfile();
  };

  const canSaveProfile = () => {
    const changedField = getChangedField();
    
    // If no changes, can save
    if (!changedField) return true;
    
    // If field doesn't need verification, can save
    if (!needsVerification(changedField)) return true;
    
    // If field needs verification, must be verified
    return otpVerified;
  };

  const getVerificationMessage = () => {
    const changedField = getChangedField();
    if (!changedField) return null;
    
    if (needsVerification(changedField)) {
      return `Please verify your ${changedField} with OTP before saving`;
    } else {
      return `You can save your ${changedField} changes`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header Section - Centered */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white text-center">
        <div className="flex flex-col items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Personal Information</h1>
            <p className="text-indigo-100 mt-2">Manage your account details and preferences</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {editMode ? (
              <>
                <button 
                  onClick={handleSaveProfileWithVerification}
                  disabled={!canSaveProfile()}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    canSaveProfile() 
                      ? 'bg-green-500 hover:bg-green-600 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  <FiSave className="mr-2" /> Save Changes
                </button>
                <button 
                  onClick={() => setEditMode(false)}
                  className="flex items-center px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-black rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={() => setEditMode(true)}
                className="flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiEdit className="mr-2" /> Edit Profile
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-black rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Verification Status Banner */}
      {editMode && hasChanges() && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6 rounded-r-lg">
          <div className="flex items-start">
            <FiShield className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">Profile Changes Detected</h3>
              <p className="text-sm text-blue-600 mt-1">{getVerificationMessage()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6 rounded-r-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <p className="text-sm text-green-600 mt-1">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info - Centered */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center mb-4 shadow-lg mx-auto">
                <span className="text-4xl font-bold text-white">
                  {(userData.first_name?.charAt(0) || userData.name?.charAt(0) || 'U').toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2 text-center">
                {userData.first_name && userData.last_name 
                  ? `${userData.first_name} ${userData.last_name}` 
                  : userData.name || 'User'
                }
              </h2>
              <div className="flex items-center gap-2 mb-4 justify-center">
                {userData.is_admin ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <FiShield className="h-4 w-4 mr-1" />
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FiUser className="h-4 w-4 mr-1" />
                    User
                  </span>
                )}
              </div>
              <div className="flex items-center text-gray-500 text-sm justify-center">
                <FiClock className="mr-2" />
                <span>Member since {new Date(userData.time).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Form Fields - Left Aligned */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <FiUser className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">Full Name</h3>
                    <p className="text-sm text-gray-500 text-left">Your display name on the platform</p>
                  </div>
                </div>
                {editMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={profileFormData.first_name}
                        onChange={handleProfileInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg text-left"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={profileFormData.last_name}
                        onChange={handleProfileInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg text-left"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="px-4 py-3 bg-white rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-500 mb-1 text-left">First Name</label>
                      <p className="text-lg text-gray-700 capitalize text-left">
                        {userData.first_name || 'Not provided'}
                      </p>
                    </div>
                    <div className="px-4 py-3 bg-white rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-500 mb-1 text-left">Last Name</label>
                      <p className="text-lg text-gray-700 capitalize text-left">
                        {userData.last_name || 'Not provided'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <FiMail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">Email Address</h3>
                    <p className="text-sm text-gray-500 text-left">Used for login and notifications</p>
                  </div>
                </div>
                {editMode ? (
                  <div className="space-y-4">
                    <input
                      type="email"
                      name="email"
                      value={profileFormData.email}
                      onChange={handleProfileInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg text-left"
                      placeholder="Enter your email address"
                    />
                    
                    {/* Email OTP Verification */}
                    {profileFormData.email !== originalData.email && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <FiShield className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-orange-800">Email verification required</span>
                        </div>
                        
                        {otpError && (
                          <div className="mb-3 p-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded">
                            {otpError}
                          </div>
                        )}
                        
                        {otpMessage && (
                          <div className="mb-3 p-3 text-green-600 text-sm bg-green-50 border border-green-200 rounded">
                            {otpMessage}
                          </div>
                        )}
                        
                        {!otpSent ? (
                          <button
                            onClick={handleSendOTP}
                            className="w-full px-4 py-3 bg-orange-500 text-black text-sm rounded-lg hover:bg-orange-600 transition-colors font-medium"
                          >
                            Send OTP to Verify Email
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              maxLength="6"
                              className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center text-lg font-mono"
                            />
                            <div className="flex gap-3">
                              <button
                                onClick={handleVerifyOTP}
                                disabled={otpVerifying}
                                className="flex-1 px-4 py-3 bg-green-500 text-black text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors font-medium"
                              >
                                {otpVerifying ? 'Verifying...' : 'Verify OTP'}
                              </button>
                              <button
                                onClick={() => {
                                  setOtpSent(false);
                                  setOtp('');
                                  setOtpError('');
                                  setOtpMessage('');
                                  setVerificationField('');
                                }}
                                className="px-4 py-3 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-lg text-gray-700 px-4 py-3 bg-white rounded-lg border border-gray-200 text-left">
                    {userData.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <FiPhone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">Phone Number</h3>
                    <p className="text-sm text-gray-500 text-left">For account recovery and notifications</p>
                  </div>
                </div>
                {editMode ? (
                  <div className="space-y-4">
                    <input
                      type="tel"
                      name="mobile"
                      value={profileFormData.mobile}
                      onChange={handleProfileInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg text-left"
                      placeholder="Enter your phone number"
                    />
                    
                    {/* Phone OTP Verification */}
                    {profileFormData.mobile !== originalData.mobile && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <FiShield className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-orange-800">Phone verification required</span>
                        </div>
                        
                        {otpError && (
                          <div className="mb-3 p-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded">
                            {otpError}
                          </div>
                        )}
                        
                        {otpMessage && (
                          <div className="mb-3 p-3 text-green-600 text-sm bg-green-50 border border-red-200 rounded">
                            {otpMessage}
                          </div>
                        )}
                        
                        {!otpSent ? (
                          <button
                            onClick={handleSendOTP}
                            className="w-full px-4 py-3 bg-orange-500 text-black text-sm rounded-lg hover:bg-orange-600 transition-colors font-medium"
                          >
                            Send OTP to Verify Phone
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              maxLength="6"
                              className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center text-lg font-mono"
                            />
                            <div className="flex gap-3">
                              <button
                                onClick={handleVerifyOTP}
                                disabled={otpVerifying}
                                className="flex-1 px-4 py-3 bg-green-500 text-black text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors font-medium"
                              >
                                {otpVerifying ? 'Verifying...' : 'Verify OTP'}
                              </button>
                              <button
                                onClick={() => {
                                  setOtpSent(false);
                                  setOtp('');
                                  setOtpError('');
                                  setOtpMessage('');
                                  setVerificationField('');
                                }}
                                className="px-4 py-3 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-lg text-gray-700 px-4 py-3 bg-white rounded-lg border border-gray-200 text-left">
                    {userData.mobile || userData.phone || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Address Field */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <FiMapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">Address</h3>
                    <p className="text-sm text-gray-500 text-left">Your residential or business address</p>
                  </div>
                </div>
                {editMode ? (
                  <textarea
                    name="address"
                    value={profileFormData.address}
                    onChange={handleProfileInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg resize-none text-left"
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="text-lg text-gray-700 px-4 py-3 bg-white rounded-lg border border-gray-200 min-h-[60px] flex items-center text-left">
                    {userData.address || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo; 