import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiDollarSign, FiCheck, FiX, FiClock, FiAlertCircle, FiEye } from 'react-icons/fi';
import axios from '../../utils/axiosConfig';
import BookingCalendar from './BookingCalendar';
import DateBlockingModal from './DateBlockingModal';

const OwnerBookingDashboard = ({ hotelId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBlockingModal, setShowBlockingModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchBookings();
  }, [hotelId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/calendar/bookings/${hotelId}`);
      if (response.data.success) {
        setBookings(response.data.bookings);
        calculateStats(response.data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookings) => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
    setStats(stats);
  };

  const handleBookingStatusUpdate = async (bookingId, status, rejectionReason = '') => {
    try {
      const response = await axios.patch(`/api/v1/calendar/booking/${bookingId}/status`, {
        status,
        rejectionReason
      });

      if (response.data.success) {
        fetchBookings(); // Refresh bookings
        setShowBookingModal(false);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FiCheck size={16} />;
      case 'pending': return <FiClock size={16} />;
      case 'cancelled': return <FiX size={16} />;
      case 'completed': return <FiCheck size={16} />;
      case 'blocked': return <FiAlertCircle size={16} />;
      default: return <FiClock size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiCalendar className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheck className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.confirmed}</p>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUsers className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiX className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.cancelled}</p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <BookingCalendar 
            hotelId={hotelId} 
            isOwner={true}
            onDateSelect={(date) => {
              // Handle date selection for blocking
              setShowBlockingModal(true);
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
            <button
              onClick={() => setShowBlockingModal(true)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <FiAlertCircle size={16} />
              Block Dates
            </button>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-3">Recent Bookings</h3>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowBookingModal(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{booking.user.name}</p>
                    <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {new Date(booking.from).toLocaleDateString()} - {new Date(booking.to).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">All Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-gray-800">{booking.user.name}</p>
                      <p className="text-xs text-gray-600">{booking.user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-800">
                      {new Date(booking.from).toLocaleDateString()} - {new Date(booking.to).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium w-fit ${
                      booking.payment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.payment ? 'Paid' : 'Pending'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowBookingModal(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">Booking Details</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Guest Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedBooking.user.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedBooking.user.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedBooking.user.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Booking Details</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Check-in:</span> {new Date(selectedBooking.from).toLocaleDateString()}</p>
                      <p><span className="font-medium">Check-out:</span> {new Date(selectedBooking.to).toLocaleDateString()}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedBooking.message && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedBooking.message}
                      </p>
                    </div>
                  )}

                  {selectedBooking.status === 'pending' && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Actions</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBookingStatusUpdate(selectedBooking.id, 'confirmed')}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiCheck size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleBookingStatusUpdate(selectedBooking.id, 'cancelled', 'Booking rejected by owner')}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiX size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Blocking Modal */}
      <DateBlockingModal
        isOpen={showBlockingModal}
        onClose={() => setShowBlockingModal(false)}
        hotelId={hotelId}
        onBlockSuccess={fetchBookings}
      />
    </div>
  );
};

export default OwnerBookingDashboard;
