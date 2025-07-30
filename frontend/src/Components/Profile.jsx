import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND } from '../assets/Vars';
import { 
  FiEdit, FiSave, FiLogOut, FiUser, FiMail, FiPhone, 
  FiMapPin, FiClock, FiHome, FiCalendar, FiPlus, FiStar,
  FiChevronRight, FiTrash2
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PersonalInfo from './Profile/PersonalInfo';
import UserBookings from './Profile/UserBookings';
import MyHotels from './Profile/MyHotels';
import HotelBookings from './Profile/HotelBookings';
import ListingAccess from './Profile/ListingAccess';
import AccessRequests from './Profile/AccessRequests';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Separate state for user profile updates
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Separate state for listing access requests
  const [listingRequestData, setListingRequestData] = useState({
    email: '',
    phone: '',
    message: ''
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [requestSent, setRequestSent] = useState(false);
  const [accessRequests, setAccessRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user) {
          // If no token or user, redirect to login
          navigate('/login');
          return;
        }

        const response = await axios.get(`${BACKEND}/api/v1/user/profile/id/${user.id}`, {
          headers: {
            'Authorization': token
          }
        });
        
        setUserData(response.data.allData);
        setProfileFormData({
          name: response.data.allData.name || '',
          email: response.data.allData.email || '',
          phone: response.data.allData.phone || '',
          address: response.data.allData.address || ''
        });
        setListingRequestData({
          email: response.data.allData.email || '',
          phone: response.data.allData.phone || '',
          message: ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, user?.id]);

  const fetchAccessRequests = async () => {
    try {
      setRequestsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND}/api/v1/user/admin/request`, {
        headers: { 'Authorization': token }
      });
      setAccessRequests(response.data.request || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch access requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'accessRequests' && userData?.is_admin) {
      fetchAccessRequests();
    }
  }, [activeTab, userData?.is_admin]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleListingRequestInputChange = (e) => {
    const { name, value } = e.target;
    setListingRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${BACKEND}/api/v1/user/profile`, profileFormData, {
        headers: {
          'Authorization': token
        }
      });
      
      setUserData({...userData, ...profileFormData});
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
      
      await axios.post(`${BACKEND}/api/v1/user/upgrade_request`, listingRequestData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      setRequestSent(true);
      setError(null);
    } catch (err) {
      console.error('Error requesting listing access:', err);
      setError(err.response?.data?.message || 'Failed to send request. Please try again.');
    }
  };

  const handlePromoteUser = async (email, type) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = type === 'admin' 
        ? `${BACKEND}/api/v1/user/admin/makeAdmin` 
        : `${BACKEND}/api/v1/user/admin/makeHoteler`;
      
      const response = await axios.post(
        endpoint,
        { email },
        { headers: { 'Authorization': token } }
      );
      console.log(response);
      await fetchAccessRequests();
      if (response.data && response.data.success) {
        setError(null);
        alert(`User ${email} has been promoted to ${type}`);
      } else {
        setError(response.data?.message || 'Failed to promote user');
      }
    } catch (err) {
      console.log(err);
      const backendMsg = err.response?.data?.message;
      if (backendMsg === 'User is already a hotel owner.') {
        setError('User is already a hotel owner.');
      } else {
        setError(backendMsg || 'Failed to promote user');
      }
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND}/api/v1/user/admin/accessRequests/${requestId}`, {
        headers: { 'Authorization': token }
      });
      
      await fetchAccessRequests();
      setError(null);
      alert('Request has been rejected');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete request');
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
      <div className='min-h-screen pt-40 px-4 sm:px-6 lg:px-8'>
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

  // If userData is still null after loading, show loading spinner
  if (!userData) {
    return (
      <div className='min-h-screen pt-52 px-4 sm:px-6 lg:px-8 flex justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
        {userData.is_admin && (
          <button
            onClick={() => setActiveTab('accessRequests')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'accessRequests' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
          >
            Access Requests
          </button>
        )}
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <PersonalInfo
          userData={userData}
          editMode={editMode}
          profileFormData={profileFormData}
          handleProfileInputChange={handleProfileInputChange}
          handleSaveProfile={handleSaveProfile}
          setEditMode={setEditMode}
          handleLogout={handleLogout}
        />
      )}
      {/* Your Bookings Tab */}
      {activeTab === 'bookings' && (
        <UserBookings userData={userData} navigate={navigate} />
      )}
      {/* My Hotels Tab */}
      {activeTab === 'myHotels' && userData?.has_hotel && (
        <MyHotels userData={userData} navigate={navigate} />
      )}
      {/* Hotel Bookings Tab (for owners) */}
      {activeTab === 'hotelBookings' && userData?.has_hotel && (
        <HotelBookings userData={userData} />
      )}
      {/* Listing Access Tab */}
      {activeTab === 'listingAccess' && (
        <ListingAccess
          userData={userData}
          requestSent={requestSent}
          listingRequestData={listingRequestData}
          handleListingRequestInputChange={handleListingRequestInputChange}
          handleRequestListingAccess={handleRequestListingAccess}
          navigate={navigate}
        />
      )}
      {/* Access Requests Tab (Admin Only) */}
      {activeTab === 'accessRequests' && (
        <AccessRequests
          accessRequests={accessRequests}
          requestsLoading={requestsLoading}
          error={error}
          handlePromoteUser={handlePromoteUser}
          handleDeleteRequest={handleDeleteRequest}
        />
      )}
    </div>
  );
};

export default Profile;