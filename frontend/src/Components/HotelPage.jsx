import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND, getAuthHeader } from "../assets/Vars";
// import HotelHeader from "./HotelHeader";
import HotelImageGallery from "./HotelPage/HotelImageGallery";
import HotelLocation from "./HotelPage/HotelLocation";
import HotelAmenities from "./HotelPage/HotelAmenities";
import HotelBookingCard from "./HotelPage/HotelBookingCard";
import HotelDescription from "./HotelPage/HotelDescription";
import HotelHostInfo from "./HotelPage/HotelHostInfo";
import HotelHeader from "./HotelPage/HotelHeader";
import HotelVideoSection from "./HotelPage/HotelVideoSection";
import HotelMapSection from "./HotelPage/HotelMapSection";
import HotelStaffSection from "./HotelPage/HotelStaffSection";
import PropertyTypeSelector from "./Listings/PropertyTypeSelector";
import GuestAccessSelector from "./Listings/GuestAccessSelector";
import HotelReviews from "./HotelPage/HotelReviews";
import { FiMapPin } from "react-icons/fi";
import { saveBookingData, getBookingData, parseStoredDates, saveBookingPreferences } from '../utils/bookingStorage';

// GST calculation utility
const calculateGST = (roomRate, taxableAmount) => {
  const rate = parseInt(roomRate);
  if (rate < 1000) {
    return { gstRate: 0, gstAmount: 0 };
  } else if (rate >= 1001 && rate <= 7499) {
    return { gstRate: 12, gstAmount: Math.round(taxableAmount * 0.12) };
  } else {
    return { gstRate: 18, gstAmount: Math.round(taxableAmount * 0.18) };
  }
};


