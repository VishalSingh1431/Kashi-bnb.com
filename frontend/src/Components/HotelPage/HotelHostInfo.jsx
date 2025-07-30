import React from "react";

const HotelHostInfo = ({ hotel, editMode, tempHotel, handleInputChange }) => {
  return (
    <div className="border-b pb-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {hotel.owner?.name?.charAt(0).toUpperCase() || 'H'}
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold truncate capitalize">Hosted by {hotel.owner?.name}</h2>
          <p className="text-gray-600 truncate">Contact: {hotel.owner?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="min-w-0">
          <p className="text-gray-500 truncate">Guests</p>
          {editMode ? (
            <input
              type="number"
              name="maxInRoom"
              value={tempHotel.maxInRoom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p className="font-medium truncate">{hotel.maxInRoom || 'N/A'}</p>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-gray-500 truncate">Bedrooms</p>
          {editMode ? (
            <input
              type="number"
              name="maxInRoom"
              value={tempHotel.maxInRoom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p className="font-medium truncate">{hotel.maxInRoom || 'N/A'}</p>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-gray-500 truncate">Beds</p>
          {editMode ? (
            <input
              type="number"
              name="maxInRoom"
              value={tempHotel.maxInRoom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p className="font-medium truncate">{hotel.maxInRoom || 'N/A'}</p>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-gray-500 truncate">Bathrooms</p>
          {editMode ? (
            <input
              type="number"
              name="totalRoom"
              value={tempHotel.totalRoom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p className="font-medium truncate">{hotel.totalRoom || 'N/A'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelHostInfo;