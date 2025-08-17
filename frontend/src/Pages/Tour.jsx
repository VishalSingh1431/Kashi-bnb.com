import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiInfo } from "react-icons/fi";

// BookNowButton with fullWidth and size props
const BookNowButton = ({
  size = "md",
  label = "Book Now",
  emoji = "📅",
  fullWidth = false,
  className = "",
  message = "I want to know about booking details"
}) => {
  const handleClick = () => {
    const phoneNumber = "+918011708595";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={handleClick}
      className={`
        bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-bold shadow
        hover:shadow-lg transition-all flex items-center justify-center
        ${sizeClasses[size] || sizeClasses.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      aria-label={label}
    >
      {emoji && <span className="mr-2">{emoji}</span>} {label}
    </motion.button>
  );
};

const Tour = () => {
  // Framer variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans"
    >

      {/* Hero Section */}
      <motion.section variants={item} className="text-center mb-16">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="inline-block mb-6"
        >
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            ✨ Premium Experience
          </span>
        </motion.div>
        
        <motion.h1 
          variants={item}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            KashiBnB Spiritual Journey
          </span>
        </motion.h1>
        
        <motion.p variants={item} className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Varanasi • Ayodhya • Prayagraj — Immerse yourself in India's holiest cities
        </motion.p>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <BookNowButton label="Book Now" emoji="📅" size="md" />
          <BookNowButton label="WhatsApp Inquiry" emoji="💬" size="md" message="I have a question about the package" />
        </motion.div>
        
        <motion.div variants={item} className="bg-blue-50 p-4 rounded-xl inline-block">
          <p className="text-lg font-medium">⏳ 4 Nights | 5 Days | 👨‍👩‍👧‍👦 Min 4 Adults</p>
          <p className="text-sm text-gray-600 mt-1">👶 Children under 6 stay free (same bedding)</p>
        </motion.div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section variants={container} className="mb-20">
        <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-blue-100 opacity-50 -rotate-1 rounded-lg"></span>
            <span className="relative z-10">🌟 Why Choose KashiBnB?</span>
          </span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "💰",
              title: "Best Pricing",
              desc: "Locked-in direct rates with no markups"
            },
            {
              icon: "🏡",
              title: "Certified Stays",
              desc: "Kanti Villa, Serene Stay, The Ghat House and others"
            },
            {
              icon: "🚗",
              title: "Premium Fleet by Subh travels",
              desc: "Ertiga, Desire, EV, Scooty, & Tempo Traveller available"
            },
            {
              icon: "👳",
              title: "Local Experts",
              desc: "Banarasi hosts for authentic experiences"
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Pricing Tables */}
      <motion.section variants={container} className="mb-20">
        <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-green-100 opacity-50 -rotate-1 rounded-lg"></span>
            <span className="relative z-10">💎 Package Pricing</span>
          </span>
        </motion.h2>
        
        {/* Main Pricing Table */}
        <motion.div variants={item} className="mb-12">
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                  <th className="p-3 text-left rounded-tl-xl">👥 Group Size</th>
                  <th className="p-3 text-right">💰 Total Cost</th>
                  <th className="p-3 text-right">🧑 Per Person</th>
                  <th className="p-3 text-center rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: "4 Pax", total: "₹28,799", pp: "₹7,200" },
                  { size: "6 Pax", total: "₹31,499", pp: "₹5,250" },
                  { size: "8 Pax", total: "₹48,998", pp: "₹6,125" },
                  { size: "10 Pax", total: "₹54,998", pp: "₹5,500" },
                  { size: "12 Pax", total: "₹54,998", pp: "₹4,583" },
                  { size: "14 Pax", total: "₹76,498", pp: "₹5,464" },
                  { size: "16 Pax", total: "₹82,497", pp: "₹5,156" },
                  { size: "24 Pax", total: "₹1,09,996", pp: "₹4,583" },
                  { size: "30 Pax", total: "₹1,37,495", pp: "₹4,583" }
                ].map((row, idx) => (
                  <motion.tr
                    key={row.size}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="p-3">{row.size}</td>
                    <td className="p-3 text-right">{row.total}</td>
                    <td className="p-3 text-right font-bold text-blue-600">{row.pp}</td>
                    <td className="p-3 text-center align-middle">
                      <BookNowButton size="sm" fullWidth />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">* Tempo Traveller rates vary—please call for dynamic pricing</p>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.h3 variants={item} className="text-2xl font-bold mb-6 flex items-center">
          <FiInfo className="mr-2 text-blue-500" /> Detailed Cost Breakdown
        </motion.h3>
        
        <motion.div variants={item} className="overflow-x-auto rounded-xl shadow-lg mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <th className="p-3 text-left rounded-tl-xl">Group</th>
                <th className="p-3 text-left">Stay Details</th>
                <th className="p-3 text-left">Ayodhya Cab</th>
                <th className="p-3 text-left">Prayagraj Cab</th>
                <th className="p-3 text-left">Varanasi Tour</th>
                <th className="p-3 text-left">Pickup/Drop</th>
                <th className="p-3 text-center rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  group: "6 Guests",
                  stay: "Triple-occupancy • 2 AC rooms • 4 nights",
                  ayodhya: "Ertiga – ₹6,000",
                  prayagraj: "Ertiga – ₹3,500",
                  varanasi: "₹5,000 (2 days)",
                  pickup: "Airport ₹1,200 • Railway ₹1,000"
                },
                {
                  group: "4 Guests ",
                  stay: "2 AC rooms • 4 nights",
                  ayodhya: "Desire – ₹5,000",
                  prayagraj: "Ertiga – ₹3,000",
                  varanasi: "₹4,000 (2 days)",
                  pickup: "Airport ₹1,000 • Railway ₹800"
                },
                {
                  group: "4 Guests ",
                  stay: "2 AC rooms • 4 nights",
                  ayodhya: "Desire – ₹5,000",
                  prayagraj: "Ertiga – ₹3,000",
                  varanasi: "Auto ₹3,000 (2 days)",
                  pickup: "Airport ₹1,000 • Railway ₹800"
                }
              ].map((row, idx) => (
                <motion.tr 
                  key={row.group + idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                >
                  <td className="p-3 font-medium">{row.group}</td>
                  <td className="p-3">{row.stay}</td>
                  <td className="p-3">{row.ayodhya}</td>
                  <td className="p-3">{row.prayagraj}</td>
                  <td className="p-3">{row.varanasi}</td>
                  <td className="p-3">{row.pickup}</td>
                  <td className="p-3 text-center align-middle">
                    <BookNowButton size="sm" fullWidth />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.section>

      {/* Inclusions */}
      <motion.section variants={container} className="mb-20">
        <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-purple-100 opacity-50 -rotate-1 rounded-lg"></span>
            <span className="relative z-10">🎁 What's Included</span>
          </span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Included */}
          <motion.div 
            variants={item}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-md border border-green-100"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <FiCheck className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold">All Packages Include</h3>
            </div>
            <ul className="space-y-3">
              {[
                "🏨 AC rooms with attached washrooms",
                "🍳 Daily Banarasi-style breakfast",
                "🚗 Private cabs for all transfers",
                "🏛️ 2-day guided Varanasi tour",
                "✈️ Airport/station pickup & drop",
                "📱 24×7 support & local host",
                "🛣️ All parking, tolls, and taxes"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Not Included */}
          <motion.div 
            variants={item}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl shadow-md border border-red-100"
          >
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <FiInfo className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold">Not Included</h3>
            </div>
            <ul className="space-y-3">
              {[
                "🍽️ Lunch & dinner (available on request)",
                "🛕 Temple entry/donation fees",
                "⛵ Boat rides & cruise tickets",
                "🆙 Room/vehicle upgrades",
                "🛍️ Personal expenses & shopping",
                "💸 Tips & gratuities",
                "🛂 VIP darshan arrangements"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Itinerary */}
      <motion.section variants={container} className="mb-20">
        <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-yellow-100 opacity-50 -rotate-1 rounded-lg"></span>
            <span className="relative z-10">🗓️ Daily Itinerary</span>
          </span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Day 1 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-full mr-3">
                1
              </div>
              <h3 className="text-xl font-bold">Day 1: Spiritual Introduction</h3>
            </div>
            <ul className="space-y-4">
              {[
                "🛺 Auto drop to Kaal Bhairav Mandir",
                "🛕 Baba Vishwanath Temple (Gate #4)",
                "🚶 Vishwanath Corridor walk",
                "🌊 Ghat via corridor (no return)",
                "🔥 Manikarnika Ghat & narrow-street walk",
                "☕ Lakshmi Tea Wala & breakfast",
                "🍦 ShreeJi Shop (Malaiyo tasting)",
                "🕯️ 4–5 PM Ganga Aarti @ Dasaswamedh",
                "🍲 Dinner @ Luv Kush Hotel"
              ].map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Day 2 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full mr-3">
                2
              </div>
              <h3 className="text-xl font-bold">Day 2: Ghats & Temples</h3>
            </div>
            <ul className="space-y-4">
              {[
                "🌅 Subah-e-Banaras @ Assi Ghat",
                "⛵ Boat ride (84 ghats)",
                "🍩 Breakfast @ Lanka (famous kachori)",
                "🏡 Rest at villa",
                "🛕 Temples: Durga, Sankat Mochan",
                "🌇 Sunset cruise & aarti @ Assi",
                "🏡 Return to Kanti Villa"
              ].map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Day 3 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 text-orange-800 font-bold px-4 py-2 rounded-full mr-3">
                3
              </div>
              <h3 className="text-xl font-bold">Day 3: Ayodhya Pilgrimage</h3>
            </div>
            <ul className="space-y-4">
              {[
                "🚗 Early morning departure to Ayodhya (3hr drive)",
                "🛕 Visit Shri Ram Janmabhoomi Temple",
                "🐒 Explore Hanuman Garhi Temple",
                "🏞️ Panoramic city views from hilltop",
                "🍽️ Local cuisine lunch experience",
                "🛍️ Explore local markets & souvenirs",
                "🌆 Return to Varanasi by evening"
              ].map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-orange-500 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Day 4 */}
          <motion.div 
            variants={item}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 text-purple-800 font-bold px-4 py-2 rounded-full mr-3">
                4
              </div>
              <h3 className="text-xl font-bold">Day 4: Prayagraj Exploration</h3>
            </div>
            <ul className="space-y-4">
              {[
                "🌊 Sacred bath in Triveni Sangam",
                "🏛️ Visit Anand Bhavan Museum",
                "🏰 Explore Allahabad Fort",
                "🌳 Stroll through Khusro Bagh",
                "🐒 Lying Hanuman Temple visit",
                "🍽️ Traditional Prayagraj lunch",
                "🌅 Return to Varanasi by sunset"
              ].map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Special Packages */}
      <motion.section variants={container} className="mb-20">
        <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-purple-100 opacity-50 -rotate-1 rounded-lg"></span>
            <span className="relative z-10">✨ Special Packages</span>
          </span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Regular Package */}
          <motion.div 
            variants={item}
            whileHover={{ y: -5 }}
            className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">Regular Kashi Darshan</h3>
              <p className="opacity-90">2 Nights / 3 Days • 2 Adults + 1 Kid</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-bold text-blue-600">₹6,999/-*</span>
                <BookNowButton />
              </div>
              
              <h4 className="font-bold mb-3 flex items-center">
                <FiCheck className="mr-2 text-blue-500" /> Inclusions:
              </h4>
              <ul className="space-y-2 mb-6">
                {[
                  "Welcome Drink on arrival",
                  "Breakfast & Dinner",
                  "Double sharing homestay",
                  "Parking & tolls included",
                  "Pick & drop service",
                  "Private car for sightseeing"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Dev Deepawali Package */}
          <motion.div 
            variants={item}
            whileHover={{ y: -5 }}
            className="bg-white border border-purple-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">Dev Deepawali Special</h3>
              <p className="opacity-90">2 Nights / 3 Days • 2 Adults + 1 Kid</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-bold text-purple-600">₹8,999/-*</span>
                <BookNowButton />
              </div>
              
              <h4 className="font-bold mb-3 flex items-center">
                <FiCheck className="mr-2 text-purple-500" /> Inclusions:
              </h4>
              <ul className="space-y-2 mb-6">
                {[
                  "Welcome Drink on arrival",
                  "Breakfast & Dinner",
                  "Double sharing homestay",
                  "Parking & tolls included",
                  "Pick & drop service",
                  "Private car for sightseeing",
                  "Special Dev Deepawali events"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-purple-500 mr-2 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Villas */}
      <motion.section variants={container} className="mb-20">
        <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-indigo-100 opacity-50 -rotate-1 rounded-lg"></span>
            <span className="relative z-10">🏡 Featured Villas</span>
          </span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Kanti Villa",
              emoji: "🏛️",
              desc: "12-bedroom retreat 2 km from Assi Ghat.",
              features: ["12 bedrooms", "Courtyard", "Rooftop lounge", "2km from Assi Ghat"],
              price: "₹5,999/night"
            },
            {
              name: "Serene Stay Villa",
              emoji: "🌿",
              desc: "5 BHK villa with garden terrace, pool, yoga alcove.",
              features: ["5 BHK", "Garden terrace", "Pool", "Yoga space"],
              price: "₹6,499/night"
            },
            {
              name: "The Ghat House",
              emoji: "🌅",
              desc: "12-bedroom Ganga-front heritage home with private ghat access.",
              features: ["12 bedrooms", "Ganga-facing", "Private ghat", "Heritage"],
              price: "₹7,999/night"
            }
          ].map((villa, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="bg-gradient-to-r from-indigo-100 to-blue-50 p-8 text-center text-6xl">
                {villa.emoji}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{villa.name}</h3>
                <p className="text-gray-600 mb-4">{villa.desc}</p>
                <p className="text-lg font-bold text-blue-600 mb-4">{villa.price}</p>
                <ul className="space-y-2 mb-4">
                  {villa.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center">
                      <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2">
                        <FiCheck className="text-xs" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <BookNowButton size="sm" fullWidth />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Guest Reviews Section */}
      <motion.section variants={container} className="mb-20">
        <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-yellow-100 opacity-50 -rotate-1 rounded-lg"></span>
            <span className="relative z-10">⭐ Guest Reviews</span>
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Review 1 */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                AM
              </div>
              <div>
                <h3 className="text-xl font-bold">Aarav & Meera Sharma</h3>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              "KashiBnB Tours & Travel is awesome, and staying in The Ghat House is exceptional! The hospitality was beyond our expectations."
            </p>
            <p className="text-sm text-gray-500">Stayed: March 2025 • Family of 4</p>
          </motion.div>

          {/* Review 2 */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                PK
              </div>
              <div>
                <h3 className="text-xl font-bold">Priya & Karan Joshi</h3>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              "The spiritual journey was perfectly planned. Our guide knew all the hidden gems of Varanasi. Will definitely recommend to friends!"
            </p>
            <p className="text-sm text-gray-500">Stayed: January 2025 • Couple</p>
          </motion.div>

          {/* Review 3 */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                SG
              </div>
              <div>
                <h3 className="text-xl font-bold">Sunita Gupta</h3>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              "As a solo female traveler, I felt completely safe and cared for. The team went above and beyond to make my pilgrimage special."
            </p>
            <p className="text-sm text-gray-500">Stayed: December 2024 • Solo Traveler</p>
          </motion.div>
        </div>

         
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        variants={fadeIn}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-12 text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ready for Your Spiritual Journey?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
          >
            Book now and experience the divine atmosphere of India's holiest cities
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <BookNowButton label="Book Now" emoji="📅" size="md" />
            <BookNowButton label="WhatsApp Us" emoji="💬" size="md" message="I want to know more about the packages" />
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Tour;