const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const HotelPage = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guestCount, setGuestCount] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0
  });
  const [editMode, setEditMode] = useState(false);
  const [tempHotel, setTempHotel] = useState(null);

  const isOwnerOrAdmin = (
    (user?.isAdmin === true) || 
    ((user?.id === hotel?.ownerId))
  );

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/api/v1/hotel/hotel/${id}`);
        setHotel(response.data);
        setTempHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHotelData();
  }, [id]);

  // Load stored booking data when component mounts
  useEffect(() => {
    if (!id) return;
    
    const storedData = getBookingData(id);
    if (storedData) {
      const parsedData = parseStoredDates(storedData);
      
      if (parsedData.startDate) setStartDate(parsedData.startDate);
      if (parsedData.endDate) setEndDate(parsedData.endDate);
      if (parsedData.guestCount) setGuestCount(parsedData.guestCount);
    }
  }, [id]);

  // Save booking data whenever dates or guest count changes
  useEffect(() => {
    if (!id || !hotel) return;
    
    // Only save if we have meaningful data
    if (startDate || endDate || guestCount.adults > 1 || guestCount.children > 0 || guestCount.infants > 0 || guestCount.pets > 0) {
      const bookingData = {
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        guestCount,
        hotelName: hotel.name,
        hotelRate: hotel.rate
      };
      
      saveBookingData(id, bookingData);
    }
  }, [id, startDate, endDate, guestCount, hotel]);

  const handleEditToggle = () => {
    if (editMode) {
      handleSaveChanges();
    } else {
      setEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setTempHotel(hotel);
  };

  const handleSaveChanges = async () => {
    try {
      const changedHotel = {};

      Object.keys(tempHotel).forEach(key => {
        if (tempHotel[key] !== hotel[key]) {
          changedHotel[key] = tempHotel[key];
        }
      });

      if (Object.keys(changedHotel).length === 0) {
        console.log("No changes detected.");
        setEditMode(false);
        nav(`/hotel/${id}`);
        return;
      }

      const response = await axios.post(
        `${BACKEND}/api/v1/hotel/hotel/${id}/update-hotel`, 
        changedHotel,
        {
          headers: {
            'Authorization': getAuthHeader(token),
            'Content-Type': 'application/json'
          }
        }
      );
      setHotel(response.data.newHotel);
      setTempHotel(response.data.newHotel);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating hotel:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      // Show user-friendly error message
      alert("Failed to update hotel. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to integers
    const numericFields = ['totalRoom', 'maxInRoom', 'maxAdults', 'maxChildren', 'maxInfants', 'maxPets', 'rate'];
    
    setTempHotel(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Math.max(0, parseInt(value) || 0) : value
    }));
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setTempHotel(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePropertyTypeSelect = (type) => {
    setTempHotel(prev => ({
      ...prev,
      propertyType: type
    }));
  };

  const handleGuestAccessSelect = (access) => {
    setTempHotel(prev => ({
      ...prev,
      guestAccess: access
    }));
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
  
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
  
    try {
      const response = await axios.post(`${BACKEND}/api/v1/hotel/hotel/${id}/upload-images`, formData, {
        headers: {
          "Authorization": getAuthHeader(token),
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", response.data);
      // Refresh hotel data to show new images
      fetchHotel();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleStaffImageUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
  
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
  
    try {
      const response = await axios.post(`${BACKEND}/api/v1/hotel/hotel/${id}/upload-staff-images`, formData, {
        headers: {
          "Authorization": getAuthHeader(token),
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Staff images upload response:", response.data);
      // Refresh hotel data to show new staff images
      fetchHotel();
    } catch (error) {
      console.error("Error uploading staff images:", error);
    }
  };

  const handleDeleteStaffImage = async (imageId) => {
    try {
      const response = await axios.delete(`${BACKEND}/api/v1/hotel/hotel/${id}/staff-image/${imageId}`, {
        headers: {
          "Authorization": getAuthHeader(token),
        },
      });
      console.log("Staff image deleted:", response.data);
      // Refresh hotel data to show updated staff images
      fetchHotel();
    } catch (error) {
      console.error("Error deleting staff image:", error);
    }
  };

  const handleGuestChange = (type, operation) => {
    setGuestCount(prev => {
      const newValue = operation === 'increment' ? prev[type] + 1 : prev[type] - 1;
      
      let maxLimit;
      switch(type) {
        case 'adults':
          maxLimit = hotel.maxAdults || 16;
          break;
        case 'children':
          maxLimit = hotel.maxChildren || 5;
          break;
        case 'infants':
          maxLimit = hotel.maxInfants || 5;
          break;
        case 'pets':
          maxLimit = hotel.maxPets || 2;
          break;
        default:
          maxLimit = 10;
      }

      if (newValue < 0) return prev;
      if (newValue > maxLimit) return prev;
      if (type === 'adults' && newValue < 1) return prev;

      const updatedGuestCount = {
        ...prev,
        [type]: newValue
      };

      // Save guest preferences for future use
      saveBookingPreferences({ guestCount: updatedGuestCount });

      return updatedGuestCount;
    });
  };

  const handleReserve = () => {
    nav(`/checkout/${hotel.id}`, {
      state: {
        startDate,
        endDate,
        guests: guestCount,
        total: calculateTotal(),
        hotelName: hotel.name,
      },
    });
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const basePrice = parseInt(hotel.rate) * nights;
    const petCharges = (guestCount.pets || 0) * 300 * nights;
    const taxableAmount = basePrice + petCharges;
    const { gstAmount } = calculateGST(hotel.rate, taxableAmount);
    return taxableAmount + gstAmount;
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (!hotel) return <div className="text-center py-10 text-red-500">Hotel not found</div>;

  return (
    <div className="min-h-screen px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 max-w-7xl mx-auto">
      <HotelHeader 
        isOwnerOrAdmin={isOwnerOrAdmin}
        editMode={editMode}
        handleEditToggle={handleEditToggle}
        handleCancelEdit={handleCancelEdit}
      />
      
      <div className="relative mb-3 sm:mb-4 md:mb-6">
        {editMode ? (
          <input
            type="text"
            name="name"
            value={tempHotel.name}
            onChange={handleInputChange}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 w-full p-2 sm:p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 capitalize text-gray-800 break-words">{hotel.name}</h1>
        )}
      </div>

      <HotelImageGallery 
        hotel={hotel}
        editMode={editMode}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        handleImageUpload={handleImageUpload}
      />

      <HotelVideoSection
        hotel={hotel}
        editMode={editMode}
        tempHotel={tempHotel}
        handleInputChange={handleInputChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-4 sm:mt-6 md:mt-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
          <HotelHostInfo 
            hotel={hotel}
            editMode={editMode}
            tempHotel={tempHotel}
            handleInputChange={handleInputChange}
          />
          
          <HotelDescription 
            hotel={hotel}
            editMode={editMode}
            tempHotel={tempHotel}
            handleInputChange={handleInputChange}
          />
          
          <PropertyTypeSelector 
            selectedType={editMode ? tempHotel.propertyType : hotel.propertyType}
            onTypeSelect={handlePropertyTypeSelect}
            editMode={editMode}
          />
          
          <GuestAccessSelector 
            selectedAccess={editMode ? tempHotel.guestAccess : hotel.guestAccess}
            onAccessSelect={handleGuestAccessSelect}
            editMode={editMode}
          />
          
          <HotelAmenities 
            hotel={hotel}
            editMode={editMode}
            tempHotel={tempHotel}
            handleAmenityChange={handleAmenityChange}
          />
          
          <HotelMapSection
            hotel={hotel}
            editMode={editMode}
            tempHotel={tempHotel}
            handleInputChange={handleInputChange}
          />
          
          <HotelStaffSection
            hotel={hotel}
            editMode={editMode}
            handleStaffImageUpload={handleStaffImageUpload}
            handleDeleteStaffImage={handleDeleteStaffImage}
          />
          
          <HotelReviews
            hotelId={hotel.id}
            isOwnerOrAdmin={isOwnerOrAdmin}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 sm:top-10 md:top-12 lg:top-14 xl:top-16">
            <HotelBookingCard 
              hotel={hotel}
              editMode={editMode}
              tempHotel={tempHotel}
              handleInputChange={handleInputChange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              guestCount={guestCount}
              handleGuestChange={handleGuestChange}
              handleReserve={handleReserve}
              calculateTotal={calculateTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPage;