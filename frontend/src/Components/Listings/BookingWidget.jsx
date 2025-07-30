import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PriceForm from './PriceForm';

const BookingWidget = ({
  listing,
  startDate,
  endDate,
  guestCount,
  setStartDate,
  setEndDate,
  setGuestCount,
  calculateTotal,
  handleInputChange
}) => {
  const nights = startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0;
  
  return (
    <div className="border rounded-xl p-6 shadow-lg">
        
      <PriceForm listing={listing} handleInputChange={handleInputChange} />
      
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="checkin" className="text-xs font-semibold block mb-1">CHECK-IN</label>
            <DatePicker
              id="checkin"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Add date"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
              popperPlacement="auto"
            />
          </div>
          <div>
            <label htmlFor="checkout" className="text-xs font-semibold block mb-1">CHECKOUT</label>
            <DatePicker
              id="checkout"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Add date"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
              popperPlacement="auto"
            />
          </div>
        </div>
        <div className="mt-2">
          <label htmlFor="guests" className="text-xs font-semibold block mb-1">GUESTS</label>
          <select
            id="guests"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
          >
            {Array.from({ length: listing.maxInRoom || 1 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button 
        className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        disabled={!startDate || !endDate}
      >
        Preview Booking
      </button>
      
      <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
        <div>
          <p className="text-gray-600">
            ₹{listing.rate} x {nights > 0 ? nights : 0} nights
          </p>
        </div>
        <div className="text-right">
          <p>₹{nights > 0 ? parseInt(listing.rate) * nights : 0}</p>
        </div>
        <div className="col-span-2 border-t mt-2 pt-4">
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>₹{calculateTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;
