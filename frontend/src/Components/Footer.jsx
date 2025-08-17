import React, { useState, useEffect } from "react";
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
  Heart,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: "easeOut",
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    },
  };

  const hoverEffect = {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300, damping: 10 },
  };

  const linkHoverEffect = {
    x: 5,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  };

  return (
    <>
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isVisible 
            ? "opacity-100 translate-y-0 bg-orange-500 hover:bg-orange-600 text-white" 
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      <footer className="relative py-12 sm:py-16 lg:py-20 text-black overflow-hidden" style={{ backgroundColor: '#f3eadb' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #000 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 blur-xl"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-16 h-16 bg-yellow-200 rounded-full opacity-20 blur-xl"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <Link to="/" className="group flex items-center gap-3 mb-4">
                <motion.div
                  className="relative overflow-hidden rounded-xl shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.img
                    src="/images/newlogo.jpg"
                    alt="KashiBNB Logo"
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <motion.h3
                  className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-black"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  KashiBNB
                </motion.h3>
              </Link>
              
              <motion.p 
                className="text-sm sm:text-base leading-relaxed text-gray-700 mb-4"
                variants={itemVariants}
              >
                Discover authentic homestays and unforgettable experiences in the spiritual heart of Varanasi.
              </motion.p>
              
              <motion.div 
                className="flex space-x-4 mt-auto" 
                variants={itemVariants}
              >
                {[
                  { icon: Facebook, href: "https://facebook.com", color: "hover:text-blue-600", bgColor: "hover:bg-blue-50" },
                  { icon: Twitter, href: "https://twitter.com", color: "hover:text-blue-500", bgColor: "hover:bg-blue-50" },
                  { icon: Instagram, href: "https://www.instagram.com/kashibnb_official?igsh=MXN2a2Z3cjJ3NmgzMw==", color: "hover:text-pink-600", bgColor: "hover:bg-pink-50" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-all duration-300 ${social.color} ${social.bgColor} relative`}
                    whileHover={{ scale: 1.2, rotate: 10, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                  >
                    <social.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-current opacity-20"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <motion.h4 
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 relative group cursor-pointer text-black" 
                whileHover={hoverEffect}
              >
                <span>Quick Links</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.h4>
              
              <ul className="space-y-3">
                {[
                  { name: "Home", path: "/", icon: "🏠" },
                  { name: "About", path: "/about", icon: "ℹ️" },
                  { name: "Contact", path: "/contact", icon: "📞" },
                  { name: "Signup", path: "/signup", icon: "✍️" },
                  { name: "Login", path: "/login", icon: "🔑" },
                ].map((item) => (
                  <motion.li
                    key={item.name}
                    whileHover={linkHoverEffect}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link 
                      to={item.path}
                      className="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Explore More */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <motion.h4 
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 relative group cursor-pointer text-black" 
                whileHover={hoverEffect}
              >
                <span>Explore More</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.h4>
              
              <ul className="space-y-3">
                {[
                  { name: "Restaurants & Hotels", path: "/restaurants-hotels", icon: "🍽️" },
                  { name: "Add Your Business", path: "/add-business", icon: "➕" },
                  { name: "Blogs", path: "/blogs", icon: "📝" },
                ].map((item) => (
                  <motion.li
                    key={item.name}
                    whileHover={linkHoverEffect}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link 
                      to={item.path}
                      className="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Newsletter */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <motion.h4
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 relative group cursor-pointer text-black"
                whileHover={hoverEffect}
              >
                <span>Get in Touch</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.h4>
              
              <ul className="space-y-3 mb-4">
                <motion.li 
                  className="flex items-start gap-3 group" 
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="p-2 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300 flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <MapPin className="h-4 w-4 text-orange-600" />
                  </motion.div>
                  <div className="text-gray-700 leading-relaxed text-sm">
                    Bhelupur, Varanasi Uttar Pradesh, 221010
                  </div>
                </motion.li>
                
                <motion.li 
                  className="flex items-start gap-3 group" 
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="p-2 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors duration-300 flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Phone className="h-4 w-4 text-green-600" />
                  </motion.div>
                  <div className="text-gray-700 leading-relaxed text-sm">
                    <div>+91 8011708595</div>
                    <div>+91 7054347998</div>
                  </div>
                </motion.li>
                
                <motion.li 
                  className="flex items-start gap-3 group" 
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300 flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Mail className="h-4 w-4 text-blue-600" />
                  </motion.div>
                  <div className="text-gray-700 leading-relaxed text-sm">
                    kashibnb@gmail.com
                  </div>
                </motion.li>
              </ul>
              
              <motion.form
                onSubmit={handleSubscribe}
                className="mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Stay Updated
                </label>
                <div className="flex group">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full p-3 border border-gray-300 rounded-l-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 text-sm"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.button
                    type="submit"
                    className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-r-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    <Send className="h-5 w-5 relative z-10" />
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            className="mt-16 pt-5 border-t border-gray-200 text-center relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Decorative line */}
            <motion.div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            />
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-between gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-sm text-gray-600"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                © {new Date().getFullYear()} KashiBNB. All rights reserved.
              </motion.p>
              <motion.div 
                className="flex items-center gap-2 text-sm text-gray-600"
                whileHover={{ scale: 1.05 }}
              >
                <span>Made with</span>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </motion.div>
                <span>in Varanasi</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;