import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaUsers, FaHome, FaHandshake } from 'react-icons/fa';
import Navbar from '../Components/Navbar';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardHoverEffect = {
    scale: 1.05,
    y: -10,
    transition: { type: "spring", stiffness: 300 }
  };

  return (
    <div style={{ backgroundColor: '#f3eadb' }}>
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="py-20 relative overflow-hidden"
        style={{ backgroundColor: '#f3eadb' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold text-orange-700 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About Us
          </motion.h1>
          <motion.p 
            className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We didn't start with a business plan. We started with a feeling—that hosting could be better. That travel could be more human.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12" style={{ backgroundColor: '#f3eadb' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Introduction */}
          <motion.div 
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-2xl shadow-lg border border-orange-100"
              variants={itemVariants}
              whileHover={cardHoverEffect}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-orange-700">Namaste!</h2>
              </div>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Our team is made up of everyday people—caretakers, hosts, service partners—all of whom helped shape some of the most loved and highly rated homestays and villa hotels in Varanasi.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                And no, it's not a luxury villa or a five-star resort. It's just creativity, hospitality, and genuine human experience that made it stand out. With over <strong className="text-orange-600">500+ reviews on Airbnb</strong>, <strong className="text-orange-600">10,000+ on Google</strong>, and <strong className="text-orange-600">10,000+ happy guests</strong>—we've proven that trust and care go further than polish and price.
              </p>
            </motion.div>
          </motion.div>

          {/* What Makes Us Different */}
          <motion.div 
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-800 mb-8 text-center"
              variants={itemVariants}
            >
              ✨ What Makes Us Different?
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: FaHome, text: "We're built for India—not for big hotel chains, but for real people and real homes." },
                { icon: FaHandshake, text: "We support both homestays and villa hotels—no matter how small or big." },
                { icon: FaStar, text: "We physically audit every property—trust should be earned, not assumed." },
                { icon: FaUsers, text: "We train hosts in hospitality and professionalism." },
                { icon: FaHeart, text: "We don't charge guests hidden fees and let hosts keep what they earn." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={cardHoverEffect}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-orange-100 rounded-full mr-4">
                      <item.icon className="text-2xl text-orange-600" />
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-12 text-center"
              variants={itemVariants}
            >
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-xl inline-block">
                <p className="text-xl text-gray-700 font-medium">
                  KashiBnB doesn't dictate—it empowers. Through ground support, digital tools, and one-on-one handholding, we help hosts grow their property with pride—not pressure.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Proudly Indian */}
          <motion.div 
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-10 rounded-2xl shadow-lg border border-green-100"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">🇮🇳 Proudly Indian. Powered Locally.</h2>
              <p className="text-xl text-gray-700 mb-6 text-center leading-relaxed">
                KashiBnB is 100% local. We don't send commission to other countries. We keep the money in India—circulating in neighbourhoods, small businesses, and families.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  "Local homestay and villa hotel owners",
                  "Local artisans and service teams", 
                  "The Indian travel ecosystem—with jobs and dignity"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md text-center"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-4xl mb-3">🏘️</div>
                    <p className="text-gray-700 font-medium">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Getting Started */}
          <motion.div 
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-gradient-to-r from-purple-50 to-pink-50 p-10 rounded-2xl shadow-lg border border-purple-100"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-4xl font-bold text-purple-800 mb-8 text-center">🚀 We're Just Getting Started…</h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                We currently manage 3 signature properties. Our hosts are all Airbnb Superhosts for 3+ years with glowing reviews and strong guest loyalty.
              </p>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                But this is just the beginning. Our dream? A nationwide network of certified, soulful Indian homestays and villas that offer travellers <strong className="text-purple-600">real value</strong>—and give hosts <strong className="text-purple-600">real dignity</strong>.
              </p>
              <p className="text-xl text-gray-700 mb-6 text-center">
                Whether you're a host or a traveller—KashiBnB is your home online.
              </p>
              <motion.p 
                className="text-3xl font-bold text-purple-600 text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                One room. One family. One story at a time.
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Team Section */}
          <motion.div 
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-800 mb-12 text-center"
              variants={itemVariants}
            >
              👨‍👩‍👧‍👦 Meet the KashiBnB Team — Real People, Real Hospitality
            </motion.h2>
            
            <motion.div 
              className="bg-gradient-to-r from-orange-50 to-amber-50 p-10 rounded-2xl shadow-lg border border-orange-100 mb-12"
              variants={itemVariants}
            >
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                You won't find shiny nameplates or corporate designations here. At KashiBnB, the team is made up of the folks you'll actually meet — not in a boardroom, but at the door with a smile, in the kitchen with chai, or during check-in with a helping hand.
              </p>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                We're a team of locals — caretakers, co-hosts, support staff, and hospitality lovers — who believe that making someone feel at home is an art.
              </p>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                No five-star training. No hospitality degrees. Just heart, honesty, and a commitment to doing the simple things really well.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                Together, we've taken three humble properties in Varanasi — not villas, not resorts — and turned them into some of the highest-rated homestays in the city, loved by over 10,000+ guests from all over the world.
              </p>
            </motion.div>

            {/* Interactive Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: "⭐", number: "500+", label: "reviews on Airbnb", color: "orange" },
                { icon: "🌟", number: "1,000+", label: "Google reviews", color: "amber" },
                { icon: "🏅", number: "Three", label: "Superhosts, year after year", color: "yellow" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-orange-50 p-8 rounded-2xl shadow-lg border border-orange-100 text-center cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-6xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                What sets us apart isn't money or scale. It's that everyone in the team genuinely cares. Whether it's a host adjusting pillows at midnight or a caretaker making sure your taxi arrives on time — every action here comes from the heart.
              </p>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                We're not trying to be the biggest. We're just trying to be the most trusted.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                You'll see our faces below — not stock photos, but the real people who run this place day in and day out. When you book a KashiBnB stay, you're not booking a room — you're becoming part of a team that takes pride in welcoming you like family.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default About;