import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BACKEND } from '../assets/Vars';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(
        `${BACKEND}/api/v1/user/signup`,
        formData
      );

      if (response.data?.message === "verify user to finish") {
        setVerificationSent(true);
        setSuccess(true);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.log(err);
      let errorMessage = "Signup failed. Please try again.";

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = "Validation error. Please check your inputs.";
        } else if (err.response.status === 409) {
          errorMessage = "Email already exists. Please login instead.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = "No response from server. Check your connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await axios.post(
        `${BACKEND}/api/v1/user/send-verification`,
        { email: formData.email }
      );
      alert("Verification email has been resent successfully!");
    } catch (error) {
      alert("Failed to resend verification. Please try again later.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-40 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-lg text-center">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold">Almost there!</h2>
          <p className="text-gray-700">
            We've sent a verification email to <span className="font-semibold">{formData.email}</span>.
          </p>

          <p className="text-gray-600 text-sm">
            Please check your inbox and click the verification link to activate your account.
            <br />
            <span className="text-gray-500">If you don't see the email, check your spam folder.</span>
          </p>

          <div className="pt-4 space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Go to Login
            </button>

            <button
              onClick={handleResendVerification}
              className="w-full text-blue-500 hover:underline font-medium py-2"
            >
              Resend Verification Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-52 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center">Create Your Account</h2>

        {error && (
          <div className="p-3 text-red-600 rounded text-center bg-red-50 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password (min 6 characters)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded transition hover:bg-blue-700 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Creating your account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
