import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Wifi, Tv, Coffee, Star } from "lucide-react";
import { BACKEND } from "../assets/Vars";

const HotelPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/v1/hotel/hotel/${id}`);
        const data = await response.json();
        console.log(data);
        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (!hotel) return <div className="text-center py-10 text-red-500">Hotel not found</div>;

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen pt-52 px-4 sm:px-6 lg:px-8 ">
      {/* Hero Section */}
      <motion.div
        className="relative w-full max-w-6xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src={hotel.images[0]?.url}
          alt={hotel.name}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center px-4">
            {hotel.name}
          </h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <motion.div
          className="lg:col-span-2 space-y-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Address & Embedded Google Map */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-500" />
              {hotel.address}
            </p>
            <div className="mt-4">
              <iframe
                src={hotel.gmap}
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hotel?.amenities?.map((amenity, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <Wifi className="h-5 w-5 text-indigo-500" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          className="lg:col-span-1 space-y-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
        >
          {/* Rate & Owner */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Details</h2>
            <p className="text-gray-700">
              <strong>Rate:</strong> ₹{hotel.rate} per night
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Owner:</strong> {hotel.owner.name}
            </p>
            <p className="text-gray-700">
              <strong>Contact:</strong>{" "}
              <a href={`mailto:${hotel.owner.email}`} className="text-indigo-600 hover:underline">
                {hotel.owner.email}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HotelPage;














// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FiChevronRight, FiChevronLeft, FiMapPin, FiHeart } from "react-icons/fi";
// import { FaWifi, FaParking, FaSwimmingPool, FaHotTub } from "react-icons/fa";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { BACKEND } from "../assets/Vars";

// const HotelPage = () => {
//   const { id } = useParams();
//   const [hotel, setHotel] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showFullDescription, setShowFullDescription] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [guestCount, setGuestCount] = useState(1);

//   useEffect(() => {
//     const fetchHotelData = async () => {
//       try {
//         const response = await fetch(`${BACKEND}/api/v1/hotel/hotel/${id}`);
//         const data = await response.json();
//         setHotel(data);
//       } catch (error) {
//         console.error("Error fetching hotel data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHotelData();
//   }, [id]);

//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hotel.images.length) % hotel.images.length);
//   };

//   const calculateTotal = () => {
//     if (!startDate || !endDate) return 0;
//     const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
//     return hotel.rate * nights + (hotel.cleaningFee || 150) + (hotel.serviceFee || 240);
//   };

//   if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
//   if (!hotel) return <div className="text-center py-10 text-red-500">Hotel not found</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-4 pt-32">
//       {/* Hotel Name */}
//       <h1 className="text-2xl font-bold mb-2">{hotel.name}</h1>

//       {/* Image Gallery */}
//       <div className="relative mb-8 rounded-xl overflow-hidden">
//         <div className="aspect-[16/9] bg-gray-200 relative">
//           <img 
//             src={hotel.images[currentImageIndex]?.url} 
//             alt={hotel.name} 
//             className="w-full h-full object-cover"
//             loading="lazy"
//           />
//           <div className="absolute inset-0 flex items-center justify-between px-4">
//             <button 
//               onClick={prevImage}
//               className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition transform"
//               aria-label="Previous image"
//             >
//               <FiChevronLeft size={20} />
//             </button>
//             <button 
//               onClick={nextImage}
//               className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition transform"
//               aria-label="Next image"
//             >
//               <FiChevronRight size={20} />
//             </button>
//           </div>
//           <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
//             {currentImageIndex + 1}/{hotel.images.length}
//           </div>
//         </div>
//       </div>

//       {/* Location */}
//       <div className="flex items-center mb-4">
//         <div className="flex items-center">
//           <FiMapPin className="mr-1 flex-shrink-0" />
//           <span className="truncate">{hotel.address}</span>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column */}
//         <div className="lg:col-span-2">
//           {/* Property Details */}
//           <div className="border-b pb-6 mb-6">
//             <div className="flex items-center mb-4">
//               <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0 overflow-hidden">
//                 {hotel.owner?.profileImage && (
//                   <img 
//                     src={hotel.owner.profileImage} 
//                     alt={hotel.owner.name} 
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//               <div className="min-w-0">
//                 <h2 className="font-semibold truncate">Hosted by {hotel.owner?.name}</h2>
//                 <p className="text-gray-600 truncate">{hotel.owner?.hostingSince || '10 years hosting'}</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//               <div className="min-w-0">
//                 <p className="text-gray-500 truncate">Guests</p>
//                 <p className="font-medium truncate">{hotel.capacity?.guests || 'N/A'}</p>
//               </div>
//               <div className="min-w-0">
//                 <p className="text-gray-500 truncate">Bedrooms</p>
//                 <p className="font-medium truncate">{hotel.capacity?.bedrooms || 'N/A'}</p>
//               </div>
//               <div className="min-w-0">
//                 <p className="text-gray-500 truncate">Beds</p>
//                 <p className="font-medium truncate">{hotel.capacity?.beds || 'N/A'}</p>
//               </div>
//               <div className="min-w-0">
//                 <p className="text-gray-500 truncate">Bathrooms</p>
//                 <p className="font-medium truncate">{hotel.capacity?.bathrooms || 'N/A'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold mb-4">About this place</h2>
//             <div className="relative">
//               <div className={`text-gray-700 ${!showFullDescription ? 'max-h-24 overflow-hidden' : ''}`}>
//                 <p>{hotel.description}</p>
//                 {showFullDescription && hotel.additionalDescription && (
//                   <div className="mt-4">
//                     <p>{hotel.additionalDescription}</p>
//                   </div>
//                 )}
//               </div>
//               {!showFullDescription && (
//                 <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
//               )}
//             </div>
//             {(hotel.additionalDescription || hotel.description.length > 300) && (
//               <button 
//                 onClick={() => setShowFullDescription(!showFullDescription)}
//                 className="mt-2 font-semibold underline focus:outline-none focus:ring-2 focus:ring-rose-500 rounded"
//               >
//                 {showFullDescription ? 'Show less' : 'Show more'}
//               </button>
//             )}
//           </div>

//           {/* Amenities */}
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {hotel.amenities?.map((amenity, index) => (
//                 <div key={index} className="flex items-center min-w-0">
//                   <span className="text-xl mr-3 flex-shrink-0">
//                     {amenity.toLowerCase().includes('wifi') && <FaWifi />}
//                     {amenity.toLowerCase().includes('parking') && <FaParking />}
//                     {amenity.toLowerCase().includes('pool') && <FaSwimmingPool />}
//                     {amenity.toLowerCase().includes('hot tub') && <FaHotTub />}
//                   </span>
//                   <span className="truncate">{amenity}</span>
//                 </div>
//               ))}
//             </div>
//             <button className="mt-4 border border-black rounded-lg px-4 py-2 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500">
//               Show all amenities
//             </button>
//           </div>

//           {/* Location */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Where you'll be</h2>
//             <div className="h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden">
//               <iframe 
//                 title="Hotel location"
//                 src={hotel.gmap}
//                 width="100%" 
//                 height="100%" 
//                 style={{ border: 0 }} 
//                 allowFullScreen
//                 loading="lazy"
//                 className="rounded-xl"
//               ></iframe>
//             </div>
//             <p className="text-gray-700">{hotel.address}</p>
//           </div>
//         </div>

//         {/* Right Column - Booking Widget */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-4 border rounded-xl p-6 shadow-lg">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <p className="text-xl font-semibold">₹{hotel.rate} <span className="text-base font-normal">night</span></p>
//               </div>
//             </div>
            
//             {/* Calendar for Check-in/Check-out */}
//             <div className="mb-4">
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label htmlFor="checkin" className="text-xs font-semibold block mb-1">CHECK-IN</label>
//                   <DatePicker
//                     id="checkin"
//                     selected={startDate}
//                     onChange={(date) => setStartDate(date)}
//                     selectsStart
//                     startDate={startDate}
//                     endDate={endDate}
//                     placeholderText="Add date"
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     popperPlacement="auto"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="checkout" className="text-xs font-semibold block mb-1">CHECKOUT</label>
//                   <DatePicker
//                     id="checkout"
//                     selected={endDate}
//                     onChange={(date) => setEndDate(date)}
//                     selectsEnd
//                     startDate={startDate}
//                     endDate={endDate}
//                     minDate={startDate}
//                     placeholderText="Add date"
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
//                     popperPlacement="auto"
//                   />
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <label htmlFor="guests" className="text-xs font-semibold block mb-1">GUESTS</label>
//                 <select
//                   id="guests"
//                   value={guestCount}
//                   onChange={(e) => setGuestCount(Number(e.target.value))}
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
//                 >
//                   {Array.from({ length: hotel.capacity?.guests || 5 }, (_, i) => i + 1).map((num) => (
//                     <option key={num} value={num}>
//                       {num} {num === 1 ? 'guest' : 'guests'}
//                     </option>
//                   ))}
//                   {(hotel.capacity?.guests || 0) > 5 && (
//                     <option value={hotel.capacity.guests}>5+ guests</option>
//                   )}
//                 </select>
//               </div>
//             </div>
            
//             <button 
//               className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
//               disabled={!startDate || !endDate}
//             >
//               Reserve
//             </button>
            
//             <p className="text-center mt-4 text-sm text-gray-600">You won't be charged yet</p>
            
//             <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
//               <div>
//                 <p className="text-gray-600">
//                   ₹{hotel.rate} x {startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0} nights
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p>₹{startDate && endDate ? hotel.rate * Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0}</p>
//               </div>
//               <div>
//                 <p className="text-gray-600">Cleaning fee</p>
//               </div>
//               <div className="text-right">
//                 <p>₹{hotel.cleaningFee || 150}</p>
//               </div>
//               <div>
//                 <p className="text-gray-600">Service fee</p>
//               </div>
//               <div className="text-right">
//                 <p>₹{hotel.serviceFee || 240}</p>
//               </div>
//               <div className="col-span-2 border-t mt-2 pt-4">
//                 <div className="flex justify-between font-semibold">
//                   <p>Total</p>
//                   <p>₹{calculateTotal()}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HotelPage;
