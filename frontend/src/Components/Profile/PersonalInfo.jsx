import React from 'react';
import { FiEdit, FiSave, FiLogOut, FiUser, FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const PersonalInfo = ({ userData, editMode, profileFormData, handleProfileInputChange, handleSaveProfile, setEditMode, handleLogout }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Personal Information</h1>
        <p className="text-gray-600">Manage your account details</p>
      </div>
      <div className="flex space-x-2">
        {editMode ? (
          <>
            <button 
              onClick={handleSaveProfile}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FiSave className="mr-2" /> Save
            </button>
            <button 
              onClick={() => setEditMode(false)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <button 
            onClick={() => setEditMode(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <FiEdit className="mr-2" /> Edit Profile
          </button>
        )}
        <button 
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
            <span className="text-4xl text-gray-500">
              {userData.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="text-xl font-semibold mt-2 capitalize">{userData.name}</h2>
          <p className="text-gray-600">{userData.is_admin ? 'Admin' : 'User'}</p>
          <div className="mt-4 flex items-center text-gray-500">
            <FiClock className="mr-2" />
            <span>Member since {new Date(userData.time).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-1">
              <FiUser className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Name</h3>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={profileFormData.name}
                  onChange={handleProfileInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-gray-600 capitalize">{userData.name}</p>
              )}
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-1">
              <FiMail className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Email</h3>
              <p className="mt-1 text-gray-600">{userData.email}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-1">
              <FiPhone className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Phone</h3>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileFormData.phone}
                  onChange={handleProfileInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-gray-600">{userData.phone || 'Not provided'}</p>
              )}
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-1">
              <FiMapPin className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-gray-800">Address</h3>
              {editMode ? (
                <textarea
                  name="address"
                  value={profileFormData.address}
                  onChange={handleProfileInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-gray-600">{userData.address || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PersonalInfo; 