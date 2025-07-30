import React from "react";

const HotelLocation = ({ hotel, editMode, tempHotel, handleInputChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Where you'll be</h2>
      <div className="h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden">
        <iframe 
          title="Hotel location"
          src={hotel.gmap || "https://maps.google.com/maps?q=India&output=embed"}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen
          loading="lazy"
          className="rounded-xl"
        ></iframe>
      </div>
      {editMode ? (
        <input
          type="text"
          name="gmap"
          value={tempHotel.gmap}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          placeholder="Google Maps embed URL"
        />
      ) : (
        <p className="text-gray-700">{hotel.address}</p>
      )}
    </div>
  );
};

export default HotelLocation;