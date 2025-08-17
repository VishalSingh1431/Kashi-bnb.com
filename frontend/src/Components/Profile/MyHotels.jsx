import React, { useState } from 'react';
import { FiPlus, FiStar, FiMapPin, FiHome, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { BACKEND } from '../../assets/Vars';

const MyHotels = ({ userData, navigate }) => {
  const [deletingId, setDeletingId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Debug: Log the hotel data structure
  console.log('MyHotels - userData:', userData);
  console.log('MyHotels - hotels_name:', userData?.hotels_name);

  const handleDelete = async (hotelId, hotelName) => {
    if (!window.confirm(`Are you sure you want to delete "${hotelName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(hotelId);
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    console.log('User data:', currentUser);
    console.log('Token:', token);
    console.log('Hotel ID:', hotelId);

    try {
      await axios.delete(`${BACKEND}/api/v1/hotel/hotel/${hotelId}`, {
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
        }
      });

      // Refresh the page to update the hotel list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      console.error('Error response:', error.response);
      alert(error.response?.data?.message || 'Error deleting hotel');
    } finally {
      setDeletingId(null);
    }
  };

  // For admins, show all hotels. For hotel owners, show only their hotels
  const hotelsToShow = user?.is_admin ? userData.hotels_name : userData.hotels_name;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          {user?.is_admin ? 'All Hotels' : 'My Hotels'}
        </h1>
        {!user?.is_admin && (
          <button 
            onClick={() => navigate('/add-listing')}
            className="flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base"
          >
            <FiPlus className="mr-2" /> Add Hotel
          </button>
        )}
      </div>
      {hotelsToShow && hotelsToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {hotelsToShow.map((hotel) => (
            <div key={hotel.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 sm:h-48 bg-gray-200 relative">
                {/* Debug: Log individual hotel data */}
                {console.log('Hotel data:', hotel)}
                {console.log('Hotel images:', hotel.images)}
                
                {hotel.images && hotel.images.length > 0 && hotel.images[0]?.url ? (
                  <img 
                    src={(() => {
                      const url = hotel.images[0].url;
                      // Ensure URL has proper protocol
                      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                        return `https://${url}`;
                      }
                      return url;
                    })()}
                    alt={hotel.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', hotel.images[0].url);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', hotel.images[0].url);
                    }}
                  />
                ) : null}
                
                {/* Fallback icon when no image or image fails to load */}
                <div className={`w-full h-full flex items-center justify-center text-gray-500 ${
                  hotel.images && hotel.images.length > 0 && hotel.images[0]?.url ? 'hidden' : 'flex'
                }`}>
                  <div className="text-center">
                    <FiHome size={32} className="sm:w-12 sm:h-12 mx-auto mb-2" />
                    <p className="text-xs">No Image</p>
                  </div>
                </div>
                
                <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-xs sm:text-sm">
                  ₹{hotel.rate}/night
                </div>
                {user?.is_admin && hotel.owner && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                    {hotel.owner.name}
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base sm:text-lg capitalize">{hotel.name}</h3>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span className="text-sm sm:text-base">5.0</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-1 line-clamp-2 text-sm sm:text-base">{hotel.details || 'No description available'}</p>
                <div className="mt-2 sm:mt-3 flex items-center text-gray-500">
                  <FiMapPin className="mr-2" />
                  <span className="text-xs sm:text-sm truncate">{hotel.address || 'Address not available'}</span>
                </div>
                {user?.is_admin && hotel.owner && (
                  <div className="mt-2 text-xs sm:text-sm text-gray-600">
                    <p><strong>Owner:</strong> {hotel.owner.name}</p>
                    <p><strong>Email:</strong> {hotel.owner.email}</p>
                  </div>
                )}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <button 
                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                    className="flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                  >
                    View <FiChevronRight className="ml-1" />
                  </button>
                  <div className="flex gap-1 sm:gap-2">
                    <button 
                      onClick={() => navigate(`/edit-hotel/${hotel.id}`)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(hotel.id, hotel.name)}
                      disabled={deletingId === hotel.id}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {deletingId === hotel.id ? (
                        'Deleting...'
                      ) : (
                        <>
                          <FiTrash2 className="mr-1" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4 text-sm sm:text-base">
            {user?.is_admin ? 'No hotels found.' : "You haven't added any hotels yet."}
          </p>
          {!user?.is_admin && (
            <button 
              onClick={() => navigate('/add-hotel')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm sm:text-base"
            >
              Add Your First Hotel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyHotels; 