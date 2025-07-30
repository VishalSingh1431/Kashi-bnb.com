import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Import action icons for the main page
import { FiSave, FiX } from "react-icons/fi";

import DescriptionForm from "../components/listings/DescriptionForm";
import LocationForm from "../components/listings/LocationForm";
import RoomDetailsForm from "../components/listings/RoomDetailsForm";
import AmenitiesForm from "../components/listings/AmenitiesForm";
import BookingWidget from "../components/listings/BookingWidget";

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
  const [guestCount, setGuestCount] = useState(1);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [listing, setListing] = useState({
    name: 'Demo Hotel Name',
    address: '123 Main St, City, Country',
    rate: '2000',
    maxInRoom: 2,
    totalRoom: 1,
    details: 'This is a demo description for your listing. Add all the details about your property here. Describe the rooms, amenities, nearby attractions, and any special features that make your place unique.',
    gmap: 'https://maps.google.com/maps?q=India&output=embed',
    wifi: true,
    tv: true,
    kitchen: true,
    washingmachine: false,
    parking: true,
    ac: true,
    pool: false,
    fireextinguisher: true,
    firstaid: true,
    kit: true
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
    const files = Array.from(event.target.files);
    setImages(files);
  };
  
  const handleSubmitListing = async () => {
    if (!listing.name || !listing.address || !listing.rate || !listing.details) {
      alert('Please fill in all required fields');
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
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-40 px-4 sm:px-6 lg:px-8 " style={{ backgroundColor: '#f3eadb' }}>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold">Create New Listing</h1>
        <div className="flex gap-2">
          <button onClick={() => nav('/')} className="flex items-center gap-2 px-4 py-2 rounded-lg border transition hover:bg-black hover:text-white">
            <FiX /> Cancel
          </button>
          <button onClick={handleSubmitListing} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 border rounded-lg transition hover:bg-black hover:text-white">
            <FiSave /> {isSubmitting ? 'Saving...' : 'Save Listing'}
          </button>
        </div>
      </div>

      <DescriptionForm listing={listing} handleInputChange={handleInputChange} />

      <ImageUploader 
        images={images}
        currentImageIndex={currentImageIndex}
        handleImageUpload={handleImageUpload}
        nextImage={nextImage}
        prevImage={prevImage}
      />
     
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RoomDetailsForm listing={listing} handleInputChange={handleInputChange} user={user} />
          <AmenitiesForm listing={listing} handleAmenityChange={handleAmenityChange} />
          <LocationForm listing={listing} handleInputChange={handleInputChange} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
