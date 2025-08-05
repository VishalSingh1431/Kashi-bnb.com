import React from 'react';

const DescriptionForm = ({ listing, handleInputChange }) => {
  return (
    <>
      <div className="relative mb-4 text-center sm:text-left">
        <input
          type="text"
          name="name"
          value={listing.name}
          onChange={handleInputChange}
          placeholder="Enter your Property name"
          className="text-lg sm:text-xl md:text-2xl font-bold mb-2 w-full p-2 border rounded-lg text-center sm:text-left leading-tight"
        />
        <p className="text-xs sm:text-sm text-gray-500 italic leading-tight break-words">Example: 'Luxury Beachfront Villa'</p>
      </div>
    </>
  );
};

export default DescriptionForm;
