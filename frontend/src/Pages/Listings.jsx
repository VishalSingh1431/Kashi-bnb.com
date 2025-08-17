import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Import action icons for the main page
import { FiSave, FiX, FiImage, FiYoutube, FiMapPin, FiHome, FiDollarSign, FiInfo, FiCheckCircle } from "react-icons/fi";

import DescriptionForm from "../Components/Listings/DescriptionForm";
import LocationForm from "../Components/Listings/LocationForm";
import RoomDetailsForm from "../Components/Listings/RoomDetailsForm";
import AmenitiesForm from "../Components/Listings/AmenitiesForm";
import BookingWidget from "../Components/Listings/BookingWidget";
import YouTubeVideoForm from "../Components/Listings/YouTubeVideoForm";
import NumberForm from "../Components/NumberForm";
import PropertyTypeSelector from "../Components/Listings/PropertyTypeSelector";
import GuestAccessSelector from "../Components/Listings/GuestAccessSelector";
// Keep constants and localStorage access in the parent
import { BACKEND, getAuthHeader } from "../assets/Vars";
import ImageUploader from "../Components/Listings/ImageUploader";
import { useAuth } from "../App";

const Listings = () => {
  const nav = useNavigate();
  const { isLoggedIn, user, isLoading } = useAuth();
  
  // State definitions moved to the top
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guestCount, setGuestCount] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0
  });
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [listingAccessForm, setListingAccessForm] = useState({ phone: '' });
  const [listingAccessRequestSent, setListingAccessRequestSent] = useState(false);
  const [isSubmittingAccess, setIsSubmittingAccess] = useState(false);
  const [listing, setListing] = useState({
    name: '',
    address: '',
    rate: '',
    maxInRoom: 2,
    totalRoom: 1,
    maxAdults: 16,
    maxChildren: 5,
    maxInfants: 5,
    maxPets: 2,
    propertyType: 'House',
    guestAccess: 'Entire place',
    details: '',
    gmap: '',
    videoUrl: '',
    wifi: false,
    tv: false,
    kitchen: false,
    washingmachine: false,
    parking: false,
    ac: false,
    pool: false,
    fireextinguisher: false,
    firstaid: false,
    geyser: false,
    microwave: false,
    waterFilter: false
  });

  // Check authentication status on mount and when navigation occurs
  useEffect(() => {
    // Remove the login check - anyone can view the page
    setShowLoginMessage(false);
    
    // Reset listing access form when user changes
    if (user) {
      setListingAccessForm({ phone: '' });
      setListingAccessRequestSent(false);
    }
  }, [isLoggedIn, isLoading, user]);

  // Auto-refresh user data when component mounts to ensure latest permissions
  useEffect(() => {
    if (isLoggedIn && user) {
      // Refresh user data to get latest permissions
      const refreshUser = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${BACKEND}/api/v1/user/me`, {
            headers: {
              'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            if (userData.success && userData.user) {
              // Update local storage with fresh user data
              localStorage.setItem("user", JSON.stringify(userData.user));
              // Dispatch event to update auth context
              window.dispatchEvent(new CustomEvent('authStateChanged', { 
                detail: { isLoggedIn: true, user: userData.user } 
              }));
            }
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      };
      
      refreshUser();
    }
  }, [isLoggedIn, user]);

  // Cleanup function to reset state when component unmounts
  useEffect(() => {
    return () => {
      // Reset all state when component unmounts
      setCurrentImageIndex(0);
      setStartDate(null);
      setEndDate(null);
      setGuestCount({
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0
      });
      setImages([]);
      setVideoUrl('');
      setListingAccessForm({ phone: '' });
      setListingAccessRequestSent(false);
      setListing({
        name: '',
        address: '',
        rate: '',
        maxInRoom: 2,
        totalRoom: 1,
        maxAdults: 16,
        maxChildren: 5,
        maxInfants: 5,
        maxPets: 2,
        propertyType: 'House',
        guestAccess: 'Entire place',
        details: '',
        gmap: '',
        videoUrl: '',
        wifi: false,
        tv: false,
        kitchen: false,
        washingmachine: false,
        parking: false,
        ac: false,
        pool: false,
        fireextinguisher: false,
        firstaid: false,
        geyser: false,
        microwave: false,
        waterFilter: false
      });
    };
  }, [nav]);
  
  // All logic remains in the parent component
  const calculateTotal = () => {
    if (!startDate || !endDate || !listing.rate) return 0;
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return nights > 0 ? parseInt(listing.rate) * nights : 0;
  };

  const nextImage = () => {
    if (images?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListing(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setListing(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePropertyTypeSelect = (type) => {
    setListing(prev => ({
      ...prev,
      propertyType: type
    }));
  };

  const handleGuestAccessSelect = (access) => {
    setListing(prev => ({
      ...prev,
      guestAccess: access
    }));
  };

  const handleImageUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    
    // Check total image count limit (100 total images per hotel)
    const totalImages = images.length + newFiles.length;
    if (totalImages > 100) {
      alert(`You can upload maximum 100 images. You currently have ${images.length} images and trying to add ${newFiles.length} more.`);
      return;
    }
    
    // Check images per upload limit (100 images per upload)
    if (newFiles.length > 100) {
      alert(`You can select maximum 100 images at once. Please select fewer images.`);
      return;
    }
    
    setImages(prevImages => {
      const updatedImages = [...prevImages, ...newFiles];
      return updatedImages;
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    // Reset current image index if needed
    if (currentImageIndex >= images.length - 1 && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleSetCurrentImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleVideoUrlChange = (url) => {
    setVideoUrl(url);
    setListing(prev => ({
      ...prev,
      videoUrl: url
    }));
  };

  // Listing Access Form Functions
  const handleListingAccessInputChange = (e) => {
    const { name, value } = e.target;
    setListingAccessForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleListingAccessSubmit = async () => {
    if (!listingAccessForm.phone) {
      alert('Please enter your phone number');
      return;
    }

    setIsSubmittingAccess(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Send request to backend
      const response = await axios.post(`${BACKEND}/api/v1/user/upgrade_request`, {
        phone: listingAccessForm.phone,
        email: user.email,
        message: `User ${user.email} (${user.first_name || user.name || 'User'}) is requesting listing access. Phone: ${listingAccessForm.phone}`
      }, {
        headers: {
          'Authorization': getAuthHeader(token),
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setListingAccessRequestSent(true);
        setListingAccessForm({ phone: '' });
        
        // Send email notification to admin
        try {
          await axios.post(`${BACKEND}/api/v1/user/send-notification-email`, {
            to: 'vishalsingh05072003@gmail.com',
            subject: 'New Listing Access Request',
            message: `A new user has requested listing access:

User: ${user.email}
Name: ${user.first_name || user.name || 'User'}
Phone: ${listingAccessForm.phone}
Request Time: ${new Date().toLocaleString()}

Please verify and contact the user.`
          }, {
            headers: {
              'Authorization': getAuthHeader(token),
              'Content-Type': 'application/json'
            }
          });
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
          // Don't fail the main request if email fails
        }
      }
    } catch (error) {
      console.error('Error submitting listing access request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmittingAccess(false);
    }
  };


  
  const handleSubmitListing = async () => {
    // Get fresh token and user data from localStorage
    const currentToken = localStorage.getItem("token");
    
    // Check if user is authenticated
    if (!isLoggedIn || !user) {
      alert('Please log in to create a listing. Only verified hotel owners can create property listings.');
      return;
    }
    
    // Check if user is a hoteler (has hotel access)
    if (!user.has_hotel) {
      alert('Only verified hotel owners can create property listings. Please contact us to request hotel owner access.');
      return;
    }
    
    // Enhanced validation with better user feedback
    const validationErrors = [];
    
    if (!listing.name || listing.name.trim() === '') {
      validationErrors.push('Property name is required');
    }
    
    if (!listing.address || listing.address.trim() === '') {
      validationErrors.push('Property address is required');
    }
    
    if (!listing.rate || listing.rate <= 0) {
      validationErrors.push('Please enter a valid nightly rate (greater than 0)');
    }
    
    if (!listing.details || listing.details.trim() === '') {
      validationErrors.push('Property description is required');
    }
    
    if (!listing.propertyType) {
      validationErrors.push('Please select a property type');
    }
    
    if (!listing.guestAccess) {
      validationErrors.push('Please select guest access type');
    }
    
    if (images.length === 0) {
      validationErrors.push('Please upload at least one image');
    }
    
    // Check image sizes
    // Removed size validation - no limits
    
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare listing data with proper validation
      const listingData = {
        ...listing,
        rate: parseFloat(listing.rate),
        ownerId: user.id,
        // Ensure all required fields are properly formatted
        name: listing.name.trim(),
        address: listing.address.trim(),
        details: listing.details.trim(),
        totalRoom: parseInt(listing.totalRoom) || 1,
        maxAdults: parseInt(listing.maxAdults) || 1,
        maxChildren: parseInt(listing.maxChildren) || 0,
        maxInfants: parseInt(listing.maxInfants) || 0,
        maxPets: parseInt(listing.maxPets) || 0,
        maxInRoom: parseInt(listing.maxInRoom) || 2
      };
      
      console.log("Sending listing data:", listingData);
      
      // Retry logic for hotel creation
      let response;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          response = await axios.post(
            `${BACKEND}/api/v1/hotel/create-hotel`,
            listingData,
            { 
              headers: { 
                'Authorization': currentToken.startsWith('Bearer ') ? currentToken : `Bearer ${currentToken}`, 
                'Content-Type': 'application/json' 
              },
              timeout: 18000000 // Increased to 5 hours for hotel creation
            }
          );
          break; // Success, exit retry loop
        } catch (error) {
          retryCount++;
          console.error(`Attempt ${retryCount} failed:`, error);
          
          if (retryCount >= maxRetries) {
            throw error; // Re-throw if all retries failed
          }
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
        }
      }
      
      const hotelId = response.data.newHotel.id;
      
      // Upload images with progress tracking and retry logic
      const uploadResults = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        let uploadSuccess = false;
        let uploadRetryCount = 0;
        const maxUploadRetries = 3; // Increased retries
        
        while (!uploadSuccess && uploadRetryCount < maxUploadRetries) {
          try {
            const formData = new FormData();
            formData.append('images', image);
            
            const uploadResponse = await axios.post(
              `${BACKEND}/api/v1/hotel/hotel/${hotelId}/upload-images`,
              formData,
              { 
                headers: { 
                  'Authorization': currentToken.startsWith('Bearer ') ? currentToken : `Bearer ${currentToken}`, 
                  'Content-Type': 'multipart/form-data' 
                },
                timeout: 18000000 // Increased to 5 hours for large image uploads
              }
            );
            
            uploadResults.push({ success: true, imageIndex: i });
            uploadSuccess = true;
            
          } catch (imgErr) {
            uploadRetryCount++;
            console.error(`Image ${i + 1} upload attempt ${uploadRetryCount} failed:`, imgErr);
            
            if (uploadRetryCount >= maxUploadRetries) {
              uploadResults.push({ 
                success: false, 
                imageIndex: i, 
                error: imgErr.response?.data?.message || 'Upload failed' 
              });
              // Don't throw error, continue with other images
              break;
            }
            
            // Wait before retrying (longer wait for network issues)
            await new Promise(resolve => setTimeout(resolve, 5000 * uploadRetryCount));
          }
        }
      }
      
      // Check if all uploads were successful
      const failedUploads = uploadResults.filter(result => !result.success);
      if (failedUploads.length > 0) {
        const failedImageNumbers = failedUploads.map(f => f.imageIndex + 1).join(', ');
        alert(`Listing created successfully, but failed to upload images: ${failedImageNumbers}. You can edit the listing later to add images.`);
      } else {
        alert('Listing created successfully!');
      }
      
      nav('/');
      
    } catch (error) {
      console.error("Error creating listing:", error);
      
      let errorMessage = 'Failed to create listing. Please try again.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = data?.message || 'Invalid data provided. Please check your inputs.';
            break;
          case 401:
            errorMessage = 'Your session has expired. Please log in again.';
            // Redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            nav('/login');
            return;
          case 403:
            errorMessage = 'You do not have permission to create listings.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again in a few minutes.';
            break;
          default:
            errorMessage = data?.message || `Server error (${status}). Please try again.`;
        }
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection and try again. If the problem persists, try uploading smaller images or fewer images at once.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. This can happen with large images. Please try uploading smaller images or check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Basic Info", icon: FiHome, completed: !!(listing.name && listing.address && listing.rate) },
    { id: 2, title: "Description", icon: FiInfo, completed: !!listing.details },
    { id: 3, title: "Media", icon: FiImage, completed: images.length > 0 },
    { id: 4, title: "Details", icon: FiMapPin, completed: !!(listing.gmap && listing.totalRoom) }
  ];

  const renderStepIndicator = () => (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <div className="grid grid-cols-2 sm:flex sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-1 md:gap-2 lg:gap-4 mb-3 sm:mb-4 md:mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center justify-start sm:justify-center">
            <div className={`flex items-center justify-center w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 rounded-full border-2 transition-colors flex-shrink-0 ${
              step.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : activeStep === step.id 
                ? 'border-blue-500 text-blue-500' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {step.completed ? <FiCheckCircle size={12} className="sm:w-4 md:w-5 sm:h-4 md:h-5" /> : <step.icon size={12} className="sm:w-4 md:w-5 sm:h-4 md:h-5" />}
            </div>
            <span className={`ml-2 text-xs sm:text-sm font-medium truncate leading-tight min-w-0 ${
              step.completed ? 'text-green-600' : activeStep === step.id ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`hidden sm:block w-2 md:w-4 lg:w-8 h-0.5 mx-1 md:mx-2 flex-shrink-0 ${
                step.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-2 sm:px-3 md:px-4 lg:px-6 overflow-x-hidden relative" style={{ backgroundColor: '#f3eadb' }}>
              {/* Listing Access Option - Only for non-hotelers and non-admins */}
        {isLoggedIn && user && !user.has_hotel && !user.is_admin && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8">
            <div className="text-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-orange-800 mb-2">Want to List Your Property?</h2>
              <p className="text-sm text-orange-700 mb-4">
                You need listing access to create property listings. Request access and start earning from your property!
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-orange-600 mb-4">
                <span className="flex items-center gap-1">
                  <FiCheckCircle className="text-orange-500" size={14} />
                  Verified hotel owners only
                </span>
                <span className="flex items-center gap-1">
                  <FiCheckCircle className="text-orange-500" size={14} />
                  Earn from bookings
                </span>
                <span className="flex items-center gap-1">
                  <FiCheckCircle className="text-orange-500" size={14} />
                  Full listing management
                </span>
              </div>
            </div>

            {/* Listing Access Form */}
            {!listingAccessRequestSent ? (
              <div className="max-w-md mx-auto">
                <div className="mb-6 p-4 bg-white rounded-lg border border-orange-200">
                  <h3 className="font-medium mb-3 text-center text-gray-800">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500 text-center"
                        placeholder="Enter your phone number"
                        name="phone"
                        value={listingAccessForm.phone || ''}
                        onChange={handleListingAccessInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-1 text-blue-800 text-sm">What happens next?</h4>
                    <p className="text-xs text-blue-700">
                      Our team will contact you within 24 hours to guide you through the process.
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <button 
                    onClick={handleListingAccessSubmit}
                    disabled={!listingAccessForm.phone || isSubmittingAccess}
                    className={`px-6 py-3 text-white rounded-lg font-medium ${
                      listingAccessForm.phone && !isSubmittingAccess
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmittingAccess ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <p className="mt-3 text-xs text-orange-600">
                    By submitting, you agree to our Partner Terms and Conditions
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-600 font-medium mb-2">Request Submitted Successfully!</p>
                  <p className="text-green-700 text-sm">Our team will contact you within 24 hours to guide you through the listing process.</p>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 sm:mb-4 md:mb-6">
            <div className="mb-3 lg:mb-0 text-center lg:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Create Your Property Listing</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">Share your amazing property with travelers and start earning</p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <button 
                onClick={handleSubmitListing} 
                disabled={isSubmitting} 
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl transition hover:bg-blue-700 disabled:opacity-50 font-medium text-xs sm:text-sm md:text-base"
              >
                <FiSave className="text-sm sm:text-base" /> {isSubmitting ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </div>
          
          {renderStepIndicator()}
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 w-full">
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <FiHome className="text-blue-600" size={16} />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Basic Info</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                  {listing.name && listing.address && listing.rate ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                <FiInfo className="text-green-600" size={16} />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Description</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                  {listing.details ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <FiImage className="text-purple-600" size={16} />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Media</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                  {images.length > 0 ? `${images.length} images` : 'No images'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <FiMapPin className="text-orange-600" size={16} />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Details</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                  {listing.gmap && listing.totalRoom ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
          {/* Left Column - Main Forms */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
            {/* Basic Information Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6 text-center sm:text-left">
                <div className="p-1.5 sm:p-2 md:p-3 bg-blue-100 rounded-xl mx-auto sm:mx-0 sm:mr-3 md:mr-4 mb-2 sm:mb-0 flex-shrink-0">
                  <FiHome className="text-blue-600" size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Basic Information</h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Tell us about your property</p>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <DescriptionForm listing={listing} handleInputChange={handleInputChange} />
                <PropertyTypeSelector 
                  selectedType={listing.propertyType} 
                  onTypeSelect={handlePropertyTypeSelect}
                  editMode={true}
                />
                <GuestAccessSelector 
                  selectedAccess={listing.guestAccess} 
                  onAccessSelect={handleGuestAccessSelect}
                  editMode={true}
                />
              </div>
            </div>

            {/* Media Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6 text-center sm:text-left">
                <div className="p-1.5 sm:p-2 md:p-3 bg-purple-100 rounded-xl mx-auto sm:mx-0 sm:mr-3 md:mr-4 mb-2 sm:mb-0 flex-shrink-0">
                  <FiImage className="text-purple-600" size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Media & Visuals</h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Showcase your property with photos and videos</p>
                </div>
              </div>
              
              {/* Upload Limits Info */}
              <div className="bg-blue-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2 sm:mb-3">📋 Upload Limits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    <span className="text-blue-700">Max 100 images per hotel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    <span className="text-blue-700">Max 100 images per upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    <span className="text-blue-700">Max 1GB per image</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    <span className="text-blue-700">5-hour upload timeout</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 text-xs text-blue-600">
                  <strong>Current:</strong> {images.length}/100 images uploaded
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
                <ImageUploader 
                  images={images}
                  currentImageIndex={currentImageIndex}
                  handleImageUpload={handleImageUpload}
                  nextImage={nextImage}
                  prevImage={prevImage}
                  onRemoveImage={handleRemoveImage}
                  handleSetCurrentImage={handleSetCurrentImage}
                />
                <YouTubeVideoForm 
                  videoUrl={videoUrl} 
                  onVideoUrlChange={handleVideoUrlChange} 
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6 text-center sm:text-left">
                <div className="p-1.5 sm:p-2 md:p-3 bg-orange-100 rounded-xl mx-auto sm:mx-0 sm:mr-3 md:mr-4 mb-2 sm:mb-0 flex-shrink-0">
                  <FiMapPin className="text-orange-600" size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Property Details</h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Configure rooms, amenities, and location</p>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <RoomDetailsForm listing={listing} handleInputChange={handleInputChange} user={user || {}} />
                <AmenitiesForm listing={listing} handleAmenityChange={handleAmenityChange} />
                <LocationForm listing={listing} handleInputChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="xl:col-span-1 min-w-0">
            <div className="sticky top-4 space-y-3 sm:space-y-4 md:space-y-6">
              {/* Quick Preview */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Quick Preview</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Property Name:</span>
                    <span className="font-medium text-gray-800 truncate max-w-24 sm:max-w-32 ml-2 text-xs sm:text-sm">
                      {listing.name || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Price:</span>
                    <span className="font-medium text-gray-800 text-xs sm:text-sm">
                      {listing.rate ? `₹${listing.rate}/night` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Images:</span>
                    <span className="font-medium text-gray-800 text-xs sm:text-sm">
                      {images.length} uploaded
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Video:</span>
                    <span className="font-medium text-gray-800 text-xs sm:text-sm">
                      {videoUrl ? 'Added' : 'Not added'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Widget */}
              <BookingWidget 
                listing={listing}
                startDate={startDate}
                endDate={endDate}
                guestCount={guestCount}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setGuestCount={setGuestCount}
                calculateTotal={calculateTotal}
                handleInputChange={handleInputChange}
              />

              {/* Call Us Section */}
              <div className="bg-green-50 rounded-2xl p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2 sm:mb-3">📞 Need Help?</h3>
                <p className="text-xs sm:text-sm text-green-700 mb-3 sm:mb-4">
                  Don't want to add your listing yourself? Our team can help you create a professional listing.
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    <span>Professional photography</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    <span>Optimized descriptions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    <span>Competitive pricing</span>
                  </div>
                </div>
                <button
                  onClick={() => nav('/number-form')}
                  className="w-full mt-3 sm:mt-4 bg-green-600 text-white py-2 sm:py-3 rounded-xl font-medium hover:bg-green-700 transition-colors text-xs sm:text-sm"
                >
                  Call Us Now
                </button>
                <p className="text-xs text-green-600 mt-2 text-center">
                  Free consultation
                </p>
              </div>

              {/* Tips Section */}
              <div className="bg-blue-50 rounded-2xl p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-3">💡 Tips for Success</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-700">
                  <li>• Upload high-quality, well-lit photos</li>
                  <li>• Write detailed, honest descriptions</li>
                  <li>• Set competitive pricing</li>
                  <li>• Respond quickly to inquiries</li>
                  <li>• Keep your calendar updated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;