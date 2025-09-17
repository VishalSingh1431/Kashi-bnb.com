import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiX, FiUser, FiUserPlus } from 'react-icons/fi';

const AuthPromptModal = ({ isOpen, onClose, message = "Please login to continue with booking" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Pass current location as redirect parameter
    navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
  };

  const handleSignup = () => {
    onClose();
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Pass current location as redirect parameter
    navigate(`/signup?redirect=${encodeURIComponent(location.pathname + location.search)}`);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 relative transform transition-all duration-300 scale-100 border border-white/30">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-white/80 rounded-full backdrop-blur-sm"
        >
          <FiX size={20} />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FiUser size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Login Required</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{message}</p>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiUser size={20} />
              Login to Continue
            </button>
            
            <button
              onClick={handleSignup}
              className="w-full bg-white border-2 border-gray-200 text-gray-800 py-4 px-6 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FiUserPlus size={20} />
              Create New Account
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 leading-relaxed">
              Join thousands of travelers finding their perfect stay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
