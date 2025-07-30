import React from 'react';
import { FiPlus, FiStar, FiMapPin, FiHome, FiChevronRight } from 'react-icons/fi';

const MyHotels = ({ userData, navigate }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">My Hotels</h1>
      <button 
        onClick={() => navigate('/add-listing')}
        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        <FiPlus className="mr-2" /> Add Hotel
      </button>
    </div>
    {userData.hotels_name && userData.hotels_name.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData.hotels_name.map((hotel) => (
          <div key={hotel.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              {hotel.images?.[0]?.url ? (
                <img 
                  src={hotel.images[0].url} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <FiHome size={48} />
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-sm">
                ₹{hotel.rate}/night
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg capitalize">{hotel.name}</h3>
                <div className="flex items-center">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span>5.0</span>
                </div>
              </div>
              <p className="text-gray-600 mt-1 line-clamp-2">{hotel.details || 'No description available'}</p>
              <div className="mt-3 flex items-center text-gray-500">
                <FiMapPin className="mr-2" />
                <span className="text-sm truncate">{hotel.address || 'Address not available'}</span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  className="flex items-center px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  View <FiChevronRight className="ml-1" />
                </button>
                <button 
                  onClick={() => navigate(`/edit-hotel/${hotel.id}`)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You haven't added any hotels yet.</p>
        <button 
          onClick={() => navigate('/add-hotel')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add Your First Hotel
        </button>
      </div>
    )}
  </div>
);

export default MyHotels; 