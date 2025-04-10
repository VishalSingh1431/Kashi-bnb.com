import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiChevronRight, 
  FiChevronLeft, 
  FiMapPin, 
  FiHeart, 
  FiWifi, 
  FiEdit, 
  FiSave, 
  FiX,
  FiPlus,
  FiMinus
} from "react-icons/fi";
import { 
  FaTv,
  FaCar,
  FaSwimmingPool,
  FaFireExtinguisher,
  FaFirstAid,
  FaTemperatureLow
} from "react-icons/fa";
import { GiWashingMachine } from "react-icons/gi";
import { MdKitchen } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BACKEND } from "../assets/Vars";
const token=localStorage.getItem("token");
const user=JSON.parse(localStorage.getItem("user"));

const amenityIcons = {
  wifi: <FiWifi />,
  tv: <FaTv />,
  kitchen: <MdKitchen />,
  washingmachine: <GiWashingMachine />,
  parking: <FaCar />,
  ac: <FaTemperatureLow />,
  pool: <FaSwimmingPool />,
  fireextinguisher: <FaFireExtinguisher />,
  firstaid: <FaFirstAid />,
  kit: <FaFirstAid />,
};

const HotelPage = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
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
  const [tempAm, setTempAm] = useState([]);
  const [newImage, setNewImage] = useState(null);

  const isOwnerOrAdmin = user && (
    user.iaAdmin=== true || 
    (hotel && user.id === hotel.ownerId)
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
    const amenities = [];
    
    // Add all standard amenities
    if (hotel.wifi) amenities.push({ name: "WiFi", icon: amenityIcons.wifi });
    if (hotel.tv) amenities.push({ name: "TV", icon: amenityIcons.tv });
    if (hotel.kitchen) amenities.push({ name: "Kitchen", icon: amenityIcons.kitchen });
    if (hotel.washingmachine) amenities.push({ name: "Washing Machine", icon: amenityIcons.washingmachine });
    if (hotel.parking) amenities.push({ name: "Parking", icon: amenityIcons.parking });
    if (hotel.ac) amenities.push({ name: "Air Conditioning", icon: amenityIcons.ac });
    if (hotel.pool) amenities.push({ name: "Pool", icon: amenityIcons.pool });
    if (hotel.fireextinguisher) amenities.push({ name: "Fire Extinguisher", icon: amenityIcons.fireextinguisher });
    if (hotel.firstaid) amenities.push({ name: "First Aid Kit", icon: amenityIcons.firstaid });
    if (hotel.kit) amenities.push({ name: "Basic Kit", icon: amenityIcons.kit });

    return amenities;
  };

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
    setNewImage(null);
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
            // console.log();
            setEditMode(false);
            nav(`/hotel/${id}`);
            return;
          }

          console.log(changedHotel);

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
          console.log(response);
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
      [name] : checked
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
      
      // Validate against maximum limits from backend
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

      // Don't allow going below 0 or above max limit
      if (newValue < 0) return prev;
      if (newValue > maxLimit) return prev;
      
      // For adults, ensure at least 1 remains
      if (type === 'adults' && newValue < 1) return prev;

      return {
        ...prev,
        [type]: newValue
      };
    });
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (!hotel) return <div className="text-center py-10 text-red-500">Hotel not found</div>;

  return (
    <div className="min-h-screen pt-52 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto p-4 ">
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
                <p className="text-gray-500 truncate">Bedrooms</p>
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
                <p className="text-gray-500 truncate">Beds</p>
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
                <p className="text-gray-500 truncate">Bathrooms</p>
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

          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
            {editMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="wifi"
                    name="wifi"
                    checked={tempHotel.wifi || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="wifi" className="flex items-center">
                    <FiWifi className="mr-2" /> WiFi
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="tv"
                    name="tv"
                    checked={tempHotel.tv || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="tv" className="flex items-center">
                    <FaTv className="mr-2" /> TV
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="kitchen"
                    name="kitchen"
                    checked={tempHotel.kitchen || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="kitchen" className="flex items-center">
                    <MdKitchen className="mr-2" /> Kitchen
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="washingmachine"
                    name="washingmachine"
                    checked={tempHotel.washingmachine || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="washingmachine" className="flex items-center">
                    <GiWashingMachine className="mr-2" /> Washing Machine
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parking"
                    name="parking"
                    checked={tempHotel.parking || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="parking" className="flex items-center">
                    <FaCar className="mr-2" /> Parking
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ac"
                    name="ac"
                    checked={tempHotel.ac || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="ac" className="flex items-center">
                    <FaTemperatureLow className="mr-2" /> Air Conditioning
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pool"
                    name="pool"
                    checked={tempHotel.pool || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="pool" className="flex items-center">
                    <FaSwimmingPool className="mr-2" /> Pool
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fireextinguisher"
                    name="fireextinguisher"
                    checked={tempHotel.fireextinguisher || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="fireextinguisher" className="flex items-center">
                    <FaFireExtinguisher className="mr-2" /> Fire Extinguisher
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="firstaid"
                    name="firstaid"
                    checked={tempHotel.firstaid || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="firstaid" className="flex items-center">
                    <FaFirstAid className="mr-2" /> First Aid Kit
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="kit"
                    name="kit"
                    checked={tempHotel.kit || false}
                    onChange={handleAmenityChange}
                    className="mr-2"
                  />
                  <label htmlFor="kit" className="flex items-center">
                    <FaFirstAid className="mr-2" /> Basic Kit
                  </label>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getAmenities().map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-xl mr-3 flex-shrink-0">
                      {amenity.icon}
                    </span>
                    <span className="capitalize">{amenity.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              
              {/* Updated GUESTS Section */}
              <div className="mt-4 border rounded-lg p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">Adults</h3>
                      <p className="text-xs text-gray-500">Age 13+</p>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleGuestChange('adults', 'decrement')}
                        disabled={guestCount.adults <= 1}
                        className={`p-1 rounded-full ${guestCount.adults <= 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <FiMinus />
                      </button>
                      <span className="mx-2 w-6 text-center">{guestCount.adults}</span>
                      <button 
                        onClick={() => handleGuestChange('adults', 'increment')}
                        disabled={guestCount.adults >= (hotel.maxAdults || 16)}
                        className={`p-1 rounded-full ${guestCount.adults >= (hotel.maxAdults || 16) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">Children</h3>
                      <p className="text-xs text-gray-500">Ages 2–12</p>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleGuestChange('children', 'decrement')}
                        disabled={guestCount.children <= 0}
                        className={`p-1 rounded-full ${guestCount.children <= 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <FiMinus />
                      </button>
                      <span className="mx-2 w-6 text-center">{guestCount.children}</span>
                      <button 
                        onClick={() => handleGuestChange('children', 'increment')}
                        disabled={guestCount.children >= (hotel.maxChildren || 5)}
                        className={`p-1 rounded-full ${guestCount.children >= (hotel.maxChildren || 5) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">Infants</h3>
                      <p className="text-xs text-gray-500">Under 2</p>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleGuestChange('infants', 'decrement')}
                        disabled={guestCount.infants <= 0}
                        className={`p-1 rounded-full ${guestCount.infants <= 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <FiMinus />
                      </button>
                      <span className="mx-2 w-6 text-center">{guestCount.infants}</span>
                      <button 
                        onClick={() => handleGuestChange('infants', 'increment')}
                        disabled={guestCount.infants >= (hotel.maxInfants || 5)}
                        className={`p-1 rounded-full ${guestCount.infants >= (hotel.maxInfants || 5) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Pets</h3>
                      {/* <p className="text-xs text-gray-500">Bringing a service animal?</p> */}
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleGuestChange('pets', 'decrement')}
                        disabled={guestCount.pets <= 0}
                        className={`p-1 rounded-full ${guestCount.pets <= 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <FiMinus />
                      </button>
                      <span className="mx-2 w-6 text-center">{guestCount.pets}</span>
                      <button 
                        onClick={() => handleGuestChange('pets', 'increment')}
                        disabled={guestCount.pets >= (hotel.maxPets || 2)}
                        className={`p-1 rounded-full ${guestCount.pets >= (hotel.maxPets || 2) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                </div>
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