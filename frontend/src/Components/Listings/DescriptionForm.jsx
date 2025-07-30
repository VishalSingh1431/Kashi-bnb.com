import React from 'react';

const DescriptionForm = ({ listing, handleInputChange }) => {
  return (
    <>
      <div className="relative mb-4">
        <input
          type="text"
          name="name"
          value={listing.name}
          onChange={handleInputChange}
          placeholder="Enter your hotel name"
          className="text-2xl font-bold mb-2 w-full p-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 italic">Example: 'Luxury Beachfront Villa'</p>
      </div>
    </>
  );
};

export default DescriptionForm;
