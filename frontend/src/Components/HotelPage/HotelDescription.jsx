import React, { useState } from "react";

const HotelDescription = ({ hotel, editMode, tempHotel, handleInputChange }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">About this place</h2>
      <div className="relative">
        {editMode ? (
          <textarea
            name="details"
            value={tempHotel.details}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your property, its unique features, and what guests can expect..."
          />
        ) : (
          <>
            <div className={`text-gray-700 leading-relaxed ${!showFullDescription ? 'max-h-32 overflow-hidden' : ''}`}>
              <p>{hotel.details || 'No description provided yet.'}</p>
            </div>
            {hotel.details && hotel.details.length > 200 && !showFullDescription && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </>
        )}
      </div>
      {!editMode && hotel.details && hotel.details.length > 200 && (
        <button 
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-3 text-blue-600 font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default HotelDescription;