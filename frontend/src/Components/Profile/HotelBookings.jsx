import React from 'react';

const HotelBookings = ({ userData }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Hotel Bookings</h1>
    {userData.hotels_name && userData.hotels_name.some(hotel => hotel.bookings && hotel.bookings.length > 0) ? (
      <div className="space-y-6">
        {userData.hotels_name.map((hotel) => (
          hotel.bookings && hotel.bookings.length > 0 && (
            <div key={hotel.id} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{hotel.name}</h2>
              <div className="space-y-4">
                {hotel.bookings.map((booking, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Booking #{index + 1}</h3>
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
                    <div className="mt-2">
                      <p className="text-gray-600">Guest: {booking.userName}</p>
                      <p className="text-gray-600">Contact: {booking.userEmail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">No bookings for your hotels yet.</p>
      </div>
    )}
  </div>
);

export default HotelBookings; 