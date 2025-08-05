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
          <p className="text-gray-600 truncate">Contact: {hotel.owner?.email}</p>
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
       
       {/* Guest Limits Section */}
       <div className="mt-6">
         <h3 className="text-lg font-semibold text-gray-800 mb-4">Guest Limits</h3>
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           <div className="text-center p-3 bg-blue-50 rounded-lg">
             <p className="text-sm text-gray-600 mb-1">Max Adults</p>
             {editMode ? (
                            <input
               type="number"
               name="maxAdults"
               value={tempHotel.maxAdults}
               onChange={handleInputChange}
               min="1"
               className="w-full p-2 border rounded-lg text-center font-semibold"
             />
             ) : (
               <p className="text-lg font-semibold text-gray-800">{hotel.maxAdults || 'N/A'}</p>
             )}
           </div>
           <div className="text-center p-3 bg-green-50 rounded-lg">
             <p className="text-sm text-gray-600 mb-1">Max Children</p>
             {editMode ? (
               <input
                 type="number"
                 name="maxChildren"
                 value={tempHotel.maxChildren}
                 onChange={handleInputChange}
                 min="0"
                 className="w-full p-2 border rounded-lg text-center font-semibold"
               />
             ) : (
               <p className="text-lg font-semibold text-gray-800">{hotel.maxChildren || 'N/A'}</p>
             )}
           </div>
           <div className="text-center p-3 bg-yellow-50 rounded-lg">
             <p className="text-sm text-gray-600 mb-1">Max Infants</p>
             {editMode ? (
               <input
                 type="number"
                 name="maxInfants"
                 value={tempHotel.maxInfants}
                 onChange={handleInputChange}
                 min="0"
                 className="w-full p-2 border rounded-lg text-center font-semibold"
               />
             ) : (
               <p className="text-lg font-semibold text-gray-800">{hotel.maxInfants || 'N/A'}</p>
             )}
           </div>
           <div className="text-center p-3 bg-purple-50 rounded-lg">
             <p className="text-sm text-gray-600 mb-1">Max Pets</p>
             {editMode ? (
               <input
                 type="number"
                 name="maxPets"
                 value={tempHotel.maxPets}
                 onChange={handleInputChange}
                 min="0"
                 className="w-full p-2 border rounded-lg text-center font-semibold"
               />
             ) : (
               <p className="text-lg font-semibold text-gray-800">{hotel.maxPets || 'N/A'}</p>
             )}
           </div>
         </div>
       </div>
    </div>
  );
};

export default HotelHostInfo;