import React from 'react';

const PriceForm = ({ listing, handleInputChange }) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-xl font-semibold">
          ₹ 
          <input
            type="number"
            name="rate"
            value={listing.rate}
            onChange={handleInputChange}
            className="w-24 p-2 border rounded-lg mx-1"
            placeholder="0"
          />
          <span className="text-base font-normal">night</span>
        </p>
      </div>
    </div>
  );
};

export default PriceForm;
