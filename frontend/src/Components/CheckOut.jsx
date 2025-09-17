import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser, FiHome, FiCreditCard, FiUsers, FiHeart } from 'react-icons/fi';
import { BACKEND } from '../assets/Vars';
import axios from 'axios';
import AuthPromptModal from './AuthPromptModal';
import { getBookingData, clearBookingData, parseStoredDates } from '../utils/bookingStorage';

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

const CheckOut = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [guestCount, setGuestCount] = useState({
    adults: 1,
    children: 0,
    pets: 0
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const isAuthenticated = token && user;

  // Get booking details from location state or stored data
  const getBookingDetails = () => {
    if (location.state) {
      return location.state;
    }
    
    // Try to get stored booking data
    const storedData = getBookingData(id);
    if (storedData) {
      const parsedData = parseStoredDates(storedData);
      return {
        startDate: parsedData.startDate,
        endDate: parsedData.endDate,
        guests: parsedData.guestCount || { adults: 1, children: 0, pets: 0 },
        total: 0, // Will be calculated
        hotelName: parsedData.hotelName || ''
      };
    }
    
    // Default fallback
    return {
      startDate: null,
      endDate: null,
      guests: { adults: 1, children: 0, pets: 0 },
      total: 0,
      hotelName: ''
    };
  };

  const bookingDetails = getBookingDetails();

  const [bookingData, setBookingData] = useState({
    startDate: bookingDetails.startDate,
    endDate: bookingDetails.endDate,
    total: bookingDetails.total,
    hotelName: bookingDetails.hotelName
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!id) return; // No id on non-checkout routes (e.g., Home), skip fetching
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/api/v1/hotel/hotel/${id}`);
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  const handleGuestChange = (type, operation) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setGuestCount(prev => {
      const newValue = operation === 'increment' ? prev[type] + 1 : prev[type] - 1;
      
      // Set limits based on type
      let maxLimit;
      switch(type) {
        case 'adults':
          maxLimit = hotel?.maxInRoom || 16;
          if (newValue < 1) return prev; // Minimum 1 adult
          break;
        case 'children':
          maxLimit = 10;
          if (newValue < 0) return prev;
          break;
        case 'pets':
          maxLimit = 5;
          if (newValue < 0) return prev;
          break;
        default:
          maxLimit = 10;
      }

      if (newValue > maxLimit) return prev;

      return {
        ...prev,
        [type]: newValue
      };
    });
  };

  const calculateNights = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    return Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    if (!hotel) return 0;
    const basePrice = parseInt(hotel.rate) * nights;
    const petCharges = (bookingDetails.guests.pets || 0) * 300 * nights;
    return basePrice + petCharges;
  };

  const calculateFinalTotal = () => {
    const taxableAmount = calculateTotal();
    const { gstAmount } = calculateGST(hotel?.rate || 0, taxableAmount);
    return taxableAmount + gstAmount;
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    // Payment logic here
    console.log('Processing payment...');
    
    // After successful payment, clear the stored booking data
    // This would typically be called after payment verification
    // clearBookingData(id);
  };

  // Clear booking data after successful booking (this would be called from payment success handler)
  const clearBookingDataAfterSuccess = () => {
    clearBookingData(id);
  };

  if (!id) {
    return null; // Render nothing when used outside the checkout route
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hotel Not Found</h2>
          <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiArrowLeft size={20} />
            Back to property
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {hotel.images?.[0]?.url ? (
                    <img 
                      src={hotel.images[0].url} 
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiHome size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{hotel.name}</h1>
                  <p className="text-gray-600 mb-2">{hotel.address}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>₹{hotel.rate}/night</span>
                    <span>•</span>
                    <span>{hotel.maxInRoom} guests max</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Who's coming?</h2>
              
              <div className="space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">Adults</h3>
                    <p className="text-sm text-gray-600">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleGuestChange('adults', 'decrement')}
                      disabled={guestCount.adults <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{guestCount.adults}</span>
                    <button
                      onClick={() => handleGuestChange('adults', 'increment')}
                      disabled={guestCount.adults >= (hotel?.maxInRoom || 16)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">Children</h3>
                    <p className="text-sm text-gray-600">Ages 0-12</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleGuestChange('children', 'decrement')}
                      disabled={guestCount.children <= 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{guestCount.children}</span>
                    <button
                      onClick={() => handleGuestChange('children', 'increment')}
                      disabled={guestCount.children >= 10}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">Pets</h3>
                    <p className="text-sm text-gray-600">Service animals allowed</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleGuestChange('pets', 'decrement')}
                      disabled={guestCount.pets <= 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{guestCount.pets}</span>
                    <button
                      onClick={() => handleGuestChange('pets', 'increment')}
                      disabled={guestCount.pets >= 5}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Total guests:</strong> {guestCount.adults + guestCount.children + guestCount.pets}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">When are you coming?</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input
                    type="date"
                    value={bookingData.startDate ? new Date(bookingData.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input
                    type="date"
                    value={bookingData.endDate ? new Date(bookingData.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Price details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>₹{hotel.rate} × {calculateNights()} nights</span>
                  <span>₹{parseInt(hotel.rate) * calculateNights()}</span>
                </div>
                
                {(bookingDetails.guests.pets || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Pet charges (₹300 × {bookingDetails.guests.pets} pets × {calculateNights()} nights)</span>
                    <span>₹{(bookingDetails.guests.pets || 0) * 300 * calculateNights()}</span>
                  </div>
                )}
                
                {(() => {
                  const taxableAmount = calculateTotal();
                  const { gstRate, gstAmount } = calculateGST(hotel.rate, taxableAmount);
                  return gstAmount > 0 && (
                    <div className="flex justify-between">
                      <span>GST ({gstRate}%)</span>
                      <span>₹{gstAmount}</span>
                    </div>
                  );
                })()}
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{calculateFinalTotal()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Reserve now
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Please login to complete your booking and checkout"
      />
    </div>
  );
};

export default CheckOut;