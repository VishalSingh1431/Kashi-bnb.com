import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND } from "../assets/Vars";
// import HotelHeader from "./HotelHeader";
import HotelImageGallery from "./HotelPage/HotelImageGallery";
import HotelLocation from "./HotelPage/HotelLocation";
import HotelAmenities from "./HotelPage/HotelAmenities";
import HotelBookingCard from "./HotelPage/HotelBookingCard";
import HotelDescription from "./HotelPage/HotelDescription";
import HotelHostInfo from "./HotelPage/HotelHostInfo";
import HotelHeader from "./HotelPage/HotelHeader";

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
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      setHotel(response.data.newHotel);
      setTempHotel(response.data.newHotel);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating hotel:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempHotel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setTempHotel(prev => ({
      ...prev,
      [name]: checked
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
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
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

      return {
        ...prev,
        [type]: newValue
      };
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
    return parseInt(hotel.rate) * nights;
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (!hotel) return <div className="text-center py-10 text-red-500">Hotel not found</div>;

  return (
    <div className="min-h-screen pt-40 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto p-4">
      <HotelHeader 
        isOwnerOrAdmin={isOwnerOrAdmin}
        editMode={editMode}
        handleEditToggle={handleEditToggle}
        handleCancelEdit={handleCancelEdit}
      />
      
      <div className="relative">
        {editMode ? (
          <input
            type="text"
            name="name"
            value={tempHotel.name}
            onChange={handleInputChange}
            className="text-2xl font-bold mb-2 w-full p-2 border rounded-lg"
          />
        ) : (
          <h1 className="text-2xl font-bold mb-2 capitalize">{hotel.name}</h1>
        )}
      </div>

      <HotelImageGallery 
        hotel={hotel}
        editMode={editMode}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        handleImageUpload={handleImageUpload}
      />

      <div className="flex items-center mb-4">
        <div className="flex items-center w-full">
          <FiMapPin className="mr-1 flex-shrink-0" />
          {editMode ? (
            <input
              type="text"
              name="address"
              value={tempHotel.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <span className="truncate">{hotel.address}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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
          
          <HotelAmenities 
            hotel={hotel}
            editMode={editMode}
            tempHotel={tempHotel}
            handleAmenityChange={handleAmenityChange}
          />
          
          <HotelLocation 
            hotel={hotel}
            editMode={editMode}
            tempHotel={tempHotel}
            handleInputChange={handleInputChange}
          />
        </div>

        <div className="lg:col-span-1">
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
  );
};

export default HotelPage;