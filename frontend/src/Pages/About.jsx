import React from "react";
import { motion } from "framer-motion";
import {
  FaUserFriends,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaHome,
  FaCheckCircle,
  FaHandshake,
  FaBook,
} from "react-icons/fa";

const About = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardHoverEffect = {
    scale: 1.03,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
    transition: { type: "spring", stiffness: 400, damping: 20 },
  };

  return (
    <div className=" min-h-screen pt-52 px-4 sm:px-6 lg:px-8">
      {/* Hero Image */}
   

      {/* Why Choose KashiBNB */}
      <motion.div
        className="max-w-5xl mx-auto mt-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-10 text-center"
          variants={itemVariants}
        >
          Why Choose KashiBNB?
        </motion.h1>

        {/* For Guests */}
        <motion.div
          className="bg-white p-8 rounded-xl shadow-md mb-10 border border-gray-200"
          variants={itemVariants}
          whileHover={cardHoverEffect}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <FaUserFriends className="text-indigo-900" /> For Guests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Register for free and book a home.",
              "Safe rental process guaranteed.",
              "Rent by price per night or price per guest.",
              "24/7 Support hours for customers.",
              "The most affordable rentals platform.",
              "Book extra options with your house rental.",
            ].map((text, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-4 rounded-lg flex items-start gap-3"
                variants={itemVariants}
              >
                <FaCheckCircle className="text-blue-400 mt-1" />
                <p className="text-gray-700 text-base">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* For Hotel Owners */}
        <motion.div
          className="bg-white p-8 rounded-xl shadow-md border border-gray-200"
          variants={itemVariants}
          whileHover={cardHoverEffect}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <FaBuilding className="text-indigo-900" /> For Hotel Owners
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              "Boost Your Visibility.",
              "Affordable Listing.",
              "Enhanced Guest Experience.",
              "24/7 Support hours for customers.",
            ].map((text, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-4 rounded-lg flex items-start gap-3"
                variants={itemVariants}
              >
                <FaHandshake className="text-blue-400 mt-1" />
                <p className="text-gray-700 text-base">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* What We Offer */}
      <motion.div
        className="max-w-5xl mx-auto mt-16 bg-white p-8 rounded-xl shadow-md border border-gray-200"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-10 text-center"
          variants={itemVariants}
        >
          What We Offer
        </motion.h1>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "Verified Homestays: Every property listed on KashiBnB is personally vetted for quality and safety.",
            "End-to-End Services: Travel Arrangements, Cultural Experiences, and Culinary Delights.",
            "Affordable Platform: Keep more of your earnings with our minimal fees while gaining maximum exposure.",
            "How it Works: Browse, Choose, and Book with ease.",
          ].map((text, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-6 rounded-lg flex items-start gap-4"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <FaBook className="text-indigo-900 text-2xl" />
              <p className="text-gray-700 text-base">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Stats Section with Image */}
      <motion.div
        className="max-w-5xl mx-auto mt-16 bg-white p-8 rounded-xl shadow-md border border-gray-200"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-10 text-center"
          variants={itemVariants}
        >
          Our Achievements
        </motion.h1>
        <motion.div
          className="w-full mb-8 overflow-hidden rounded-lg shadow-lg"
          variants={itemVariants}
        >
          <img
            className="w-full h-64 object-cover"
            src="/images/achievements.jpg"
            alt="Our Achievements"
          />
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { number: 100, label: "Team Members", icon: <FaUserFriends className="text-4xl text-indigo-900" /> },
            { number: 1000, label: "Customers", icon: <FaUsers className="text-4xl text-indigo-900" /> },
            { number: 50, label: "Rental Offices", icon: <FaBuilding className="text-4xl text-indigo-900" /> },
            { number: 20, label: "Business Years", icon: <FaCalendarAlt className="text-4xl text-indigo-900" /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center bg-gray-50 p-6 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <h3 className="text-3xl font-bold text-gray-900">{stat.number}+</h3>
              <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How We Help You with Image */}
      <motion.div
        className="max-w-5xl mx-auto mt-16 bg-white p-8 rounded-xl shadow-md border border-gray-200 mb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-10 text-center"
          variants={itemVariants}
        >
          How We Help You
        </motion.h1>
        <motion.div
          className="w-full mb-8 overflow-hidden rounded-lg shadow-lg"
          variants={itemVariants}
        >
          <img
            className="w-full  object-cover"
            src="/images/How we.jpg"
            alt="How We Help You"
          />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Find the perfect home",
              description: "Choose from the largest number of items and look through the listings added to our site.",
            },
            {
              title: "Personal contact",
              description: "Use Contact Owner button to arrange a viewing of the listing you wish and even book it.",
            },
            {
              title: "Book your home",
              description: "Send a booking request and owner will approve it. If a deposit is needed, you can pay it through secure merchants to admin.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-6 rounded-lg flex flex-col gap-3"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center gap-3">
                <FaHome className="text-indigo-900 text-2xl" />
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-base">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          className="w-full h-full object-cover"
          src="/images/About Us.png"
          alt="About Us"
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight"
            variants={itemVariants}
          >
            About KashiBNB
          </motion.h1>
        </div> */}
      </motion.div>

      {/* Welcome Section */}
      <motion.div
        className="max-w-5xl mx-auto mt-12 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
          variants={itemVariants}
        >
          Welcome to KashiBNB
        </motion.h1>
        <motion.p
          className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Your one-stop solution for authentic homestay experiences in Varanasi!
          Whether you’re a traveler seeking a seamless journey or a property owner
          looking for better visibility, KashiBnB is here to redefine the way you
          explore and host in the spiritual heart of India.
        </motion.p>
      </motion.div>

      {/* Hotel Room Image */}
      <motion.div
        className="max-w-5xl mx-auto mt-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <img
          className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
          src="/images/hotel room.jpg"
          alt="Hotel Room"
        />
      </motion.div>
    </div>
  );
};

export default About;