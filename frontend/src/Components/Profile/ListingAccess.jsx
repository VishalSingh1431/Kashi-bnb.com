import React from 'react';
import { FiPlus, FiChevronRight } from 'react-icons/fi';

const ListingAccess = ({ userData, requestSent, listingRequestData, handleListingRequestInputChange, handleRequestListingAccess, navigate }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Listing Access</h1>
    {userData.is_admin ? (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">You have admin privileges and can manage all listings.</p>
        <button 
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go to Admin Dashboard
        </button>
      </div>
    ) : userData.has_hotel ? (
      <div className="text-center py-8">
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-600 font-medium mb-2">Your listing access has been approved!</p>
          <p className="text-gray-600">You can now add and manage your hotel listings.</p>
        </div>
        <button 
          onClick={() => navigate('/add-listing')}
          className="flex items-center justify-center mx-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" /> Add New Hotel
        </button>
      </div>
    ) : requestSent ? (
      <div className="text-center py-8">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-600 font-medium mb-2">Your request has been submitted!</p>
          <p className="text-gray-600">Thank you for your interest. We'll review your message and get back to you soon.</p>
        </div>
      </div>
    ) : (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Become a Hotel Partner</h2>
          <p className="text-gray-600 mb-6">
            List your property on our platform to reach thousands of travelers. 
            Get bookings, manage availability, and grow your business.
          </p>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Tell us about your property:</h3>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Please describe your property (type, location, amenities, etc.)"
              name="message"
              value={listingRequestData.message}
              onChange={handleListingRequestInputChange}
            />
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Benefits:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <FiChevronRight className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                <span>Increase your property's visibility</span>
              </li>
              <li className="flex items-start">
                <FiChevronRight className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                <span>Manage bookings and availability easily</span>
              </li>
              <li className="flex items-start">
                <FiChevronRight className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                <span>Get paid securely and on time</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center">
          <button 
            onClick={handleRequestListingAccess}
            disabled={!listingRequestData.message}
            className={`px-6 py-3 text-white rounded-lg font-medium ${
              listingRequestData.message 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Request
          </button>
          <p className="mt-3 text-sm text-gray-500">
            By submitting, you agree to our Partner Terms and Conditions
          </p>
        </div>
      </div>
    )}
  </div>
);

export default ListingAccess; 