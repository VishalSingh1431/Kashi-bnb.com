import React from 'react';
import { FiMapPin } from 'react-icons/fi';

const RoomDetailsForm = ({ listing, handleInputChange, user }) => {
  return (
    <>
      <div className="flex items-center mb-4 text-center sm:text-left">
        <div className="flex items-center w-full">
          <FiMapPin className="mr-1 flex-shrink-0" />
          <input
            type="text"
            name="address"
            value={listing.address}
            onChange={handleInputChange}
            placeholder="Enter full address"
            className="w-full p-2 border rounded-lg text-center sm:text-left"
          />
        </div>
      </div>
      <div className="border-b pb-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center mb-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-gray-300 mb-2 sm:mb-0 sm:mr-4 flex-shrink-0 overflow-hidden flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'H'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-semibold truncate capitalize leading-tight">Hosted by {user?.name}</h2>
            <p className="text-xs sm:text-sm text-gray-600 truncate leading-tight">Contact: {user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500 truncate leading-tight">Guests</p>
            <input
              type="number"
              name="maxInRoom"
              value={listing.maxInRoom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-center sm:text-left"
            />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500 truncate leading-tight">Rooms</p>
            <input
              type="number"
              name="totalRoom"
              value={listing.totalRoom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-center sm:text-left"
            />
          </div>
        </div>
      </div>
       <div className="border-b pb-6 mb-6 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 leading-tight">About this place</h2>
        <textarea
          name="details"
          value={listing.details}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg h-32 text-center sm:text-left"
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
