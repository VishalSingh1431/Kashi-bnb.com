import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND } from '../assets/Vars';
import { 
  FiEdit, FiSave, FiLogOut, FiUser, FiMail, FiPhone, 
  FiMapPin, FiClock, FiHome, FiCalendar, FiPlus, FiStar,
  FiChevronRight
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [requestSent, setRequestSent] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${BACKEND}/api/v1/user/profile/id/${user.id}`, {
          headers: {
            'Authorization': token
          }
        });
        setUserData(response.data.allData);
        setFormData({
          name: response.data.allData.name || '',
          email: response.data.allData.email || '',
          phone: response.data.allData.phone || '',
          address: response.data.allData.address || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${BACKEND}/api/v1/user/profile`, formData, {
        headers: {
          'Authorization': token
        }
      });
      
      setUserData({...userData, ...formData});
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
  };

  const handleRequestListingAccess = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BACKEND}/api/v1/user/update_request`, {}, {
        headers: {
          'Authorization': token
        }
      });
      setRequestSent(true);
    } catch (err) {
      console.error('Error requesting listing access:', err);
      setError(err.response?.data?.message || 'Failed to send request');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen pt-52 px-4 sm:px-6 lg:px-8 flex justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen pt-52 px-4 sm:px-6 lg:px-8'>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='min-h-screen pt-52 px-4 sm:px-6 lg:px-8 text-center'>
        <p>No user data found. Please login.</p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-8'>
      {/* Navigation Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'personal' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
        >
          Personal Info
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'bookings' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
        >
          Your Bookings
        </button>
        {userData.has_hotel && (
          <>
            <button
              onClick={() => setActiveTab('myHotels')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'myHotels' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            >
              My Hotels
            </button>
            <button
              onClick={() => setActiveTab('hotelBookings')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'hotelBookings' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            >
              Hotel Bookings
            </button>
          </>
        )}
        <button
          onClick={() => setActiveTab('listingAccess')}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'listingAccess' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
        >
          Listing Access
        </button>
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Personal Information</h1>
              <p className="text-gray-600">Manage your account details</p>
            </div>
            <div className="flex space-x-2">
              {editMode ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <FiSave className="mr-2" /> Save
                  </button>
                  <button 
                    onClick={() => setEditMode(false)}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setEditMode(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <FiEdit className="mr-2" /> Edit Profile
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                  <span className="text-4xl text-gray-500">
                    {userData.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mt-2 capitalize">{userData.name}</h2>
                <p className="text-gray-600">{userData.is_admin ? 'Admin' : 'User'}</p>
                <div className="mt-4 flex items-center text-gray-500">
                  <FiClock className="mr-2" />
                  <span>Member since {new Date(userData.time).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FiUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-800">Name</h3>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-600 capitalize">{userData.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FiMail className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-800">Email</h3>
                    <p className="mt-1 text-gray-600">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FiPhone className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-600">{userData.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FiMapPin className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-800">Address</h3>
                    {editMode ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-600">{userData.address || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Your Bookings Tab */}
      {activeTab === 'bookings' && (
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
                    <FiHome className="mr-2" />
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
      )}

      {/* My Hotels Tab */}
      {activeTab === 'myHotels' && userData?.has_hotel && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Hotels</h1>
            <button 
              onClick={() => navigate('/add-listing')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <FiPlus className="mr-2" /> Add Hotel
            </button>
          </div>
          
          {userData.hotels_name && userData.hotels_name.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.hotels_name.map((hotel) => (
                <div key={hotel.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {hotel.images?.[0]?.url ? (
                      <img 
                        src={hotel.images[0].url} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <FiHome size={48} />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-sm">
                      ₹{hotel.rate}/night
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg capitalize">{hotel.name}</h3>
                      <div className="flex items-center">
                        <FiStar className="text-yellow-400 mr-1" />
                        <span>5.0</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{hotel.details || 'No description available'}</p>
                    <div className="mt-3 flex items-center text-gray-500">
                      <FiMapPin className="mr-2" />
                      <span className="text-sm truncate">{hotel.address || 'Address not available'}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <button 
                        onClick={() => navigate(`/hotel/${hotel.id}`)}
                        className="flex items-center px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                      >
                        View <FiChevronRight className="ml-1" />
                      </button>
                      <button 
                        onClick={() => navigate(`/edit-hotel/${hotel.id}`)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't added any hotels yet.</p>
              <button 
                onClick={() => navigate('/add-hotel')}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Add Your First Hotel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hotel Bookings Tab (for owners) */}
      {activeTab === 'hotelBookings' && userData?.has_hotel && (
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
      )}

      {/* Listing Access Tab */}
      {activeTab === 'listingAccess' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Listing Access</h1>
          
          {userData.has_hotel ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You already have listing access as a hotel owner.</p>
              <button 
                onClick={() => navigate('/add-hotel')}
                className="flex items-center justify-center mx-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                <FiPlus className="mr-2" /> Add New Hotel
              </button>
            </div>
          ) : requestSent ? (
            <div className="text-center py-8">
              <p className="text-green-600 mb-4">Your request for listing access has been sent successfully!</p>
              <p className="text-gray-600">We'll review your request and get back to you soon.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Request access to list your property on our platform.</p>
              <button 
                onClick={handleRequestListingAccess}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Request Listing Access
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;