import React from 'react';
import { FiMapPin } from 'react-icons/fi';

const RoomDetailsForm = ({ listing, handleInputChange, user }) => {
  return (
    <>
      <div className="flex items-center mb-4">
        <div className="flex items-center w-full">
          <FiMapPin className="mr-1 flex-shrink-0" />
          <input
            type="text"
            name="address"
            value={listing.address}
            onChange={handleInputChange}
            placeholder="Enter full address"
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>
      <div className="border-b pb-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0 overflow-hidden flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'H'}
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold truncate capitalize">Hosted by {user?.name}</h2>
            <p className="text-gray-600 truncate">Contact: {user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="min-w-0">
            <p className="text-gray-500 truncate">Guests</p>
            <input
              type="number"
              name="maxInRoom"
              value={listing.maxInRoom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="min-w-0">
            <p className="text-gray-500 truncate">Rooms</p>
            <input
              type="number"
              name="totalRoom"
              value={listing.totalRoom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
       <div className="border-b pb-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">About this place</h2>
        <textarea
          name="details"
          value={listing.details}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg h-32"
          placeholder="Describe your property in detail..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Include details about rooms, amenities, nearby attractions, and any special features.
        </p>
      </div>
    </>
  );
};

export default RoomDetailsForm;
