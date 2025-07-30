import React from 'react';

const LocationForm = ({ listing, handleInputChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Where you'll be</h2>
      <div className="h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden">
        <iframe 
          title="Hotel location"
          src={listing.gmap || "https://maps.google.com/maps?q=India&output=embed"}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen
          loading="lazy"
          className="rounded-xl"
        ></iframe>
      </div>
      <input
        type="text"
        name="gmap"
        value={listing.gmap}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg"
        placeholder="Google Maps embed URL"
      />
      <p className="text-xs text-gray-500 mt-1">
        Paste the Google Maps embed URL for your property location.
      </p>
    </div>
  );
};

export default LocationForm;
