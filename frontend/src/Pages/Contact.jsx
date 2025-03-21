import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Manish Singh",
    designation: "Owner of Kanti Villa",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
  },
  {
    name: "Dipti Singh",
    designation: "Owner of Bliss and Serene Group",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Shalya Mishra",
    designation: "M.D of all Properties",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Rahul Singh",
    designation: "Owner of KashiBnB",
    image: "https://via.placeholder.com/150",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Contact = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Contact Info */}
      <motion.div
        className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
          Contact Us
        </motion.h2>
        <motion.div className="space-y-4" variants={containerVariants}>
          <motion.p className="flex items-center text-gray-700" variants={itemVariants}>
            <FaPhoneAlt className="mr-2 text-blue-500" /> +91 88507 81241, +91 80117 08595
          </motion.p>
          <motion.p className="flex items-center text-gray-700" variants={itemVariants}>
            <FaEnvelope className="mr-2 text-red-500" /> kashibnb@gmail.com, kashibnb.vns@gmail.com
          </motion.p>
          <motion.p className="flex items-center text-gray-700" variants={itemVariants}>
            <FaMapMarkerAlt className="mr-2 text-green-500" /> Bhelupur, Varanasi, Uttar Pradesh 221010
          </motion.p>
          <motion.p className="flex items-center text-gray-700" variants={itemVariants}>
            <FaGlobe className="mr-2 text-purple-500" />{" "}
            <a href="https://kashibnb.in" className="text-blue-600 underline">
              kashibnb.in
            </a>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Our Mission */}
      <motion.div
        className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
          Our Mission
        </motion.h2>
        <motion.p className="text-gray-600" variants={itemVariants}>
          At KashiBnB, our mission is simple: to make every guest’s stay in Varanasi as comfortable, memorable, and
          hassle-free as possible. We understand that finding the perfect homestay can be overwhelming, especially in a
          city as rich in culture and history as Varanasi. That’s why we’re dedicated to offering you a seamless and
          personalized experience from the moment you book with us.
        </motion.p>
      </motion.div>

      {/* Our Team */}
      <motion.div
        className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
          Our Team
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {teamMembers.map((member, index) => (
            <motion.div key={index} className="text-center" variants={itemVariants}>
              <img
                src={member.image}
                alt={member.name}
                className="rounded-full w-32 h-32 mx-auto mb-2"
              />
              <h3 className="font-semibold text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.designation}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Join Us */}
      <motion.div
        className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg mt-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
          Join Us for a Stay that Feels Like Family
        </motion.h2>
        <motion.p className="text-gray-600" variants={itemVariants}>
          At KashiBnB, we invite you to experience more than just a stay – we offer a home away from home. Nestled in the
          heart of Varanasi, our warm hospitality and cozy accommodations create a family-like atmosphere, ensuring you
          feel comfortable and connected.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Contact;