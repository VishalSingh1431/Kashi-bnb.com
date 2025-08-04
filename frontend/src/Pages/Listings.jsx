import { useState } from "react";
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
// Keep constants and localStorage access in the parent
import { BACKEND } from "../assets/Vars";
import ImageUploader from "../Components/Listings/ImageUploader";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const Listings = () => {
  const nav = useNavigate();
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
    kit: false
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
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4 mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
              step.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : activeStep === step.id 
                ? 'border-blue-500 text-blue-500' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {step.completed ? <FiCheckCircle size={20} /> : <step.icon size={20} />}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              step.completed ? 'text-green-600' : activeStep === step.id ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${
                step.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-40 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f3eadb' }}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Property Listing</h1>
              <p className="text-gray-600">Share your amazing property with travelers and start earning</p>
            </div>
            <div className="flex gap-3 mt-4 lg:mt-0">
              <button 
                onClick={() => nav('/')} 
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 transition hover:bg-gray-50 font-medium"
              >
                <FiX /> Cancel
              </button> 
              <button 
                onClick={handleSubmitListing} 
                disabled={isSubmitting} 
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl transition hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                <FiSave /> {isSubmitting ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </div>
          
          {renderStepIndicator()}
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiHome className="text-blue-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Basic Info</p>
                <p className="font-semibold text-gray-800">
                  {listing.name && listing.address && listing.rate ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiInfo className="text-green-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-semibold text-gray-800">
                  {listing.details ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiImage className="text-purple-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Media</p>
                <p className="font-semibold text-gray-800">
                  {images.length > 0 ? `${images.length} images` : 'No images'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiMapPin className="text-orange-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Details</p>
                <p className="font-semibold text-gray-800">
                  {listing.gmap && listing.totalRoom ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Main Forms */}
          <div className="xl:col-span-3 space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-xl mr-4">
                  <FiHome className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
                  <p className="text-gray-600">Tell us about your property</p>
                </div>
              </div>
              <DescriptionForm listing={listing} handleInputChange={handleInputChange} />
            </div>

            {/* Media Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 rounded-xl mr-4">
                  <FiImage className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Media & Visuals</h2>
                  <p className="text-gray-600">Showcase your property with photos and videos</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-orange-100 rounded-xl mr-4">
                  <FiMapPin className="text-orange-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
                  <p className="text-gray-600">Configure rooms, amenities, and location</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <RoomDetailsForm listing={listing} handleInputChange={handleInputChange} user={user} />
                <AmenitiesForm listing={listing} handleAmenityChange={handleAmenityChange} />
                <LocationForm listing={listing} handleInputChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="xl:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Quick Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Preview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Property Name:</span>
                    <span className="font-medium text-gray-800 truncate max-w-32">
                      {listing.name || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-gray-800">
                      {listing.rate ? `₹${listing.rate}/night` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Images:</span>
                    <span className="font-medium text-gray-800">
                      {images.length} uploaded
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Video:</span>
                    <span className="font-medium text-gray-800">
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
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">📞 Need Help?</h3>
                <p className="text-sm text-green-700 mb-4">
                  Don't want to add your listing yourself? Our team can help you create a professional listing.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Professional photography</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Optimized descriptions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Competitive pricing</span>
                  </div>
                </div>
                <button
                  onClick={() => nav('/number-form')}
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Call Us Now
                </button>
                <p className="text-xs text-green-600 mt-2 text-center">
                  Free consultation
                </p>
              </div>

              {/* Tips Section */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Tips for Success</h3>
                <ul className="space-y-2 text-sm text-blue-700">
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