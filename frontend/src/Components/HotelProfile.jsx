import React from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Wifi, Tv, Coffee, Star } from "lucide-react";
import { Link } from "react-router-dom"; // For navigation

const HotelProfile = ({
  name = "Property Name",
  slug = "property-name", // Unique slug for routing
  heroImage = "https://via.placeholder.com/1200x600",
  description = "A wonderful place to stay with all the comforts you need.",
  pricePerNight = 0,
  currency = "₹", // Default to INR, can be changed
  location = "Unknown Location",
  amenities = [],
  galleryImages = [],
  mapEmbed = "",
  rating = 0,
  reviews = 0,
  features = [], // Additional features (e.g., "Non-Smoking", "Pet-Friendly")
  ctaText = "Book Now", // Customizable call-to-action text
  ctaLink = "/book", // Default booking link
  showRating = true, // Toggle rating display
  showGallery = true, // Toggle gallery display
  showMap = true, // Toggle map display
}) => {
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
        <img
          src={heroImage}
          alt={name}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />
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
          {amenities.length > 0 && (
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

          {/* Additional Features */}
          {features.length > 0 && (
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
          {showGallery && galleryImages.length > 0 && (
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
        <motion.div
          className="lg:col-span-1 space-y-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Price & Booking */}
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl font-bold text-gray-900">
                {currency}
                {pricePerNight.toLocaleString()}{" "}
                <span className="text-sm font-normal text-gray-500">/ night</span>
              </p>
              {showRating && rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-gray-700 font-medium">
                    {rating} ({reviews} reviews)
                  </span>
                </div>
              )}
            </div>
            <Link to={ctaLink}>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300 font-semibold">
                {ctaText}
              </button>
            </Link>
          </div>

          {/* Location */}
          {showMap && mapEmbed && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-600">{location}</p>
              </div>
              <iframe
                src={mapEmbed}
                className="w-full h-64 rounded-lg border-0"
                allowFullScreen=""
                loading="lazy"
                title="Property Location"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HotelProfile;