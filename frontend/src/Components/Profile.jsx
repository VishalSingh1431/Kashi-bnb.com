import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND, getAuthHeader } from '../assets/Vars';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PersonalInfo from './Profile/PersonalInfo';
import UserBookings from './Profile/UserBookings';
import MyHotels from './Profile/MyHotels';
import HotelBookings from './Profile/HotelBookings';
import ListingAccess from './Profile/ListingAccess';
import AccessRequests from './Profile/AccessRequests';
import ProfileTabs from './Profile/ProfileTabs';
import UserManagement from './Profile/UserManagement';
import RatingAndReviews from './Profile/RatingAndReviews';
import RecoveryPopup from './Profile/RecoveryPopup';
import UserDetailsModal from './Profile/UserDetailsModal';
import DeleteConfirmModal from './Profile/DeleteConfirmModal';
import { useAuth } from '../App';

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Use auth context instead of localStorage
  const { user: authUser, isLoggedIn } = useAuth();
  
  // Local state for user data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showRecoveryPopup, setShowRecoveryPopup] = useState(false);
  const [recoveryFormData, setRecoveryFormData] = useState({
    email: '',
    phone: ''
  });
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [recoveryType, setRecoveryType] = useState('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  // Separate state for user profile updates
  const [profileFormData, setProfileFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    address: '',
    name: ''
  });
  
  // Separate state for listing access requests
  const [listingRequestData, setListingRequestData] = useState({
    email: '',
    mobile: '',
    phone: ''
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [requestSent, setRequestSent] = useState(false);
  const [accessRequests, setAccessRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  
  // User management state
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Debug: Log authentication state changes
  useEffect(() => {
    // Removed excessive logging to prevent console spam
  }, [isLoggedIn, authUser]);
  
  // Redirect to login if not authenticated - but only after checking localStorage first
  useEffect(() => {
    // Check localStorage first before redirecting
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    // If we have both token and user in localStorage, don't redirect
    if (token && storedUser) {
      console.log('Profile: User authenticated via localStorage, not redirecting');
      setHasCheckedAuth(true);
      return;
    }
    
    // Add a small delay to give auth context time to initialize
    const redirectTimer = setTimeout(() => {
      // Only redirect if both localStorage and auth context are missing after delay
      if (!isLoggedIn && !authUser && !localStorage.getItem("token") && !localStorage.getItem("user")) {
        console.log('Profile: No authentication found anywhere after delay, redirecting to login');
        navigate('/login');
      }
      setHasCheckedAuth(true);
    }, 1000); // 1 second delay
    
    return () => clearTimeout(redirectTimer);
  }, [isLoggedIn, authUser, navigate]);
  
  // Show loading while auth context is initializing - but be more lenient
  if (!hasCheckedAuth && !isLoggedIn && !authUser && !localStorage.getItem("token") && !localStorage.getItem("user")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Set active tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    
    if (tabParam && ['personal', 'bookings', 'myHotels', 'hotelBookings', 'listingAccess', 'accessRequests', 'allUsers', 'ratingReviews'].includes(tabParam)) {
      // If user tries to access listingAccess but already has hotel access, redirect to personal tab
      if (tabParam === 'listingAccess' && userData?.has_hotel) {
        setActiveTab('personal');
        navigate('/profile?tab=personal', { replace: true });
        return;
      }
      setActiveTab(tabParam);
    }
  }, [searchParams, navigate]); // Removed userData?.has_hotel dependency to prevent infinite loop

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        console.log('Profile: Checking authentication');
        console.log('Profile: Token exists:', !!token);
        console.log('Profile: Stored user:', storedUser);
        console.log('Profile: Auth context user:', authUser);
        
        // Use either auth context user or localStorage user, whichever is available
        const currentUser = authUser || (storedUser ? JSON.parse(storedUser) : null);
        
        if (!token || !currentUser) {
          console.log('Profile: No token or user available, cannot fetch data');
          return;
        }
        
        console.log('Profile: Authentication passed, fetching user data');
        setLoading(true);

        const response = await axios.get(`${BACKEND}/api/v1/user/profile/id/${currentUser.id}`, {
          headers: {
            'Authorization': getAuthHeader(token)
          }
        });
        
        let userDataWithHotels = response.data.allData;
        
        // If user is admin, fetch all hotels
        if (currentUser.is_admin) {
          try {
            const hotelsResponse = await axios.get(`${BACKEND}/api/v1/hotel/hotels`, {
              headers: {
                'Authorization': getAuthHeader(token)
              }
            });
            console.log('Admin hotels response:', hotelsResponse.data);
            userDataWithHotels.hotels_name = hotelsResponse.data.hotels;
          } catch (hotelsError) {
            console.error('Error fetching all hotels:', hotelsError);
          }
        }
        
        console.log('Final userDataWithHotels:', userDataWithHotels);
        setUserData(userDataWithHotels);
        
        // Update profile form data with latest user data
        setProfileFormData({
          first_name: userDataWithHotels.first_name || '',
          last_name: userDataWithHotels.last_name || '',
          email: userDataWithHotels.email || '',
          mobile: userDataWithHotels.mobile || '',
          address: userDataWithHotels.address || '',
          name: userDataWithHotels.name || ''
        });
        
        setListingRequestData({
          email: userDataWithHotels.email || '',
          mobile: userDataWithHotels.mobile || '',
          phone: ''
        });
        
        // Check if user needs to add recovery contact method
        checkRecoveryNeeds(userDataWithHotels);
      } catch (err) {
        // Don't redirect on API errors, just show error message
        setError(err.response?.data?.message || 'Failed to fetch user data');
        console.error('Error fetching user data:', err);
        
        // Only redirect if it's an authentication error (401/403)
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('Profile: Authentication error, redirecting to login');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch data if we have user information (either from context or localStorage)
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const currentUser = authUser || (storedUser ? JSON.parse(storedUser) : null);
    
    if (token && currentUser && currentUser.id) {
      fetchUserData();
    }

    // Listen for user data updates from other components
    const handleUserDataUpdate = (event) => {
      const updatedUser = event.detail.user;
      // localStorage.setItem('user', JSON.stringify(updatedUser)); // This line is removed as per the new_code
      // setUser(updatedUser); // This line is removed as per the new_code
      // Don't call fetchUserData here to avoid loops
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []); // Empty dependency array - only run once on mount to prevent infinite loops

  const checkRecoveryNeeds = (userDataWithHotels) => {
    console.log('Profile: Checking recovery needs for user:', userDataWithHotels.id);
    
    // Check if user has already completed recovery
    const recoveryCompleted = localStorage.getItem(`recoveryCompleted_${userDataWithHotels.id}`);
    if (recoveryCompleted === 'true') {
      console.log('Profile: User has completed recovery, never showing popup');
      return;
    }
    
    // Check if user has already seen the popup in Home component
    const hasSeenRecoveryPopup = localStorage.getItem(`recoveryPopupShown_${userDataWithHotels.id}`);
    if (hasSeenRecoveryPopup === 'true') {
      console.log('Profile: User has already seen recovery popup in Home, not showing again');
      return;
    }
    
    if (!userDataWithHotels.mobile && !userDataWithHotels.phone) {
      const userCreatedAt = new Date(userDataWithHotels.time || userDataWithHotels.createdAt || Date.now());
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (userCreatedAt > oneHourAgo) {
        console.log('Profile: New user missing phone, showing phone recovery popup');
        setShowRecoveryPopup(true);
        // setRecoveryPopupShown(true); // This line is removed as per the new_code
        setRecoveryType("phone");
      } else {
        localStorage.setItem(`recoveryCompleted_${userDataWithHotels.id}`, 'true');
      }
    } else if (!userDataWithHotels.email) {
      const userCreatedAt = new Date(userDataWithHotels.time || userDataWithHotels.createdAt || Date.now());
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (userCreatedAt > oneHourAgo) {
        console.log('Profile: New user missing email, showing email recovery popup');
        setShowRecoveryPopup(true);
        // setRecoveryPopupShown(true); // This line is removed as per the new_code
        setRecoveryType("email");
      } else {
        localStorage.setItem(`recoveryCompleted_${userDataWithHotels.id}`, 'true');
      }
    } else {
      localStorage.setItem(`recoveryCompleted_${userDataWithHotels.id}`, 'true');
    }
  };

  const fetchAccessRequests = async () => {
    try {
      setRequestsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND}/api/v1/user/admin/request`, {
        headers: { 'Authorization': getAuthHeader(token) }
      });
      setAccessRequests(response.data.request || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch access requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setUsersLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND}/api/v1/admin/users`, {
        headers: {
          'Authorization': getAuthHeader(token)
        }
      });
      setAllUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Tab handlers
  const handlePersonalTabClick = () => setActiveTab('personal');
  const handleBookingsTabClick = () => setActiveTab('bookings');
  const handleMyHotelsTabClick = () => setActiveTab('myHotels');
  const handleHotelBookingsTabClick = () => setActiveTab('hotelBookings');
  const handleListingAccessTabClick = () => setActiveTab('listingAccess');
  
  const handleAccessRequestsTabClick = () => {
    setActiveTab('accessRequests');
    if (accessRequests.length === 0) {
      fetchAccessRequests();
    }
  };

  const handleAllUsersTabClick = () => {
    setActiveTab('allUsers');
    if (allUsers.length === 0) {
      fetchAllUsers();
    }
  };

  const handleRatingReviewsTabClick = () => {
    console.log('Rating Reviews tab clicked!');
    console.log('Current activeTab:', activeTab);
    setActiveTab('ratingReviews');
    console.log('Setting activeTab to ratingReviews');
  };

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
    let profileUpdateSuccessful = false;
    
    try {
      // Clear previous messages
      setError(null);
      setSuccessMessage(null);
      
      const token = localStorage.getItem("token");
      
      // Validate required fields
      if (!profileFormData.first_name && !profileFormData.last_name) {
        // debugSetError('First name or last name is required', 'validation'); // This line is removed as per the new_code
        return;
      }
      
      // Validate mobile number format if provided
      if (profileFormData.mobile && !/^[0-9]{10}$/.test(profileFormData.mobile.replace(/\D/g, ''))) {
        // debugSetError('Please enter a valid 10-digit mobile number', 'validation'); // This line is removed as per the new_code
        return;
      }
      
      // Construct the name field from first_name and last_name
      const updateData = {
        ...profileFormData,
        name: `${profileFormData.first_name || ''} ${profileFormData.last_name || ''}`.trim() || profileFormData.name || 'User'
      };
      
      // Remove empty fields to avoid validation errors
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null || updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      
      // Ensure we only send mobile field, not phone field to avoid conflicts
      if (updateData.mobile) {
        delete updateData.phone;
      }
      
      console.log('Sending profile update with data:', updateData);
      
      const response = await axios.put(`${BACKEND}/api/v1/user/profile`, updateData, {
        headers: {
          'Authorization': getAuthHeader(token)
        }
      });
      
      console.log('Profile update response:', response.data);
      console.log('Response status:', response.status);
      console.log('Response success flag:', response.data?.success);
      console.log('Response message:', response.data?.message);
      
      // Check if the response indicates success
      if (response.data && response.data.success === true) {
        console.log('Profile update successful, updating local state...');
        
        // Mark profile update as successful
        profileUpdateSuccessful = true;
        
        // Update local state
        setUserData({...userData, ...updateData});
        setEditMode(false);
        
        // Show success message
        // debugSetSuccess('Profile updated successfully!', 'profile_update'); // This line is removed as per the new_code
        
        // Update localStorage and authentication context
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...updateData };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update authentication context using login function
        try {
          const { login } = useAuth();
          if (login) {
            login(token, updatedUser);
          }
        } catch (loginError) {
          console.error('Error calling login function:', loginError);
          // Don't set error here as the profile update was successful
        }
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('userDataUpdated', { 
          detail: { user: updatedUser } 
        }));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          console.log('Clearing success message after timeout');
          setSuccessMessage(null);
        }, 3000);
        
        console.log('Profile update completed successfully');
      } else {
        // If response doesn't indicate success, treat as error
        console.error('Profile update response indicates failure:', response.data);
        // debugSetError(response.data?.message || 'Profile update failed', 'response_failure'); // This line is removed as per the new_code
      }
      
    } catch (err) {
      console.error('Error updating profile:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Full error object:', err);
      
      // Only set error if profile update wasn't successful
      if (!profileUpdateSuccessful) {
        // debugSetError(err.response?.data?.message || 'Failed to update profile', 'catch_block'); // This line is removed as per the new_code
      } else {
        console.log('Profile update was successful, not setting error');
      }
    }
  };

  const handleLogout = () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
    if (currentUser.id) {
      localStorage.removeItem(`recoveryPopupShown_${currentUser.id}`);
      localStorage.removeItem(`recoveryCompleted_${currentUser.id}`);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
  };

  const handleRequestListingAccess = async () => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.post(`${BACKEND}/api/v1/user/upgrade_request`, listingRequestData, {
        headers: {
          'Authorization': getAuthHeader(token),
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
        { headers: { 'Authorization': getAuthHeader(token) } }
      );
      
      await fetchAccessRequests();
      if (response.data && response.data.success) {
        setError(null);
        alert(`User ${email} has been promoted to ${type}`);
      } else {
        setError(response.data?.message || 'Failed to promote user');
      }
    } catch (err) {
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
      await axios.delete(`${BACKEND}/api/v1/user/admin/request/${requestId}`, {
        headers: { 'Authorization': getAuthHeader(token) }
      });
      await fetchAccessRequests();
    } catch (err) {
      console.error('Error deleting request:', err);
      setError('Failed to delete request');
    }
  };

  // Recovery popup functions
  const handleRecoveryInputChange = (field, value) => {
    setRecoveryFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendRecoveryOTP = async () => {
    if (recoveryType === "email") {
      if (!recoveryFormData.email || !recoveryFormData.email.includes('@')) {
        setRecoveryError("Please enter a valid email address");
        return;
      }
    } else if (recoveryType === "phone") {
      if (!recoveryFormData.phone || recoveryFormData.phone.length < 10) {
        setRecoveryError("Please enter a valid phone number");
        return;
      }
    }

    setRecoveryLoading(true);
    setRecoveryError("");

    try {
      const endpoint = recoveryType === "email" 
        ? `${BACKEND}/api/v1/otp/send-email-otp`
        : `${BACKEND}/api/v1/otp/send-phone-recovery-otp`;
      
      const data = recoveryType === "email" 
        ? { email: recoveryFormData.email }
        : { mobile: recoveryFormData.phone, userId: authUser.id };

      const response = await axios.post(endpoint, data);

      if (response.status === 200) {
        setOtpSent(true);
        setRecoveryError("");
        
        if (response.data.developmentMode) {
          let message = `Development Mode - OTP Generated: ${response.data.otp}`;
          if (response.data.emailError) {
            message += ` (Email Error: ${response.data.emailError})`;
          }
          setRecoverySuccess(message);
        } else {
          setRecoverySuccess(`OTP sent to your ${recoveryType}!`);
        }
      }
    } catch (err) {
      let errorMessage = `Failed to send ${recoveryType} OTP. Please try again.`;
      
      if (err.response?.status === 404) {
        if (recoveryType === "email") {
          errorMessage = "Email not found. Please sign up first.";
        } else {
          errorMessage = "User not found. Please sign up again.";
        }
      } else if (err.response?.status === 409) {
        if (recoveryType === "email") {
          errorMessage = "This email is already registered by another user.";
        } else {
          errorMessage = "This phone number is already registered by another user.";
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setRecoveryError(errorMessage);
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleVerifyRecoveryOTP = async (e) => {
    e.preventDefault();
    if (!recoveryOtp || recoveryOtp.length < 4) {
      setRecoveryError("Please enter a valid OTP");
      return;
    }

    setRecoveryLoading(true);
    setRecoveryError("");

    try {
      if (recoveryType === "email") {
        const response = await axios.post(`${BACKEND}/api/v1/otp/verify-email-otp`, {
          email: recoveryFormData.email,
          otp: recoveryOtp
        });

        if (response.status === 200) {
          // Email is already verified through OTP, just update the user data
          setRecoverySuccess("Email verified and added successfully!");
          // Keep popup open to show success message
          // Don't reset otpSent here - keep it true to show success
          setRecoveryOtp("");
          setOtpVerified(true);
          
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          currentUser.email = recoveryFormData.email;
          currentUser.verified = true;
          localStorage.setItem('user', JSON.stringify(currentUser));
          
          localStorage.removeItem(`recoveryPopupShown_${currentUser.id}`);
          localStorage.setItem(`recoveryCompleted_${currentUser.id}`, 'true');
          
          window.dispatchEvent(new CustomEvent('userDataUpdated', { 
            detail: { user: currentUser } 
          }));
          
          // Close popup after showing success message
          setTimeout(() => {
            setShowRecoveryPopup(false);
            setRecoverySuccess("");
            setOtpSent(false);
          }, 3000);
        }
      } else {
        const response = await axios.post(`${BACKEND}/api/v1/otp/verify-phone-recovery-otp`, {
          mobile: recoveryFormData.phone,
          otp: recoveryOtp,
          userId: authUser.id
        });

        if (response.status === 200) {
          setRecoverySuccess("Phone verified and added successfully!");
          // Keep popup open to show success message
          // Don't reset otpSent here - keep it true to show success
          setRecoveryOtp("");
          setOtpVerified(true);
          
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          currentUser.mobile = recoveryFormData.phone;
          localStorage.setItem('user', JSON.stringify(currentUser));
          
          localStorage.removeItem(`recoveryPopupShown_${currentUser.id}`);
          localStorage.setItem(`recoveryCompleted_${currentUser.id}`, 'true');
          
          window.dispatchEvent(new CustomEvent('userDataUpdated', { 
            detail: { user: currentUser } 
          }));
          
          // Close popup after showing success message
          setTimeout(() => {
            setShowRecoveryPopup(false);
            setRecoverySuccess("");
            setOtpSent(false);
          }, 3000);
        }
      }
    } catch (err) {
      let errorMessage = `${recoveryType.charAt(0).toUpperCase() + recoveryType.slice(1)} verification failed. Please try again.`;
      
      if (err.response?.status === 400) {
        errorMessage = "Invalid or expired OTP. Please try again.";
      } else if (err.response?.status === 404) {
        errorMessage = "User not found. Please sign up again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setRecoveryError(errorMessage);
    } finally {
      setRecoveryLoading(false);
    }
  };

  const skipRecovery = () => {
    console.log('Profile: User skipped recovery, setting completion flag');
    setShowRecoveryPopup(false);
    setOtpSent(false);
    setRecoveryOtp("");
    setRecoveryError("");
    setRecoverySuccess("");
    
    // Set the flag when user actually skips
    if (authUser && authUser.id) {
      localStorage.removeItem(`recoveryPopupShown_${authUser.id}`);
      localStorage.setItem(`recoveryCompleted_${authUser.id}`, 'true');
      console.log('Profile: Recovery marked as completed (skipped)');
    }
  };

  // User management functions
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND}/api/v1/admin/users/${userId}`, {
        headers: {
          'Authorization': getAuthHeader(token)
        }
      });
      
      setAllUsers(allUsers.filter(u => u.id !== userId));
      setDeleteConfirm(null);
      
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Profile...</h2>
          <p className="text-gray-500">Please wait while we fetch your information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-8 rounded-xl mb-6">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading User Data...</h2>
          <p className="text-gray-500">Please wait while we prepare your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Loading Indicator */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white py-2 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Loading your profile...</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header - Removed as requested */}
        
        <ProfileTabs 
          activeTab={activeTab}
          userData={userData}
          onTabClick={{
            personal: handlePersonalTabClick,
            bookings: handleBookingsTabClick,
            myHotels: handleMyHotelsTabClick,
            hotelBookings: handleHotelBookingsTabClick,
            listingAccess: handleListingAccessTabClick,
            accessRequests: handleAccessRequestsTabClick,
            allUsers: handleAllUsersTabClick,
            ratingReviews: handleRatingReviewsTabClick
          }}
        />

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <PersonalInfo
              userData={{
                ...userData,
                phone: userData?.mobile || profileFormData.mobile || 'Not provided'
              }}
              editMode={editMode}
              profileFormData={profileFormData}
              handleProfileInputChange={handleProfileInputChange}
              handleSaveProfile={handleSaveProfile}
              setEditMode={setEditMode}
              handleLogout={handleLogout}
              successMessage={successMessage}
            />
          )}
          
          {/* Your Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <UserBookings userData={userData} navigate={navigate} />
            </div>
          )}
          
          {/* My Hotels Tab */}
          {activeTab === 'myHotels' && userData?.has_hotel && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <MyHotels userData={userData} navigate={navigate} />
            </div>
          )}
          
          {/* Hotel Bookings Tab */}
          {activeTab === 'hotelBookings' && userData?.has_hotel && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <HotelBookings userData={userData} />
            </div>
          )}
          
          {/* Listing Access Tab */}
          {activeTab === 'listingAccess' && !userData?.has_hotel && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <ListingAccess
                userData={userData}
                requestSent={requestSent}
                listingRequestData={listingRequestData}
                handleListingRequestInputChange={handleListingRequestInputChange}
                handleRequestListingAccess={handleRequestListingAccess}
                navigate={navigate}
                fromListings={searchParams.get('tab') === 'listingAccess'}
              />
            </div>
          )}
          
          {/* Success message when user already has hotel access */}
          {activeTab === 'listingAccess' && userData?.has_hotel && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
                <p className="text-gray-600 mb-4">You already have listing access to add your properties.</p>
                <p className="text-gray-500 text-sm">Use the "My Hotels" tab to manage your property listings.</p>
                <button
                  onClick={() => {
                    setActiveTab('myHotels');
                    navigate('/profile?tab=myHotels', { replace: true });
                  }}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Go to My Hotels
                </button>
              </div>
            </div>
          )}
          
          {/* Access Requests Tab */}
          {activeTab === 'accessRequests' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Access Requests</h2>
                  <p className="text-gray-600 mt-1">Manage user requests for listing access</p>
                </div>
                <button
                  onClick={fetchAccessRequests}
                  className="px-4 py-2 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              
              {requestsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading access requests...</p>
                </div>
              ) : accessRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">No access requests loaded yet</p>
                  <button
                    onClick={fetchAccessRequests}
                    className="px-4 py-2 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Load Requests
                  </button>
                </div>
              ) : (
                <AccessRequests
                  accessRequests={accessRequests}
                  requestsLoading={requestsLoading}
                  error={error}
                  handlePromoteUser={handlePromoteUser}
                  handleDeleteRequest={handleDeleteRequest}
                />
              )}
            </div>
          )}
          
          {/* All Users Tab */}
          {activeTab === 'allUsers' && (
            <UserManagement
              allUsers={allUsers}
              usersLoading={usersLoading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              fetchAllUsers={fetchAllUsers}
              handleViewUser={handleViewUser}
              setDeleteConfirm={setDeleteConfirm}
              user={authUser}
            />
          )}

          {/* Rating & Reviews Tab */}
          {activeTab === 'ratingReviews' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Rate & Review</h2>
                <p className="text-gray-600 mt-1">Rate and review your completed bookings</p>
              </div>
              <RatingAndReviews />
            </div>
          )}
        </div>
      </div>

      {/* Modals and Popups */}
      <UserDetailsModal
        showModal={showUserModal}
        selectedUser={selectedUser}
        onClose={() => setShowUserModal(false)}
      />

      <DeleteConfirmModal
        deleteConfirm={deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        onDelete={handleDeleteUser}
      />

      <RecoveryPopup
        showPopup={showRecoveryPopup}
        recoveryType={recoveryType}
        recoveryLoading={recoveryLoading}
        recoveryOtpSent={otpSent}
        recoveryOtp={recoveryOtp}
        setRecoveryOtp={setRecoveryOtp}
        recoveryFormData={recoveryFormData}
        recoveryMessage={recoverySuccess}
        recoveryError={recoveryError}
        onSendOTP={handleSendRecoveryOTP}
        onVerifyOTP={handleVerifyRecoveryOTP}
        onSkip={skipRecovery}
        onRecoveryInputChange={handleRecoveryInputChange}
      />
    </div>
  );
};

export default Profile;