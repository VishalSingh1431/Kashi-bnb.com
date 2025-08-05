import React, { useState } from "react";
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
import { BACKEND } from "../assets/Vars";
import ImageUploader from "../Components/Listings/ImageUploader";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const Listings = () => {
  const nav = useNavigate();
  
  // No authentication check on mount - users can view the page without logging in
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


  
  const handleSubmitListing = async () => {
    // Check if user is authenticated
    if (!token || !user) {
      alert('Please log in to create a listing. You will be redirected to the login page.');
      nav('/login');
      return;
    }
    
    // Validate required fields
    if (!listing.name || listing.name.trim() === '') {
      alert('Please enter the property name');
      return;
    }
    
    if (!listing.address || listing.address.trim() === '') {
      alert('Please enter the property address');
      return;
    }
    
    if (!listing.rate || listing.rate <= 0) {
      alert('Please enter a valid nightly rate');
      return;
    }
    
    if (!listing.details || listing.details.trim() === '') {
      alert('Please enter the property description');
      return;
    }
    
    if (!listing.propertyType) {
      alert('Please select a property type');
      return;
    }
    
    if (!listing.guestAccess) {
      alert('Please select guest access type');
      return;
    }
    
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${BACKEND}/api/v1/hotel/create-hotel`,
        listing,
        { headers: { 'Authorization': token, 'Content-Type': 'application/json' } }
      );
      const hotelId = response.data.newHotel.id;
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });
      await axios.post(
        `${BACKEND}/api/v1/hotel/hotel/${hotelId}/upload-images`,
        formData,
        { headers: { 'Authorization': token, 'Content-Type': 'multipart/form-data' } }
      );
      alert('Listing created successfully!');
      nav('/');
    } catch (error) {
      console.error("Error creating listing:", error);
      
      // Handle specific backend validation errors
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        alert(message || 'Failed to create listing. Please try again.');
      } else if (error.code === 'ERR_NETWORK') {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Failed to create listing. Please try again.');
      }
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
            <span className={`ml-2 text-xs sm:text-sm font-medium truncate ${
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
    <div className="min-h-screen pt-28 sm:pt-32 md:pt-36 lg:pt-40 xl:pt-44 2xl:pt-48 px-2 sm:px-3 md:px-4 lg:px-6 overflow-x-hidden" style={{ backgroundColor: '#f3eadb' }}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 sm:mb-4 md:mb-6">
            <div className="mb-3 lg:mb-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Create Your Property Listing</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">Share your amazing property with travelers and start earning</p>
            </div>
            <div className="flex justify-end">
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
              <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6">
                <div className="p-1.5 sm:p-2 md:p-3 bg-blue-100 rounded-xl mr-0 sm:mr-3 md:mr-4 mb-2 sm:mb-0 flex-shrink-0">
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
              <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6">
                <div className="p-1.5 sm:p-2 md:p-3 bg-purple-100 rounded-xl mr-0 sm:mr-3 md:mr-4 mb-2 sm:mb-0 flex-shrink-0">
                  <FiImage className="text-purple-600" size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Media & Visuals</h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Showcase your property with photos and videos</p>
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
              <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6">
                <div className="p-1.5 sm:p-2 md:p-3 bg-orange-100 rounded-xl mr-0 sm:mr-3 md:mr-4 mb-2 sm:mb-0 flex-shrink-0">
                  <FiMapPin className="text-orange-600" size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Property Details</h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Configure rooms, amenities, and location</p>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <RoomDetailsForm listing={listing} handleInputChange={handleInputChange} user={user} />
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