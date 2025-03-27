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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
