import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiChevronRight, FiChevronLeft, FiMapPin, FiHeart, FiWifi, FiEdit, FiSave, FiX } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BACKEND } from "../assets/Vars";
import axios from 'axios';
// import { useAuth } from "../context/AuthContext"; // Assuming you have an auth context
const user = {
  id: "22619b36-80a1-473a-b0f6-be5a6cc34ce6",
  email: "subrat.singh.cer21@itbhu.ac.in",
  name: "subrat",
  password: "$2b$10$o6ibWLXwzr2U/jMOptthmOagj2S8PP5Nd9VvtqhcIkZJfn5ZtE/PG",
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyNjE5YjM2LTgwYTEtNDczYS1iMGY2LWJlNWE2Y2MzNGNlNiIsImVtYWlsIjoic3VicmF0LnNpbmdoLmNlcjIxQGl0Ymh1LmFjLmluIiwibmFtZSI6InN1YnJhdCIsInBhc3N3b3JkIjoiJDJiJDEwJG82aWJXTFh3enIyVS9qTU9wdHRobU9hZ2oyUzhQUDVOZDlWdnRxaGNJa1pKZm41WnRFL1BHIiwidG9rZW4iOm51bGwsInRpbWUiOiIyMDI1LTAzLTI3VDA4OjM3OjQwLjc5NVoiLCJoYXNfaG90ZWwiOnRydWUsImhhc19yZXN0ciI6ZmFsc2UsImlzX2FkbWluIjpmYWxzZSwidmVyaWZpZWQiOnRydWUsImlhdCI6MTc0MzM1NTQ1MH0.by0RU3jAKKLryUYMiy7tQSCi_w4oro6K6tdZjyjGDL0',
  time: new Date("2025-03-27T08:37:40.795Z"),
  hasHotel: true,
  hasRestr: false,
  isAdmin: false,
  verified: true
};


