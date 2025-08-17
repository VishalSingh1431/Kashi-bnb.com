import React from 'react';
import { FiUser, FiCalendar, FiHome, FiPlus, FiShield, FiUsers, FiMessageSquare } from 'react-icons/fi';

const ProfileTabs = ({ activeTab, userData, onTabClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
      <div className="flex flex-wrap border-b border-gray-200">
        <button
          onClick={onTabClick.personal}
          className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
            activeTab === 'personal' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiUser className="mr-2 h-4 w-4" />
          Personal Info
        </button>
        
        <button
          onClick={onTabClick.bookings}
          className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
            activeTab === 'bookings' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiCalendar className="mr-2 h-4 w-4" />
          Your Bookings
        </button>
        
        {userData.has_hotel && (
          <>
            <button
              onClick={onTabClick.myHotels}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === 'myHotels' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiHome className="mr-2 h-4 w-4" />
              My Hotels
            </button>
            
            <button
              onClick={onTabClick.hotelBookings}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === 'hotelBookings' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiCalendar className="mr-2 h-4 w-4" />
              Hotel Bookings
            </button>
          </>
        )}
        
        {!userData.has_hotel && (
          <button
            onClick={onTabClick.listingAccess}
            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === 'listingAccess' 
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Listing Access
          </button>
        )}

        <button
          onClick={onTabClick.ratingReviews}
          className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
            activeTab === 'ratingReviews' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiMessageSquare className="mr-2 h-4 w-4" />
          Rate & Review
        </button>
        
        {userData.is_admin && (
          <>
            <button
              onClick={onTabClick.accessRequests}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === 'accessRequests' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiShield className="mr-2 h-4 w-4" />
              Access Requests
            </button>
            
            <button
              onClick={onTabClick.allUsers}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === 'allUsers' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiUsers className="mr-2 h-4 w-4" />
              All Users
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
