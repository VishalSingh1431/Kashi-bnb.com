import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Get ID from URL
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Wifi, Tv, Coffee, Star } from "lucide-react";
import { Link } from "react-router-dom";

const HotelPage = () => {
  const { id } = useParams(); // Get hotel ID from URL
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await fetch(`BACKEND/api/v1/hotel/hotel/${id}`);
        const data = await response.json();
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

  const {
    name,
    slug,
    heroImage,
    description,
    pricePerNight,
    currency,
    location,
    amenities,
    galleryImages,
    mapEmbed,
    rating,
    reviews,
    features,
    ctaText,
    ctaLink,
  } = hotel;

  // Animation Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Map amenity icons dynamically
  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase().includes("bedroom")) return <Bed className="h-5 w-5 text-indigo-500" />;
    if (amenity.toLowerCase().includes("bathroom")) return <Bath className="h-5 w-5 text-indigo-500" />;
    if (amenity.toLowerCase().includes("wi-fi")) return <Wifi className="h-5 w-5 text-indigo-500" />;
    if (amenity.toLowerCase().includes("tv")) return <Tv className="h-5 w-5 text-indigo-500" />;
    if (amenity.toLowerCase().includes("coffee") || amenity.toLowerCase().includes("tea"))
      return <Coffee className="h-5 w-5 text-indigo-500" />;
    return <Star className="h-5 w-5 text-indigo-500" />; // Default icon
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        className="relative w-full max-w-6xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <img src={heroImage} alt={name} className="w-full h-96 object-cover rounded-xl shadow-lg" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center px-4">
            {name}
          </h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <motion.div
          className="lg:col-span-2 space-y-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Description */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Property</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Amenities */}
          {amenities?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Features */}
          {features?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <Star className="h-5 w-5 text-indigo-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery */}
          {galleryImages?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img, index) => (
                  <motion.img
                    key={index}
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Column: Booking & Info */}
        <motion.div className="lg:col-span-1 space-y-8" variants={sectionVariants} initial="hidden" whileInView="visible">
          {/* Price & Booking */}
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl font-bold text-gray-900">
                {currency}
                {pricePerNight?.toLocaleString()}{" "}
                <span className="text-sm font-normal text-gray-500">/ night</span>
              </p>
              {rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-gray-700 font-medium">
                    {rating} ({reviews} reviews)
                  </span>
                </div>
              )}
            </div>
            <Link to={ctaLink || "/book"}>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300 font-semibold">
                {ctaText || "Book Now"}
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HotelPage;
