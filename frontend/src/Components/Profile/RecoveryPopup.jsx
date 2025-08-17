import React from 'react';
import { FiX, FiMail, FiPhone } from 'react-icons/fi';

const RecoveryPopup = ({
  showPopup,
  recoveryType,
  recoveryLoading,
  recoveryOtpSent,
  recoveryOtp,
  setRecoveryOtp,
  recoveryFormData,
  recoveryMessage,
  recoveryError,
  onSendOTP,
  onVerifyOTP,
  onSkip,
  onRecoveryInputChange
}) => {
  if (!showPopup) return null;

  return (
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
            onClick={onSkip}
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

        {/* Show success message and close button when OTP is verified */}
        {recoveryMessage && (recoveryMessage.includes('successfully') || recoveryMessage.includes('verified')) ? (
          <div className="mt-4 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 font-medium">{recoveryMessage}</p>
              <p className="text-gray-500 text-sm mt-2">Your {recoveryType} has been verified successfully!</p>
            </div>
            <button
              onClick={onSkip}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200"
            >
              Close
            </button>
          </div>
        ) : !recoveryOtpSent ? (
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
                  onChange={(e) => onRecoveryInputChange(recoveryType, e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder={`Enter your ${recoveryType}`}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onSendOTP}
                disabled={recoveryLoading}
                className={`flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-orange-600 hover:to-yellow-600 ${
                  recoveryLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {recoveryLoading ? "Sending..." : "Send OTP"}
              </button>
              <button
                onClick={onSkip}
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
                onClick={onVerifyOTP}
                disabled={recoveryLoading}
                className={`flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-green-600 hover:to-blue-600 ${
                  recoveryLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {recoveryLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={onSkip}
                className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-all duration-200"
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoveryPopup;
