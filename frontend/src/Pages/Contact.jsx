import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Manish Singh",
    designation: "Owner of Kanti Villa",
    image: "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
  },
  {
    name: "Dipti Singh",
    designation: "Owner of Bliss and Serene Group",
    image: "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
  },
  {
    name: "Shalya Mishra",
    designation: "M.D of all Properties",
    image: "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
  },
  {
    name: "Rahul Singh",
    designation: "Owner of KashiBnB",
    image: "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      ease: "easeOut",
      duration: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Contact = () => {
  return (
    <div className="min-h-screen pt-52 px-4 sm:px-6 lg:px-8 ">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <img
          className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
          src="/images/Contact.png"
          alt="Contact Us"
        />
      </motion.div>

      {/* Our Mission */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-xl border border-gray-100"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600"
        >
          Our Mission
        </motion.h2>
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-8">
          <img
            className="w-64 h-64 object-cover rounded-lg shadow-lg transform hover:rotate-2 transition-transform duration-300"
            src="/images/mission.png"
            alt="Mission"
          />
          <p className="text-gray-700 text-base leading-relaxed font-light">
            At KashiBnB, our mission is to make every guest’s stay in Varanasi comfortable, memorable, and hassle-free. 
            We simplify the search for the perfect homestay in this culturally rich city, offering a seamless, personalized 
            experience from booking to checkout. Our dedication to exceptional service and warm hospitality ensures you 
            feel like part of the KashiBnB family, with cozy rooms, local insights, and a truly unforgettable stay.
          </p>
        </motion.div>
      </motion.div>

      {/* Our Team */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-xl border border-gray-100"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600"
        >
          Our Team
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <img
                className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-teal-500 shadow-lg transform hover:scale-110 transition-transform duration-300"
                src={member.image}
                alt={member.name}
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.designation}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Join Us */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-xl border border-gray-100"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600"
        >
          “Join Us for a Stay that Feels Like Family, in the Soul of Varanasi”
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-gray-700 text-base leading-relaxed font-light"
        >
          At KashiBnB, we offer more than just a stay – we provide a home away from home. 
          Nestled in Varanasi’s heart, our warm hospitality and cozy accommodations create 
          a family-like atmosphere. Whether you’re exploring ancient streets or unwinding, 
          we ensure your time in this spiritual city is unforgettable.
        </motion.p>
      </motion.div>

      {/* Contact Us */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-12"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600"
        >
          Get in Touch
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone Numbers */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaPhoneAlt className="text-teal-500 text-2xl animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
            </div>
            <p className="text-gray-600">+91 70543 47998</p>
            <p className="text-gray-600">+91 99360 56789</p>
            <p className="text-gray-500 text-sm mt-2">9 AM – 6 PM IST, Mon-Sat</p>
          </motion.div>

          {/* Email */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="text-teal-500 text-2xl animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-800">Email</h3>
            </div>
            <p className="text-gray-600">kashibnb@gmail.com</p>
          </motion.div>

          {/* Office Address */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-teal-500 text-2xl animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-800">Address</h3>
            </div>
            <p className="text-gray-600 text-sm">
              N 16/68 K-2, R-1 Sudamapur, Vinayaka, Kamchachha, Varanasi, Uttar Pradesh, 221010, India
            </p>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Social Media</h3>
            </div>
            <div className="flex gap-4">
              <motion.a
                href="#"
                className="text-teal-500 hover:text-teal-600 transition-colors"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaFacebook className="text-2xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-teal-500 hover:text-teal-600 transition-colors"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaInstagram className="text-2xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-teal-500 hover:text-teal-600 transition-colors"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaTwitter className="text-2xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-teal-500 hover:text-teal-600 transition-colors"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaLinkedin className="text-2xl" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;