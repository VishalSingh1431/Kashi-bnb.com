import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BACKEND } from "../assets/Vars";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BACKEND}/api/v1/user/login`,
        formData
      );
      console.log(response);

      if (response.status === 200) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Always navigate to home page after login
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.log(err);
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password.";
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

  return (
    <div className="min-h-screen pt-40 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login to KashiBnB</h2>
        
        {error && (
          <div className="p-3 text-black rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 "
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-2xl focus:outline-none focus:ring-2  "
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-2xl border  transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;