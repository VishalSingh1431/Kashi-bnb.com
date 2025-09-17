import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Tourist = () => {
  const navigate = useNavigate();
  const [visibleReviews, setVisibleReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1);

  const reviews = [
    { name: "Rahul S.", rating: 5, comment: "The heritage home was exactly as described. Saved 18% compared to Airbnb!", stay: "Riverside Heritage Home" },
    { name: "Priya M.", rating: 5, comment: "Local host gave us amazing tips for exploring the real Varanasi.", stay: "Traditional Courtyard House" },
    { name: "Arjun K.", rating: 4, comment: "Great value and the verification badge made me feel secure booking direct.", stay: "Modern Apartment with Ganga View" },
    { name: "Neha P.", rating: 5, comment: "The boat tour add-on was the highlight of our trip!", stay: "Riverside Heritage Home" },
    { name: "Sanjay G.", rating: 5, comment: "Much better experience than big platforms. Will book again!", stay: "Traditional Courtyard House" },
    { name: "Meera K.", rating: 4, comment: "Loved the authentic local experience. Host was very helpful.", stay: "Modern Apartment with Ganga View" }
  ];

  const updateVisibleReviews = (index) => {
    setVisibleReviews(reviews.slice(index, index + itemsToShow));
  };

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setItemsToShow(4);
    } else if (window.innerWidth >= 768) {
      setItemsToShow(3);
    } else {
      setItemsToShow(1);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    updateVisibleReviews(currentIndex);
  }, [currentIndex, itemsToShow]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (reviews.length - itemsToShow + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [itemsToShow]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % (reviews.length - itemsToShow + 1));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + (reviews.length - itemsToShow + 1)) % (reviews.length - itemsToShow + 1));
  };

  // Animation variants
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

  return (
    <div className='min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 py-8' style={{ backgroundColor: '#f3eadb' }}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section 
          className='mb-8 p-8 text-center bg-white rounded-2xl shadow-lg border border-gray-100'
          variants={itemVariants}
        >
          <h1 className='text-4xl font-bold mb-4 text-gray-900'>
            Discover Verified Homestays & Authentic Experiences
          </h1>
          <p className='text-xl mb-6 text-gray-600'>
            Book directly with local hosts and save 10-15% on platform fees
          </p>
          <p className='text-lg mb-6 text-gray-600'>
            Experience the real Varanasi with verified stays and authentic local activities
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <motion.button 
              className='px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Verified Stays
            </motion.button>
            <motion.button 
              className='px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              onClick={() => navigate('/tour')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Plan My Trip
            </motion.button>
          </div>
        </motion.section>

        {/* Why Choose KashiBnB */}
        <motion.section 
          className='mb-8 p-8 bg-white rounded-2xl shadow-lg border border-gray-100'
          variants={itemVariants}
        >
          <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>Why Choose KashiBnB?</h2>
          
          {/* Comparison Table */}
          <div className='overflow-x-auto mb-8'>
            <table className='min-w-full rounded-lg overflow-hidden shadow-md bg-white border border-gray-200'>
              <thead className='bg-blue-600 text-white'>
                <tr>
                  <th className='py-4 px-6 text-left text-lg font-semibold'>Features</th>
                  <th className='py-4 px-6 text-left text-lg font-semibold'>KashiBnB</th>
                  <th className='py-4 px-6 text-left text-lg font-semibold'>Airbnb</th>
                  <th className='py-4 px-6 text-left text-lg font-semibold'>Booking.com</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-gray-200 hover:bg-gray-50'>
                  <td className='py-4 px-6 font-semibold text-gray-700'>Guest Service Fee</td>
                  <td className='py-4 px-6 text-green-600 font-bold'>₹0</td>
                  <td className='py-4 px-6 text-red-500'>10-15%</td>
                  <td className='py-4 px-6 text-red-500'>10-15%</td>
                </tr>
                <tr className='border-b border-gray-200 hover:bg-gray-50'>
                  <td className='py-4 px-6 font-semibold text-gray-700'>Verified Stays</td>
                  <td className='py-4 px-6 text-green-600 text-lg'>✓</td>
                  <td className='py-4 px-6 text-red-500 text-lg'>✗</td>
                  <td className='py-4 px-6 text-red-500 text-lg'>✗</td>
                </tr>
                <tr className='border-b border-gray-200 hover:bg-gray-50'>
                  <td className='py-4 px-6 font-semibold text-gray-700'>Local Support</td>
                  <td className='py-4 px-6 text-green-600 text-lg'>✓</td>
                  <td className='py-4 px-6 text-red-500 text-lg'>✗</td>
                  <td className='py-4 px-6 text-red-500 text-lg'>✗</td>
                </tr>
                <tr className='hover:bg-gray-50'>
                  <td className='py-4 px-6 font-semibold text-gray-700'>Exclusive Stays</td>
                  <td className='py-4 px-6 text-green-600 text-lg'>✓</td>
                  <td className='py-4 px-6 text-red-500 text-lg'>✗</td>
                  <td className='py-4 px-6 text-red-500 text-lg'>✗</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Feature Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <motion.div 
              className='p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4'>
                <span className='text-white text-lg font-bold'>₹</span>
              </div>
              <h3 className='font-bold text-xl mb-3 text-gray-900'>Lower Prices</h3>
              <p className='text-gray-600 text-sm'>No platform fees means you save 10-15% compared to other platforms</p>
            </motion.div>
            
            <motion.div 
              className='p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4'>
                <span className='text-white text-lg font-bold'>✓</span>
              </div>
              <h3 className='font-bold text-xl mb-3 text-gray-900'>Verified Stays</h3>
              <p className='text-gray-600 text-sm'>Our team personally inspects each property for quality assurance</p>
            </motion.div>
            
            <motion.div 
              className='p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className='w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4'>
                <span className='text-white text-lg font-bold'>🎯</span>
              </div>
              <h3 className='font-bold text-xl mb-3 text-gray-900'>Local Experiences</h3>
              <p className='text-gray-600 text-sm'>Book authentic activities directly with your stay</p>
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section 
          className='mb-8 p-8 bg-white rounded-2xl shadow-lg border border-gray-100'
          variants={itemVariants}
        >
          <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>How It Works</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <motion.div 
              className='text-center p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg'>1</div>
              <h3 className='font-bold text-xl mb-3 text-gray-900'>Search</h3>
              <p className='text-gray-600 text-sm'>Find verified stays that match your preferences</p>
            </motion.div>
            
            <motion.div 
              className='text-center p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg'>2</div>
              <h3 className='font-bold text-xl mb-3 text-gray-900'>Book</h3>
              <p className='text-gray-600 text-sm'>Reserve directly with the host, no middleman fees</p>
            </motion.div>
            
            <motion.div 
              className='text-center p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg'>3</div>
              <h3 className='font-bold text-xl mb-3 text-gray-900'>Add Experiences</h3>
              <p className='text-gray-600 text-sm'>Enhance your stay with authentic local activities</p>
            </motion.div>
            
            <motion.div 
              className='text-center p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg'>4</div>
              <h3 className='font-bold text-xl mb-3 text-gray-900'>Get Support</h3>
              <p className='text-gray-600 text-sm'>24/7 local assistance during your stay</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Guest Reviews - Responsive Slider */}
        <motion.section 
          className='mb-8 p-8 bg-white rounded-2xl shadow-lg border border-gray-100'
          variants={itemVariants}
        >
          <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>What Guests Say</h2>
          <div className='relative'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {visibleReviews.map((review, index) => (
                <motion.div 
                  key={index} 
                  className='p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className='flex items-center mb-4'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mr-4 flex items-center justify-center'>
                      <span className='text-white font-bold text-lg'>{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className='font-bold text-lg text-gray-900'>{review.name}</h4>
                      <div className='flex'>
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className='text-yellow-400 text-sm'>★</span>
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <span key={i} className='text-gray-300 text-sm'>☆</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className='text-gray-600 mb-3 italic text-sm'>"{review.comment}"</p>
                  <p className='text-blue-600 text-xs font-semibold'>{review.stay}</p>
                </motion.div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <motion.button 
              onClick={prevReview}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 -ml-6 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 shadow-lg'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              &lt;
            </motion.button>
            <motion.button 
              onClick={nextReview}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 -mr-6 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 shadow-lg'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              &gt;
            </motion.button>
          </div>

          {/* Navigation Dots */}
          <div className='flex justify-center mt-8'>
            {Array.from({ length: reviews.length - itemsToShow + 1 }).map((_, idx) => (
              <motion.button
                key={idx}
                className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => setCurrentIndex(idx)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section 
          className='text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100'
          variants={itemVariants}
        >
          <h2 className='text-3xl font-bold mb-6 text-gray-900'>
            Ready for an Authentic Varanasi Experience?
          </h2>
          <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
            Join thousands of travelers who have discovered the real Varanasi through our verified homestays and authentic experiences.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <motion.button 
              className='px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Verified Stays
            </motion.button>
            <motion.button 
              className='px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              onClick={() => navigate('/tour')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Plan My Trip
            </motion.button>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Tourist;