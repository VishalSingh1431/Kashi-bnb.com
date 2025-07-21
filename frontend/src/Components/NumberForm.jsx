import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND } from "../assets/Vars";

const NumberForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
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
    setError("");

    try {
      // Send data to your backend
      await axios.post(`${BACKEND}/api/contact-request`, formData);
      
      // Show success message
      setSubmitted(true);
      
      // You can also trigger a phone call here if needed
      // window.location.href = `tel:${YOUR_CUSTOMER_CARE_NUMBER}`;
      
    } catch (err) {
      setError("Failed to submit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-40 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p>Our team will call you shortly at {formData.phone}.</p>
          <button 
            onClick={() => navigate("/")}
            className="w-full py-2 rounded-2xl border transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center">Request a Call Back</h2>
        
        {error && (
          <div className="p-3 text-black rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-2xl border transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Submitting..." : "Call Me Back"}
          </button>
        </form>

        <p className="text-center">
          Need immediate help?{" "}
          <a href="tel:8011708595" className="text-blue-500 hover:underline">
            Call us now
          </a>
        </p>
      </div>
    </div>
  );
};

export default NumberForm;