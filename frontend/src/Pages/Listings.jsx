import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiChevronRight, 
  FiChevronLeft, 
  FiMapPin, 
  FiWifi, 
  FiSave, 
  FiX,
  FiUpload
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
import axios from 'axios';

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

const Listings = () => {
  const nav = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);
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

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return parseInt(listing.rate) * nights;
  };

  const getAmenities = () => {
    const amenities = [];
    
    if (listing.wifi) amenities.push({ name: "WiFi", icon: amenityIcons.wifi });
    if (listing.tv) amenities.push({ name: "TV", icon: amenityIcons.tv });
    if (listing.kitchen) amenities.push({ name: "Kitchen", icon: amenityIcons.kitchen });
    if (listing.washingmachine) amenities.push({ name: "Washing Machine", icon: amenityIcons.washingmachine });
    if (listing.parking) amenities.push({ name: "Parking", icon: amenityIcons.parking });
    if (listing.ac) amenities.push({ name: "Air Conditioning", icon: amenityIcons.ac });
    if (listing.pool) amenities.push({ name: "Pool", icon: amenityIcons.pool });
    if (listing.fireextinguisher) amenities.push({ name: "Fire Extinguisher", icon: amenityIcons.fireextinguisher });
    if (listing.firstaid) amenities.push({ name: "First Aid Kit", icon: amenityIcons.firstaid });
    if (listing.kit) amenities.push({ name: "Basic Kit", icon: amenityIcons.kit });

    return amenities;
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
      // First create the listing
      console.log(listing);
      const response = await axios.post(
        `${BACKEND}/api/v1/hotel/create-hotel`,
        listing,
        {
          headers: {
            'Authorization':token,
            'Content-Type': 'application/json'
          }
        } 
      );

      const hotelId = response.data.newHotel.id;

      setListing(response.data.newHotel);
      // Then upload images
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });

      await axios.post(
        `${BACKEND}/api/v1/hotel/hotel/${hotelId}/upload-images`,
        formData,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Listing created successfully!');
      nav('/'); // Redirect to home or listings page

    } catch (error) {
      console.error("Error creating listing:", error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-52 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold">Create New Listing</h1>
        <div className="flex gap-2">
          <button
            onClick={() => nav('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <FiX /> Cancel
          </button>
          <button
            onClick={handleSubmitListing}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            <FiSave /> {isSubmitting ? 'Saving...' : 'Save Listing'}
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          name="name"
          value={listing.name}
          onChange={handleInputChange}
          placeholder="Enter your hotel name"
          className="text-2xl font-bold mb-2 w-full p-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 italic">Example: 'Luxury Beachfront Villa'</p>
      </div>

      <div className="relative mb-8 rounded-xl overflow-hidden">
        <div className="aspect-[16/9] bg-gray-200 relative">
          {images.length ? (
            <>
              <img 
                src={URL.createObjectURL(images[currentImageIndex])} 
                alt={`Preview ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
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
                {images.length > 1 ? `${currentImageIndex + 1}/${images.length}` : '1/1'}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
              <FiUpload size={48} className="mb-4" />
              <span>No images uploaded yet</span>
            </div>
          )}
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
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
          <p className="text-xs text-gray-500 mt-1">Upload high-quality images of your property (minimum 3 recommended)</p>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div className="flex items-center w-full">
          <FiMapPin className="mr-1 flex-shrink-0" />
          <input
            type="text"
            name="address"
            value={listing.address}
            onChange={handleInputChange}
            placeholder="Enter full address"
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase() || 'H'}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold truncate capitalize">Hosted by {user?.name}</h2>
                <p className="text-gray-600 truncate">Contact: {user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="min-w-0">
                <p className="text-gray-500 truncate">Guests</p>
                <input
                  type="number"
                  name="maxInRoom"
                  value={listing.maxInRoom}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="min-w-0">
                <p className="text-gray-500 truncate">Rooms</p>
                <input
                  type="number"
                  name="totalRoom"
                  value={listing.totalRoom}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About this place</h2>
            <textarea
              name="details"
              value={listing.details}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg h-32"
              placeholder="Describe your property in detail..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Include details about rooms, amenities, nearby attractions, and any special features.
            </p>
          </div>

          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="wifi"
                  name="wifi"
                  checked={listing.wifi}
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
                  checked={listing.tv}
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
                  checked={listing.kitchen}
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
                  checked={listing.washingmachine}
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
                  checked={listing.parking}
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
                  checked={listing.ac}
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
                  checked={listing.pool}
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
                  checked={listing.fireextinguisher}
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
                  checked={listing.firstaid}
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
                  checked={listing.kit}
                  onChange={handleAmenityChange}
                  className="mr-2"
                />
                <label htmlFor="kit" className="flex items-center">
                  <FaFirstAid className="mr-2" /> Basic Kit
                </label>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Where you'll be</h2>
            <div className="h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden">
              <iframe 
                title="Hotel location"
                src={listing.gmap || "https://maps.google.com/maps?q=India&output=embed"}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen
                loading="lazy"
                className="rounded-xl"
              ></iframe>
            </div>
            <input
              type="text"
              name="gmap"
              value={listing.gmap}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Google Maps embed URL"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste the Google Maps embed URL for your property location
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 border rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xl font-semibold">
                  <input
                    type="number"
                    name="rate"
                    value={listing.rate}
                    onChange={handleInputChange}
                    className="w-24 p-2 border rounded-lg"
                    placeholder="0"
                  />
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
              <div className="mt-2">
                <label htmlFor="guests" className="text-xs font-semibold block mb-1">GUESTS</label>
                <select
                  id="guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {Array.from({ length: listing.maxInRoom || 2 }, (_, i) => i + 1).map((num) => (
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
              Preview Booking
            </button>
            
            <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-gray-600">
                  ₹{listing.rate} x {startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0} nights
                </p>
              </div>
              <div className="text-right">
                <p>₹{startDate && endDate ? parseInt(listing.rate) * Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0}</p>
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

export default Listings;