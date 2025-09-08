import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND } from "../assets/Vars";
import { User, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from "../App";

const NumberForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData({
        name: user.first_name || user.name || "",
        phone: user.phone || ""
      });
    }
  }, [isLoggedIn, user]);

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
    setError("");

    try {
      // Send contact request - this will send email to info@kashibnb.com
      await axios.post(`${BACKEND}/api/v1/contact/contact-request`, formData);
      
      // Show success message
      setSubmitted(true);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 flex justify-center items-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-100 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
          <p className="text-gray-600">Our team will call you shortly at <span className="font-semibold">{formData.phone}</span>.</p>
          <p className="text-gray-600 text-sm">We've also sent your details to our support team.</p>
          
          <button 
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 flex justify-center items-center bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Request a Call Back</h2>
          <p className="text-gray-600">We'll get back to you as soon as possible</p>
        </div>
        
        {error && (
          <div className="p-3 text-red-600 rounded-lg text-center bg-red-50 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Your Name</label>
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
          </div>

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
                maxLength="10"
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
            {loading ? "Submitting..." : "Call Me Back"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Need immediate help?{" "}
            <a href="tel:8011708595" className="text-orange-500 hover:text-orange-600 font-medium hover:underline">
              Call us now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NumberForm;