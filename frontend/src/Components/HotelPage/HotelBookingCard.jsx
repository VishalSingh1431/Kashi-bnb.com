import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiPlus, FiMinus } from "react-icons/fi";

const HotelBookingCard = ({
  hotel,
  editMode,
  tempHotel,
  handleInputChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  guestCount,
  handleGuestChange,
  handleReserve,
  calculateTotal
}) => {
  return (
    <div className="sticky top-4 border rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xl font-semibold">
            {editMode ? (
              <input
                type="number"
                name="rate"
                value={tempHotel.rate}
                onChange={handleInputChange}
                className="w-24 p-2 border rounded-lg"
              />
            ) : (
              `₹${hotel.rate}`
            )} 
            <span className="text-base font-normal"> night</span>
          </p>
        </div>
      </div>
      
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
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              popperPlacement="auto"
            />
          </div>
        </div>
        
        <div className="mt-4 border rounded-lg p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">Adults</h3>
                <p className="text-xs text-gray-500">Age 13+</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('adults', 'decrement')}
                  disabled={guestCount.adults <= 1}
                  className={`p-1 rounded-full ${guestCount.adults <= 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiMinus />
                </button>
                <span className="mx-2 w-6 text-center">{guestCount.adults}</span>
                <button 
                  onClick={() => handleGuestChange('adults', 'increment')}
                  disabled={guestCount.adults >= (hotel.maxAdults || 16)}
                  className={`p-1 rounded-full ${guestCount.adults >= (hotel.maxAdults || 16) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">Children</h3>
                <p className="text-xs text-gray-500">Ages 2–12</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('children', 'decrement')}
                  disabled={guestCount.children <= 0}
                  className={`p-1 rounded-full ${guestCount.children <= 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiMinus />
                </button>
                <span className="mx-2 w-6 text-center">{guestCount.children}</span>
                <button 
                  onClick={() => handleGuestChange('children', 'increment')}
                  disabled={guestCount.children >= (hotel.maxChildren || 5)}
                  className={`p-1 rounded-full ${guestCount.children >= (hotel.maxChildren || 5) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">Infants</h3>
                <p className="text-xs text-gray-500">Under 2</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('infants', 'decrement')}
                  disabled={guestCount.infants <= 0}
                  className={`p-1 rounded-full ${guestCount.infants <= 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiMinus />
                </button>
                <span className="mx-2 w-6 text-center">{guestCount.infants}</span>
                <button 
                  onClick={() => handleGuestChange('infants', 'increment')}
                  disabled={guestCount.infants >= (hotel.maxInfants || 5)}
                  className={`p-1 rounded-full ${guestCount.infants >= (hotel.maxInfants || 5) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Pets</h3>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('pets', 'decrement')}
                  disabled={guestCount.pets <= 0}
                  className={`p-1 rounded-full ${guestCount.pets <= 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiMinus />
                </button>
                <span className="mx-2 w-6 text-center">{guestCount.pets}</span>
                <button 
                  onClick={() => handleGuestChange('pets', 'increment')}
                  disabled={guestCount.pets >= (hotel.maxPets || 2)}
                  className={`p-1 rounded-full ${guestCount.pets >= (hotel.maxPets || 2) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleReserve}
        className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        disabled={!startDate || !endDate}
      >
        Reserve
      </button>
      
      <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
        <div>
          <p className="text-gray-600">
            ₹{hotel.rate} x {startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0} nights
          </p>
        </div>
        <div className="text-right">
          <p>₹{startDate && endDate ? parseInt(hotel.rate) * Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0}</p>
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

export default HotelBookingCard;