import React from "react";

const HotelHostInfo = ({ hotel, editMode, tempHotel, handleInputChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-100 mr-4 flex-shrink-0 overflow-hidden flex items-center justify-center text-blue-600 font-bold text-xl">
          {hotel.owner?.name?.charAt(0).toUpperCase() || 'H'}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold truncate capitalize text-gray-800">Hosted by {hotel.owner?.name}</h2>
          
        </div>
      </div>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
         <div className="text-center p-4 bg-gray-50 rounded-lg">
           <p className="text-sm text-gray-600 mb-1">Max Guests</p>
           {editMode ? (
             <input
               type="number"
               name="maxInRoom"
               value={tempHotel.maxInRoom}
               onChange={handleInputChange}
               min="1"
               className="w-full p-2 border rounded-lg text-center font-semibold"
             />
           ) : (
             <p className="text-lg font-semibold text-gray-800">{hotel.maxInRoom || 'N/A'}</p>
           )}
         </div>
         <div className="text-center p-4 bg-gray-50 rounded-lg">
           <p className="text-sm text-gray-600 mb-1">Bedrooms</p>
           {editMode ? (
             <input
               type="number"
               name="totalRoom"
               value={tempHotel.totalRoom}
               onChange={handleInputChange}
               min="1"
               className="w-full p-2 border rounded-lg text-center font-semibold"
             />
           ) : (
             <p className="text-lg font-semibold text-gray-800">{hotel.totalRoom || 'N/A'}</p>
           )}
         </div>
         <div className="text-center p-4 bg-gray-50 rounded-lg">
           <p className="text-sm text-gray-600 mb-1">Beds</p>
           {editMode ? (
             <input
               type="number"
               name="maxInRoom"
               value={tempHotel.maxInRoom}
               onChange={handleInputChange}
               className="w-full p-2 border rounded-lg text-center font-semibold"
             />
           ) : (
             <p className="text-lg font-semibold text-gray-800">{hotel.maxInRoom || 'N/A'}</p>
           )}
         </div>
         <div className="text-center p-4 bg-gray-50 rounded-lg">
           <p className="text-sm text-gray-600 mb-1">Bathrooms</p>
           {editMode ? (
             <input
               type="number"
               name="totalRoom"
               value={tempHotel.totalRoom}
               onChange={handleInputChange}
               className="w-full p-2 border rounded-lg text-center font-semibold"
             />
           ) : (
             <p className="text-lg font-semibold text-gray-800">{hotel.totalRoom || 'N/A'}</p>
           )}
         </div>
       </div>
       
      
    </div>
  );
};

export default HotelHostInfo;