import React, { useState } from 'react';
import axios from 'axios'
import { BACKEND } from '../assets/Vars';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${BACKEND}/api/v1/user/signup`, 
      { name, email, password });
    console.log(response);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300" placeholder="John Doe" required />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300" placeholder="john@example.com" required />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300" placeholder="********" required />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Sign Up</button>
        </form>
        <p className="text-center text-gray-600 mt-4">Already have an account? <a href="#" className="text-indigo-600">Login</a></p>
      </div>
    </div>
  );
};

export default Signup;
