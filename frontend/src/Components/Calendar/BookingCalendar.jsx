import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiUser, FiClock, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import axios from '../../utils/axiosConfig';

const BookingCalendar = ({ hotelId, onDateSelect, selectedDates, isOwner = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchCalendarData();
  }, [currentMonth, currentYear, hotelId]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/calendar/availability/${hotelId}`, {
        params: { month: currentMonth, year: currentYear }
      });
      
      if (response.data.success) {
        setCalendarData(response.data.calendar);
        setBookings(response.data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateClick = (day) => {
    if (!day || !day.available) return;
    
    if (onDateSelect) {
      onDateSelect(day.fullDate);
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const getDateStatus = (day) => {
    if (!day) return 'empty';
    if (!day.available) return 'booked';
    if (day.isToday) return 'today';
    if (selectedDates && selectedDates.some(date => 
      date.toDateString() === day.fullDate.toDateString()
    )) return 'selected';
    return 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-red-100 text-red-800 border-red-200';
      case 'today': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'selected': return 'bg-green-100 text-green-800 border-green-200';
      case 'available': return 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiCalendar className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => {
            const status = getDateStatus(day);
            const hasBookings = day.bookings && day.bookings.length > 0;
            
            return (
              <div
                key={index}
                className={`
                  min-h-[60px] p-2 border rounded-lg cursor-pointer transition-all
                  ${getStatusColor(status)}
                  ${day && day.available ? 'hover:shadow-md' : 'cursor-not-allowed'}
                `}
                onClick={() => handleDateClick(day)}
              >
                {day && (
                  <>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium">{day.date}</span>
                      {hasBookings && (
                        <div className="flex gap-1">
                          {day.bookings.slice(0, 2).map((booking, idx) => (
                            <div
                              key={idx}
                              className={`
                                w-2 h-2 rounded-full cursor-pointer
                                ${getBookingStatusColor(booking.status)}
                              `}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookingClick(booking);
                              }}
                              title={`${booking.guestName} - ${booking.status}`}
                            />
                          ))}
                          {day.bookings.length > 2 && (
                            <span className="text-xs text-gray-500">+{day.bookings.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {hasBookings && (
                      <div className="space-y-1">
                        {day.bookings.slice(0, 1).map((booking, idx) => (
                          <div
                            key={idx}
                            className={`
                              text-xs px-2 py-1 rounded cursor-pointer
                              ${getBookingStatusColor(booking.status)}
                            `}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookingClick(booking);
                            }}
                          >
                            {booking.guestName}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">Booking Details</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiUser className="text-gray-500" size={16} />
                  <div>
                    <p className="font-semibold">{selectedBooking.guestName}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.guestEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiCalendar className="text-gray-500" size={16} />
                  <div>
                    <p className="text-sm">
                      {new Date(selectedBooking.from).toLocaleDateString()} - 
                      {new Date(selectedBooking.to).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getBookingStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedBooking.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedBooking.paymentStatus}
                  </div>
                </div>

                {selectedBooking.message && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                    <p className="text-sm text-gray-600">{selectedBooking.message}</p>
                  </div>
                )}

                {isOwner && selectedBooking.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => {
                        // Handle approve booking
                        setShowBookingModal(false);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiCheck size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        // Handle reject booking
                        setShowBookingModal(false);
                      }}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiX size={16} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
