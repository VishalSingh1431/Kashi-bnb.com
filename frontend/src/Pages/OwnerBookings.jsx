import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUsers, FiSettings } from 'react-icons/fi';
import axios from '../utils/axiosConfig';
import OwnerBookingDashboard from '../Components/Calendar/OwnerBookingDashboard';

const OwnerBookings = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotelDetails();
  }, [hotelId]);

  const fetchHotelDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/hotel/${hotelId}`);
      if (response.data.success) {
        setHotel(response.data.hotel);
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hotel not found</h2>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{hotel.name}</h1>
                <p className="text-gray-600">Booking Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/hotel/${hotelId}`)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiCalendar size={16} />
                View Hotel
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSettings size={16} />
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OwnerBookingDashboard hotelId={hotelId} />
      </div>
    </div>
  );
};

export default OwnerBookings;
