import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiPlus, FiMinus, FiCalendar, FiAlertCircle, FiCheck } from 'react-icons/fi';
import axios from '../../utils/axiosConfig';
import AuthPromptModal from '../AuthPromptModal';
import { saveBookingData, getBookingData, parseStoredDates } from '../../utils/bookingStorage';

// GST calculation utility
const calculateGST = (roomRate, taxableAmount) => {
  const rate = parseInt(roomRate);
  if (rate < 1000) {
    return { gstRate: 0, gstAmount: 0 };
  } else if (rate >= 1001 && rate <= 7499) {
    return { gstRate: 12, gstAmount: Math.round(taxableAmount * 0.12) };
  } else {
    return { gstRate: 18, gstAmount: Math.round(taxableAmount * 0.18) };
  }
};

const EnhancedBookingCard = ({
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
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const isAuthenticated = token && user;

  useEffect(() => {
    if (startDate && endDate && hotel?.id) {
      checkAvailability();
    }
  }, [startDate, endDate, hotel?.id]);

  // Save booking data whenever dates or guest count changes
  useEffect(() => {
    if (!hotel?.id) return;
    
    // Only save if we have meaningful data
    if (startDate || endDate || guestCount.adults > 1 || guestCount.children > 0 || guestCount.infants > 0 || (guestCount.pets && guestCount.pets > 0)) {
      const bookingData = {
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        guestCount,
        hotelName: hotel.name,
        hotelRate: hotel.rate
      };
      
      saveBookingData(hotel.id, bookingData);
    }
  }, [startDate, endDate, guestCount, hotel]);

  const checkAvailability = async () => {
    if (!startDate || !endDate || !hotel?.id) return;

    setCheckingAvailability(true);
    setAvailabilityError('');

    try {
      const response = await axios.post('/api/v1/calendar/check-availability', {
        hotelId: hotel.id,
        from: startDate.toISOString(),
        to: endDate.toISOString()
      });

      if (response.data.success) {
        setAvailability(response.data);
        if (!response.data.available) {
          setAvailabilityError('Selected dates are not available');
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityError('Failed to check availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleDateChange = (date, type) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleGuestChangeWithAuth = (type, operation) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    handleGuestChange(type, operation);
  };

  const handleReserveWithAuth = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    handleReserve();
  };

  const isDateRangeValid = startDate && endDate && endDate > startDate;
  const isAvailable = availability?.available === true;
  const hasConflicts = availability?.conflicts && availability.conflicts.length > 0;

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">
            {editMode ? (
              <input
                type="number"
                name="rate"
                value={tempHotel.rate}
                onChange={handleInputChange}
                min="0"
                className="w-24 sm:w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              `₹${hotel.rate}`
            )} 
            <span className="text-base sm:text-lg font-normal text-gray-600"> night</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Total before taxes</p>
        </div>
      </div>
      
      <div className="mb-4 sm:mb-6">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div>
            <label htmlFor="checkin" className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1 sm:mb-2">CHECK-IN</label>
             <DatePicker
               id="checkin"
               selected={startDate}
               onChange={(date) => handleDateChange(date, 'start')}
               selectsStart
               startDate={startDate}
               endDate={endDate}
               minDate={new Date()}
               placeholderText="Add date"
               className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
               popperPlacement="auto"
             />
          </div>
          <div>
            <label htmlFor="checkout" className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1 sm:mb-2">CHECKOUT</label>
             <DatePicker
               id="checkout"
               selected={endDate}
               onChange={(date) => handleDateChange(date, 'end')}
               selectsEnd
               startDate={startDate}
               endDate={endDate}
               minDate={startDate || new Date()}
               placeholderText="Add date"
               className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
               popperPlacement="auto"
             />
          </div>
        </div>

        {/* Availability Status */}
        {isDateRangeValid && (
          <div className="mt-3">
            {checkingAvailability ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Checking availability...
              </div>
            ) : availability ? (
              <div className={`flex items-center gap-2 text-sm ${
                isAvailable ? 'text-green-700' : 'text-red-700'
              }`}>
                {isAvailable ? (
                  <>
                    <FiCheck size={16} />
                    <span>Available for booking</span>
                  </>
                ) : (
                  <>
                    <FiAlertCircle size={16} />
                    <span>Not available</span>
                  </>
                )}
              </div>
            ) : null}

            {availabilityError && (
              <div className="flex items-center gap-2 text-sm text-red-700 mt-1">
                <FiAlertCircle size={16} />
                <span>{availabilityError}</span>
              </div>
            )}

            {hasConflicts && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800 mb-2">Conflicting bookings:</p>
                <div className="space-y-1">
                  {availability.conflicts.map((conflict, index) => (
                    <div key={index} className="text-xs text-red-700">
                      • {conflict.guestName} ({new Date(conflict.from).toLocaleDateString()} - {new Date(conflict.to).toLocaleDateString()})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 sm:mt-6 border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50">
          <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2 sm:mb-3">GUESTS</label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Adults</p>
                <p className="text-xs text-gray-600">Ages 13 or above</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGuestChangeWithAuth('adults', 'decrement')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center font-medium">{guestCount.adults}</span>
                <button
                  onClick={() => handleGuestChangeWithAuth('adults', 'increment')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Children</p>
                <p className="text-xs text-gray-600">Ages 2-12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGuestChangeWithAuth('children', 'decrement')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center font-medium">{guestCount.children}</span>
                <button
                  onClick={() => handleGuestChangeWithAuth('children', 'increment')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Infants</p>
                <p className="text-xs text-gray-600">Under 2</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGuestChangeWithAuth('infants', 'decrement')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center font-medium">{guestCount.infants}</span>
                <button
                  onClick={() => handleGuestChangeWithAuth('infants', 'increment')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Pets</p>
                <p className="text-xs text-gray-600">₹300 per night</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGuestChangeWithAuth('pets', 'decrement')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center font-medium">{guestCount.pets || 0}</span>
                <button
                  onClick={() => handleGuestChangeWithAuth('pets', 'increment')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      {isDateRangeValid && (() => {
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const baseTotal = calculateTotal();
        const petCharges = (guestCount.pets || 0) * 300 * nights;
        const taxableAmount = baseTotal + petCharges;
        const { gstRate, gstAmount } = calculateGST(hotel.rate, taxableAmount);
        const total = taxableAmount + gstAmount;
        
        return (
          <div className="border-t pt-4 mb-4 sm:mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>₹{hotel.rate} × {nights} nights</span>
                <span>₹{baseTotal}</span>
              </div>
              {(guestCount.pets || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Pet charges (₹300 × {guestCount.pets || 0} pets × {nights} nights)</span>
                  <span>₹{petCharges}</span>
                </div>
              )}
              {gstAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST ({gstRate}%)</span>
                  <span>₹{gstAmount}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Reserve Button */}
      <button
        onClick={handleReserveWithAuth}
        disabled={!isDateRangeValid || !isAvailable || checkingAvailability}
        className={`w-full py-3 sm:py-4 px-4 rounded-lg font-semibold text-white transition-colors ${
          !isDateRangeValid || !isAvailable || checkingAvailability
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-rose-600 hover:bg-rose-700'
        }`}
      >
        {checkingAvailability ? 'Checking...' : 'Reserve'}
      </button>

      {!isAvailable && isDateRangeValid && (
        <p className="text-center text-sm text-red-600 mt-2">
          Please select different dates
        </p>
      )}

      {/* Authentication Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Please login to select dates and make a booking"
      />
    </div>
  );
};

export default EnhancedBookingCard;
