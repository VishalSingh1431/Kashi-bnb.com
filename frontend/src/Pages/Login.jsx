import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // State for form inputs and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Send login request to the server
      const response = await axios.post(
        "https://kashi-bnb-production.up.railway.app/api/v1/user/login",
        { email, password }
      );

      // Check the response status
      if (response.status === 200) {
        // Store the JWT token in localStorage
        localStorage.setItem("token", response.data.token);

        // Notify user of successful login
        alert("Login successful!");

        // Redirect to the home page or dashboard
        navigate("/");
      } else {
        // Handle unexpected status codes
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      // Handle errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          setError("Invalid email or password.");
        } else if (err.response.status === 400) {
          setError("Bad request. Please check your input.");
        } else {
          setError(err.response.data.message || "Login failed. Please try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from the server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-lg">
        {/* Login Form Heading */}
        <h2 className="text-2xl font-bold text-center">Login to KashiBnB</h2>

        {/* Display error message if any */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;