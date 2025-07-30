import React, { useState } from "react";

const HotelDescription = ({ hotel, editMode, tempHotel, handleInputChange }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="border-b pb-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">About this place</h2>
      <div className="relative">
        {editMode ? (
          <textarea
            name="details"
            value={tempHotel.details}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg h-32"
            placeholder="Enter description..."
          />
        ) : (
          <>
            <div className={`text-gray-700 ${!showFullDescription ? 'max-h-24 overflow-hidden' : ''}`}>
              <p>{hotel.details || 'No description provided.'}</p>
            </div>
            {hotel.details && hotel.details.length > 150 && !showFullDescription && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </>
        )}
      </div>
      {!editMode && hotel.details && hotel.details.length > 150 && (
        <button 
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-2 font-semibold underline focus:outline-none focus:ring-2 focus:ring-rose-500 rounded"
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default HotelDescription;