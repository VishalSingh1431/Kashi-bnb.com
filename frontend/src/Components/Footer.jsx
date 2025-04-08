import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Mail,
  Send,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail(""); // Reset input
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        ease: "easeOut",
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const hoverEffect = {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300 },
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <motion.img
                src="https://kashibnb.in/wp-content/uploads/2024/09/Image-3-1.jpg"
                alt="KashiBNB Logo"
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              />
              <motion.h3
                className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500"
                whileHover={{ scale: 1.05 }}
              >
                KashiBNB
              </motion.h3>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Discover authentic homestays and unforgettable experiences in the spiritual heart of Varanasi.
            </p>
            <motion.div
              className="flex space-x-6 mt-6"
              variants={itemVariants}
            >
              {[
                { icon: Facebook, href: "https://facebook.com", color: "hover:text-blue-500" },
                { icon: Twitter, href: "https://twitter.com", color: "hover:text-blue-400" },
                { icon: Instagram, href: "https://www.instagram.com/kashibnb_official?igsh=MXN2a2Z3cjJ3NmgzMw==", color: "hover:text-pink-500" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors ${social.color}`}
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <motion.h4
              className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600"
              whileHover={hoverEffect}
            >
              Quick Links
            </motion.h4>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Signup", path: "/signup" },
                { name: "Login", path: "/login" },
              ].map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 5, color: "#a5b4fc" }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Link
                    to={item.path}
                    className="text-gray-300 text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <motion.h4
              className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600"
              whileHover={hoverEffect}
            >
              Explore More
            </motion.h4>
            <ul className="space-y-4">
              {[
                "Restaurants & Hotels",
                "Add Your Business",
                "Blogs",
              ].map((service) => (
                <motion.li
                  key={service}
                  whileHover={{ x: 5, color: "#a5b4fc" }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Link
                    to={`/${service.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`}
                    className="text-gray-300 text-sm font-medium"
                  >
                    {service}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div variants={itemVariants}>
            <motion.h4
              className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600"
              whileHover={hoverEffect}
            >
              Get in Touch
            </motion.h4>
            <ul className="space-y-5 text-gray-300 text-sm">
              <motion.li
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <MapPin className="h-5 w-5 text-indigo-400 animate-pulse" />
                <span>Adress: Bhelupur, Varanasi Uttar Pradesh, 221010</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <Phone className="h-5 w-5 text-indigo-400 animate-pulse" />
                <span>+91 8011708595, </span>
                <span>+91 7054347998</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <Mail className="h-5 w-5 text-indigo-400 animate-pulse" />
                <span>kashibnb@gmail.com</span>
              </motion.li>
            </ul>
            {/* Newsletter Subscription */}
            <motion.form
              onSubmit={handleSubscribe}
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Stay Updated
              </label>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full p-3 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  required
                />
                <motion.button
                  type="submit"
                  className="p-3 bg-indigo-600 rounded-r-lg hover:bg-indigo-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p>
            © {new Date().getFullYear()} KashiBNB. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;