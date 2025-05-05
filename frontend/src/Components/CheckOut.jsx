import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser, FiHome, FiCreditCard } from 'react-icons/fi';
import axios from 'axios';
import { BACKEND } from '../assets/Vars';

const CheckOut = () => {
  const { state } = useLocation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
//   const BACKEND = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!state) {
      nav('/');
    }
  }, [state, nav]);

  if (!state) return null;

  const { 
    hotelId, 
    hotelName, 
    checkIn, 
    checkOut, 
    guests, 
    totalPrice, 
    hotelImage,
    rate 
  } = state;

  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (order) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: hotelName,
      description: `Booking for ${nights} night(s)`,
      image: hotelImage || 'https://example.com/your_logo.png',
      order_id: order.id,
      handler: async function(response) {
        // Verify payment on server
        try {
          const verifyResponse = await axios.post(
            `${BACKEND}/api/v1/payments/verify`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: {
                hotelId,
                checkIn,
                checkOut,
                guests,
                totalPrice
              }
            },
            {
              headers: {
                'Authorization': token
              }
            }
          );

          if (verifyResponse.data.success) {
            setBookingId(verifyResponse.data.booking._id);
            setBookingSuccess(true);
          } else {
            alert('Payment verification failed');
          }
        } catch (error) {
          console.error('Verification error:', error);
          alert('Payment verification failed');
        }
      },
      prefill: {
        name: JSON.parse(localStorage.getItem("user"))?.name || '',
        email: JSON.parse(localStorage.getItem("user"))?.email || '',
        contact: JSON.parse(localStorage.getItem("user"))?.phone || ''
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const initiatePayment = async () => {
    setLoading(true);
    try {
      // Create order on your backend
      const orderResponse = await axios.post(
        `${BACKEND}/api/v1/payments/create-order`,
        {
          amount: totalPrice * 100, // Razorpay expects amount in paise
          currency: "INR",
          receipt: `booking_${hotelId}_${Date.now()}`
        },
        {
          headers: {
            'Authorization': token
          }
        }
      );

      if (orderResponse.data.success) {
        displayRazorpay(orderResponse.data.order);
      } else {
        alert('Failed to create payment order');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const GuestSummary = ({ type, count }) => {
    if (count === 0) return null;
    
    const labels = {
      adults: `${count} ${count === 1 ? 'Adult' : 'Adults'}`,
      children: `${count} ${count === 1 ? 'Child' : 'Children'}`,
      infants: `${count} ${count === 1 ? 'Infant' : 'Infants'}`,
      pets: `${count} ${count === 1 ? 'Pet' : 'Pets'}`
    };

    return (
      <div className="flex items-center text-gray-600">
        <FiUser className="mr-2" />
        <span>{labels[type]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => nav(-1)}
          className="flex items-center text-indigo-600 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to hotel
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete your booking</h1>

        {bookingSuccess ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">Your booking ID: {bookingId}</p>
              <p className="text-gray-600">We've sent the confirmation details to your email.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
                  
                  <div className="flex items-start mb-6">
                    {hotelImage && (
                      <img 
                        src={hotelImage} 
                        alt={hotelName} 
                        className="w-24 h-24 object-cover rounded-lg mr-4"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg capitalize">{hotelName}</h3>
                      <div className="flex items-center text-gray-600 mt-2">
                        <FiCalendar className="mr-2" />
                        <span>
                          {new Date(checkIn).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} - {new Date(checkOut).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <GuestSummary type="adults" count={guests.adults} />
                        <GuestSummary type="children" count={guests.children} />
                        <GuestSummary type="infants" count={guests.infants} />
                        <GuestSummary type="pets" count={guests.pets} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="credit-card"
                        name="payment"
                        checked
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit/Debit Card (Powered by Razorpay)
                      </label>
                    </div>
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Secure payment processed by Razorpay
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Price Details</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">₹{rate} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                      <span>₹{rate * nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & Fees</span>
                      <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total (INR)</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={initiatePayment}
                    disabled={loading}
                    className={`w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    By clicking "Pay Now", you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOut;