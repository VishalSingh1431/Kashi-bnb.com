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
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen pt-40 px-4 sm:px-6 lg:px-8 pb-20 text-black" style={{ backgroundColor: '#f3eadb' }}>
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
        className="max-w-5xl mx-auto mt-12  p-8 rounded-xl shadow-xl border "
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-gray-900 mb-6 bg-clip-text  bg-gradient-to-r "
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
            At KashiBnB, our mission is to make every guest's stay in Varanasi comfortable, memorable, and hassle-free. 
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
        className="max-w-5xl mx-auto mt-12 p-8 rounded-xl shadow-xl border "
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-black mb-8 bg-clip-text  bg-gradient-to-r "
        >
          Our Team
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center  border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <img
                className="w-28 h-28 mx-auto rounded-full object-cover border-4  shadow-lg transform hover:scale-110 transition-transform duration-300"
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
        className="max-w-5xl mx-auto mt-12   p-8 rounded-xl shadow-xl border "
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-extrabold text-black mb-6 bg-clip-text   bg-gradient-to-r   "
        >
          "Join Us for a Stay that Feels Like Family, in the Soul of Varanasi"
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-gray-700 text-base leading-relaxed font-light"
        >
          At KashiBnB, we offer more than just a stay – we provide a home away from home. 
          Nestled in Varanasi's heart, our warm hospitality and cozy accommodations create 
          a family-like atmosphere. Whether you're exploring ancient streets or unwinding, 
          we ensure your time in this spiritual city is unforgettable.
        </motion.p>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-12   p-8 rounded-xl shadow-xl border"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-black mb-8 bg-clip-text  bg-gradient-to-r  "
        >
          Send Us a Message
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200"
                placeholder="Your name"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className= "">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border  transition-all duration-200"
                placeholder="your.email@example.com"
              />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border  transition-all duration-200"
                placeholder="+91 12345 67890"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="subject" className="block text-sm font-medium text- black mb-1">
                Subject <span className=" ">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border  transition-all duration-200"
                placeholder="What's this about?"
              />
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants}>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Your Message <span className=" ">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-3 rounded-lg border   focus:ring-2  transition-all duration-200"
              placeholder="Write your message here..."
            ></textarea>
          </motion.div>
          
          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full    text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Send Message
            </motion.button>
          </motion.div>
        </form>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-12"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-black mb-8 bg-clip-text  bg-gradient-to-r"
        >
          Get in Touch
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone Numbers */}
          <motion.div
            variants={itemVariants}
            className="  border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaPhoneAlt className="text-black text-2xl animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
            </div>
            <p className="text-black">+91 70543 47998</p>
            <p className="text-black">+91 99360 56789</p>
            <p className="text-black text-sm mt-2">9 AM – 6 PM IST, Mon-Sat</p>
          </motion.div>

          {/* Email */}
          <motion.div
            variants={itemVariants}
            className="border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="text-black text-2xl animate-pulse" />
              <h3 className="text-lg font-semibold text-black">Email</h3>
            </div>
            <p className="text-black">kashibnb@gmail.com</p>
          </motion.div>

          {/* Office Address */}
          <motion.div
            variants={itemVariants}
            className="border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-black text-2xl animate-pulse" />
              <h3 className="text-lg font-semibold text-black">Address</h3>
            </div>
            <p className="text-black text-sm">
              N 16/68 K-2, R-1 Sudamapur, Vinayaka, Kamchachha, Varanasi, Uttar Pradesh, 221010, India
            </p>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            variants={itemVariants}
            className= " border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-black">Social Media</h3>
            </div>
            <div className="flex gap-4">
              <motion.a
                href="#"
                className="text-black hover:text-black transition-colors"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaFacebook className="text-2xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-black hover:text-black transition-colors"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaInstagram className="text-2xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-black   transition-colors"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FaTwitter className="text-2xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-black 0  transition-colors"
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