import React from 'react';
import { FiPlus, FiChevronRight } from 'react-icons/fi';

const ListingAccess = ({ userData, requestSent, listingRequestData, handleListingRequestInputChange, handleRequestListingAccess, navigate, fromListings = false }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Listing Access</h1>
    
    {/* Message when coming from listings page */}
    {fromListings && (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <FiPlus className="text-blue-500 mr-2" size={20} />
          <div>
            <p className="text-blue-800 font-medium">Welcome from the Listings page!</p>
            <p className="text-blue-600 text-sm">Simply provide your phone number and our team will contact you to guide you through the process.</p>
          </div>
        </div>
      </div>
    )}
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
          <p className="text-blue-600 font-medium mb-2">Request Submitted Successfully!</p>
          <p className="text-gray-600">Our team will contact you within 24 hours to guide you through the listing process.</p>
        </div>
      </div>
    ) : (
      <div className="max-w-md mx-auto">
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Become a Hotel Partner</h2>
          <p className="text-gray-600 mb-6 text-center">
            List your property on our platform to reach thousands of travelers. 
            Get bookings, manage availability, and grow your business.
          </p>
          
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-center">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 text-center"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={listingRequestData.phone || ''}
                  onChange={handleListingRequestInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2 text-blue-800">What happens next?</h3>
            <p className="text-sm text-blue-700">
              Our team will contact you within 24 hours to guide you through the process 
              and answer all your questions about listing your property.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <button 
            onClick={handleRequestListingAccess}
            disabled={!listingRequestData.phone}
            className={`px-6 py-3 text-white rounded-lg font-medium ${
              listingRequestData.phone 
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