const HotelPage = () => {
  const { id } = useParams();
  // const { user } = useAuth(); // Get current user from auth context
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [tempHotel, setTempHotel] = useState(null);
  const [newImage, setNewImage] = useState(null);

  // Check if current user is owner or admin
  const isOwnerOrAdmin = user && (
    user.role === "admin" || 
    (hotel && user.id === hotel.ownerId)
  );

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/v1/hotel/hotel/${id}`);
        const data = await response.json();
        console.log(data);
        setHotel(data);
        setTempHotel(data);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  const nextImage = () => {
    if (hotel?.images?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.length);
    }
  };

  const prevImage = () => {
    if (hotel?.images?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hotel.images.length) % hotel.images.length);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return parseInt(hotel.rate) * nights;
  };

  const getAmenities = () => {
    const amenities = new Set();
    if (hotel.s1) amenities.add(hotel.s1);
    if (hotel.s2) amenities.add(hotel.s2);
    if (hotel.s3) amenities.add(hotel.s3);
    if (hotel.s4) amenities.add(hotel.s4);
    return Array.from(amenities);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      handleSaveChanges();
    } else {
      // Enter edit mode
      setEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setTempHotel(hotel);
    setNewImage(null);
  };

  const handleSaveChanges = async () => {
    try {
        const changedHotel = {};

        // Check for changes in text fields
        Object.keys(tempHotel).forEach(key => {
            if (tempHotel[key] !== hotel[key]) {
                changedHotel[key] = tempHotel[key];
            }
        });

        // If there are no changes, return early
        if (Object.keys(changedHotel).length === 0) {
            console.log("No changes detected.");
            setEditMode(false);
            return;
        }

        const response = await axios.post(
            `${BACKEND}/api/v1/hotel/hotel/${id}/update-hotel`, 
            changedHotel,
            {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        setHotel(response.data);
        setTempHotel(response.data);
        setEditMode(false);
    } catch (error) {
        console.error("Error updating hotel:", error);
    }
};


  const handleInputChange = (e) => {
    console.log(tempHotel);
    const { name, value } = e.target;
    setTempHotel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (index, value) => {
    const field = `s${index + 1}`;
    setTempHotel(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleImageUpload = async (event) => {
    const files = event.target.files; // FileList
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

  // const handleImageUpload = (e) => {
  //   console.log(e.target.files);

  //   setNewImage(e.target.files);
  // };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (!hotel) return <div className="text-center py-10 text-red-500">Hotel not found</div>;

  return (
    <div className="min-h-screen pt-52 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto p-4 ">
      {/* Edit/Save Button for Owner/Admin */}
      {isOwnerOrAdmin && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {editMode ? (
              <>
                <FiSave /> Save Changes
              </>
            ) : (
              <>
                <FiEdit /> Edit Hotel
              </>
            )}
          </button>
          {editMode && (
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-2 px-4 py-2 ml-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      )}

      {/* Hotel Name */}
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

      {/* Image Gallery */}
      <div className="relative mb-8 rounded-xl overflow-hidden">
        <div className="aspect-[16/9] bg-gray-200 relative">
          {editMode && newImage ? (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={URL.createObjectURL(newImage)} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : hotel.images?.length ? (
            <>
              <img 
                src={hotel.images[currentImageIndex]?.url} 
                alt={hotel.images[currentImageIndex]?.name || hotel.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button 
                  onClick={prevImage}
                  className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition transform"
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage}
                  className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition transform"
                  aria-label="Next image"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
              <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
                {hotel.images.length > 1 ? `${currentImageIndex + 1}/${hotel.images.length}` : '1/1'}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-500">No images available</span>
            </div>
          )}
        </div>
        {editMode && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
        )}
      </div>

      {/* Location */}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Property Details */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {hotel.owner?.name?.charAt(0).toUpperCase() || 'H'}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold truncate capitalize">Hosted by {hotel.owner?.name}</h2>
                <p className="text-gray-600 truncate">Contact: {hotel.owner?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="min-w-0">
                <p className="text-gray-500 truncate">Guests</p>
                {editMode ? (
                  <input
                    type="number"
                    name="maxInRoom"
                    value={tempHotel.maxInRoom}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                ) : (
                  <p className="font-medium truncate">{hotel.maxInRoom || 'N/A'}</p>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-gray-500 truncate">Rooms</p>
                {editMode ? (
                  <input
                    type="number"
                    name="totalRoom"
                    value={tempHotel.totalRoom}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                ) : (
                  <p className="font-medium truncate">{hotel.totalRoom || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About this place</h2>
            <div className="relative">
              {editMode ? (
                <textarea
                  name="details"
                  value={tempHotel.details}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg h-32"
                  placeholder="Enter description..."
                />
              ) : (
                <>
                  <div className={`text-gray-700 ${!showFullDescription ? 'max-h-24 overflow-hidden' : ''}`}>
                    <p>{hotel.details || 'No description provided.'}</p>
                  </div>
                  {hotel.details && hotel.details.length > 150 && !showFullDescription && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                  )}
                </>
              )}
            </div>
            {!editMode && hotel.details && hotel.details.length > 150 && (
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-2 font-semibold underline focus:outline-none focus:ring-2 focus:ring-rose-500 rounded"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Amenities */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
            {editMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center min-w-0">
                    <span className="text-xl mr-3 flex-shrink-0">
                      <FiWifi />
                    </span>
                    <input
                      type="text"
                      value={tempHotel[`s${index + 1}`] || ''}
                      onChange={(e) => handleAmenityChange(index, e.target.value)}
                      className="w-full p-2 border rounded-lg capitalize"
                      placeholder={`Amenity ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getAmenities().map((amenity, index) => (
                  <div key={index} className="flex items-center min-w-0">
                    <span className="text-xl mr-3 flex-shrink-0">
                      {amenity.toLowerCase().includes('wifi') && <FiWifi />}
                    </span>
                    <span className="truncate capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Where you'll be</h2>
            <div className="h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden">
              <iframe 
                title="Hotel location"
                src={hotel.gmap || "https://maps.google.com/maps?q=India&output=embed"}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen
                loading="lazy"
                className="rounded-xl"
              ></iframe>
            </div>
            {editMode ? (
              <input
                type="text"
                name="gmap"
                value={tempHotel.gmap}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Google Maps embed URL"
              />
            ) : (
              <p className="text-gray-700">{hotel.address}</p>
            )}
          </div>
        </div>

        {/* Right Column - Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 border rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xl font-semibold">
                  {editMode ? (
                    <input
                      type="number"
                      name="rate"
                      value={tempHotel.rate}
                      onChange={handleInputChange}
                      className="w-24 p-2 border rounded-lg"
                    />
                  ) : (
                    `₹${hotel.rate}`
                  )} 
                  <span className="text-base font-normal"> night</span>
                </p>
              </div>
            </div>
            
            {/* Calendar for Check-in/Check-out */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="checkin" className="text-xs font-semibold block mb-1">CHECK-IN</label>
                  <DatePicker
                    id="checkin"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Add date"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    popperPlacement="auto"
                  />
                </div>
                <div>
                  <label htmlFor="checkout" className="text-xs font-semibold block mb-1">CHECKOUT</label>
                  <DatePicker
                    id="checkout"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Add date"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    popperPlacement="auto"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label htmlFor="guests" className="text-xs font-semibold block mb-1">GUESTS</label>
                <select
                  id="guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {Array.from({ length: hotel.maxInRoom || 2 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              disabled={!startDate || !endDate}
            >
              Reserve
            </button>
            
            <p className="text-center mt-4 text-sm text-gray-600">You won't be charged yet</p>
            
            <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-gray-600">
                  ₹{hotel.rate} x {startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0} nights
                </p>
              </div>
              <div className="text-right">
                <p>₹{startDate && endDate ? parseInt(hotel.rate) * Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0}</p>
              </div>
              <div className="col-span-2 border-t mt-2 pt-4">
                <div className="flex justify-between font-semibold">
                  <p>Total</p>
                  <p>₹{calculateTotal()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPage;