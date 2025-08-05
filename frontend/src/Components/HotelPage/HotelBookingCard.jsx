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
    <div className="bg-white border rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-2xl font-bold text-gray-800">
            {editMode ? (
                             <input
                 type="number"
                 name="rate"
                 value={tempHotel.rate}
                 onChange={handleInputChange}
                 min="0"
                 className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            ) : (
              `₹${hotel.rate}`
            )} 
            <span className="text-lg font-normal text-gray-600"> night</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Total before taxes</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="checkin" className="text-sm font-semibold text-gray-700 block mb-2">CHECK-IN</label>
            <DatePicker
              id="checkin"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Add date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              popperPlacement="auto"
            />
          </div>
          <div>
            <label htmlFor="checkout" className="text-sm font-semibold text-gray-700 block mb-2">CHECKOUT</label>
            <DatePicker
              id="checkout"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Add date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              popperPlacement="auto"
            />
          </div>
        </div>
        
        <div className="mt-6 border border-gray-200 rounded-xl p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-800 mb-4">Guests</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">Adults</h4>
                <p className="text-sm text-gray-500">Age 13+</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('adults', 'decrement')}
                  disabled={guestCount.adults <= 1}
                  className={`p-2 rounded-full border ${guestCount.adults <= 1 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  <FiMinus size={16} />
                </button>
                <span className="mx-4 w-8 text-center font-medium">{guestCount.adults}</span>
                <button 
                  onClick={() => handleGuestChange('adults', 'increment')}
                  disabled={guestCount.adults >= (hotel.maxAdults || 16)}
                  className={`p-2 rounded-full border ${guestCount.adults >= (hotel.maxAdults || 16) ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">Children</h4>
                <p className="text-sm text-gray-500">Ages 2–12</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('children', 'decrement')}
                  disabled={guestCount.children <= 0}
                  className={`p-2 rounded-full border ${guestCount.children <= 0 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  <FiMinus size={16} />
                </button>
                <span className="mx-4 w-8 text-center font-medium">{guestCount.children}</span>
                <button 
                  onClick={() => handleGuestChange('children', 'increment')}
                  disabled={guestCount.children >= (hotel.maxChildren || 5)}
                  className={`p-2 rounded-full border ${guestCount.children >= (hotel.maxChildren || 5) ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">Infants</h4>
                <p className="text-sm text-gray-500">Under 2</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('infants', 'decrement')}
                  disabled={guestCount.infants <= 0}
                  className={`p-2 rounded-full border ${guestCount.infants <= 0 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  <FiMinus size={16} />
                </button>
                <span className="mx-4 w-8 text-center font-medium">{guestCount.infants}</span>
                <button 
                  onClick={() => handleGuestChange('infants', 'increment')}
                  disabled={guestCount.infants >= (hotel.maxInfants || 5)}
                  className={`p-2 rounded-full border ${guestCount.infants >= (hotel.maxInfants || 5) ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">Pets</h4> 
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('pets', 'decrement')}
                  disabled={guestCount.pets <= 0}
                  className={`p-2 rounded-full border ${guestCount.pets <= 0 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  <FiMinus size={16} />
                </button>
                <span className="mx-4 w-8 text-center font-medium">{guestCount.pets}</span>
                <button 
                  onClick={() => handleGuestChange('pets', 'increment')}
                  disabled={guestCount.pets >= (hotel.maxPets || 2)}
                  className={`p-2 rounded-full border ${guestCount.pets >= (hotel.maxPets || 2) ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleReserve}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!startDate || !endDate}
      >
        {!startDate || !endDate ? 'Select dates to reserve' : 'Reserve'}
      </button>
      
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">
            ₹{hotel.rate} × {startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0} nights
          </span>
          <span className="text-gray-800">
            ₹{startDate && endDate ? parseInt(hotel.rate) * Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Service fee</span>
          <span className="text-gray-800">₹0</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingCard;