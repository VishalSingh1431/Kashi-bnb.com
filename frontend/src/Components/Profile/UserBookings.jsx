import React from 'react';

const UserBookings = ({ userData, navigate }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h1>
    {userData.bookings && userData.bookings.length > 0 ? (
      <div className="space-y-4">
        {userData.bookings.map((booking, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{booking.hotelName || 'Hotel Booking'}</h3>
                <p className="text-gray-600">
                  {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{booking.totalAmount}</p>
                <p className={`text-sm ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {booking.status || 'pending'}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-gray-500">
              <span className="mr-2">🏠</span>
              <span>{booking.hotelAddress || 'Address not available'}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have any bookings yet.</p>
        <button 
          onClick={() => navigate('/hotels')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Browse Hotels
        </button>
      </div>
    )}
  </div>
);

export default UserBookings; 