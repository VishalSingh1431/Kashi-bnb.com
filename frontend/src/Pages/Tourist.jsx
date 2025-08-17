import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className='min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 pb-12' style={{ backgroundColor: '#f3eadb' }}>
      {/* Hero Section */}
      <div className='mb-16 py-12 px-6 text-center border border-black rounded-lg' style={{ backgroundColor: '#f3eadb' }}>
        <h1 className='text-4xl font-bold mb-4 text-black'>Discover Verified Homestays & Authentic Experiences</h1>
        <p className='text-xl mb-8 text-black'>Book directly with local hosts and save 10-15% on platform fees</p>
        <div className='flex flex-wrap justify-center gap-4'>
          <button 
            className='px-8 py-3 rounded-lg font-medium border border-black text-black hover:bg-black hover:text-white'
            onClick={() => navigate('/')}
          >
            Explore Verified Stays
          </button>
          <button 
            className='px-8 py-3 rounded-lg font-medium bg-black text-white hover:bg-gray-800'
            onClick={() => navigate('/tour')}
          >
            Plan My Trip
          </button>
        </div>
      </div>

      {/* Why Choose KashiBnB */}
      <div className='mb-16 p-8 border border-black rounded-lg' style={{ backgroundColor: '#f3eadb' }}>
        <h2 className='text-3xl font-bold mb-8 text-center text-black'>Why Choose KashiBnB?</h2>
        <div className='overflow-x-auto mb-8'>
          <table className='min-w-full rounded-lg overflow-hidden' style={{ backgroundColor: '#f3eadb', border: '1px solid black' }}>
            <thead style={{ backgroundColor: '#f3eadb' }}>
              <tr className='border-b border-black'>
                <th className='py-4 px-6 text-left text-black text-lg'>Features</th>
                <th className='py-4 px-6 text-left text-black text-lg'>KashiBnB</th>
                <th className='py-4 px-6 text-left text-black text-lg'>Airbnb</th>
                <th className='py-4 px-6 text-left text-black text-lg'>Booking.com</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b border-black'>
                <td className='py-4 px-6 font-medium text-black'>Guest Service Fee</td>
                <td className='py-4 px-6 text-black'>₹0</td>
                <td className='py-4 px-6 text-black'>10-15%</td>
                <td className='py-4 px-6 text-black'>10-15%</td>
              </tr>
              <tr className='border-b border-black'>
                <td className='py-4 px-6 font-medium text-black'>Verified Stays</td>
                <td className='py-4 px-6 text-black'>✓</td>
                <td className='py-4 px-6 text-black'>✗</td>
                <td className='py-4 px-6 text-black'>✗</td>
              </tr>
              <tr className='border-b border-black'>
                <td className='py-4 px-6 font-medium text-black'>Local Support</td>
                <td className='py-4 px-6 text-black'>✓</td>
                <td className='py-4 px-6 text-black'>✗</td>
                <td className='py-4 px-6 text-black'>✗</td>
              </tr>
              <tr>
                <td className='py-4 px-6 font-medium text-black'>Exclusive Stays</td>
                <td className='py-4 px-6 text-black'>✓</td>
                <td className='py-4 px-6 text-black'>✗</td>
                <td className='py-4 px-6 text-black'>✗</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='p-6 border border-black rounded-lg'>
            <h3 className='font-bold text-xl mb-3 text-black'>Lower Prices</h3>
            <p className='text-black'>No platform fees means you save 10-15% compared to other platforms</p>
          </div>
          <div className='p-6 border border-black rounded-lg'>
            <h3 className='font-bold text-xl mb-3 text-black'>Verified Stays</h3>
            <p className='text-black'>Our team personally inspects each property for quality assurance</p>
          </div>
          <div className='p-6 border border-black rounded-lg'>
            <h3 className='font-bold text-xl mb-3 text-black'>Local Experiences</h3>
            <p className='text-black'>Book authentic activities directly with your stay</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className='mb-16 p-8 border border-black rounded-lg' style={{ backgroundColor: '#f3eadb' }}>
        <h2 className='text-3xl font-bold mb-8 text-center text-black'>How It Works</h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='text-center p-4'>
            <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold'>1</div>
            <h3 className='font-bold text-xl mb-2 text-black'>Search</h3>
            <p className='text-black'>Find verified stays that match your preferences</p>
          </div>
          <div className='text-center p-4'>
            <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold'>2</div>
            <h3 className='font-bold text-xl mb-2 text-black'>Book</h3>
            <p className='text-black'>Reserve directly with the host, no middleman fees</p>
          </div>
          <div className='text-center p-4'>
            <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold'>3</div>
            <h3 className='font-bold text-xl mb-2 text-black'>Add Experiences</h3>
            <p className='text-black'>Enhance your stay with authentic local activities</p>
          </div>
          <div className='text-center p-4'>
            <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold'>4</div>
            <h3 className='font-bold text-xl mb-2 text-black'>Get Support</h3>
            <p className='text-black'>24/7 local assistance during your stay</p>
          </div>
        </div>
      </div>

      {/* Guest Reviews - Responsive Slider */}
      <div className='mb-16 p-8 border border-black rounded-lg' style={{ backgroundColor: '#f3eadb' }}>
        <h2 className='text-3xl font-bold mb-8 text-center text-black'>What Guests Say</h2>
        <div className='relative'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {visibleReviews.map((review, index) => (
              <div key={index} className='p-6 border border-black rounded-lg'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 rounded-full bg-gray-400 mr-4'></div>
                  <div>
                    <h4 className='font-bold text-lg text-black'>{review.name}</h4>
                    <div className='flex'>
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className='text-black'>★</span>
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
                        <span key={i} className='text-black'>☆</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className='text-black mb-3 italic'>"{review.comment}"</p>
                <p className='text-black text-sm font-medium'>{review.stay}</p>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevReview}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 -ml-6 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800'
          >
            &lt;
          </button>
          <button 
            onClick={nextReview}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 -mr-6 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800'
          >
            &gt;
          </button>
        </div>

        {/* Navigation Dots */}
        <div className='flex justify-center mt-8'>
          {Array.from({ length: reviews.length - itemsToShow + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 mx-1 rounded-full ${currentIndex === idx ? 'bg-black' : 'bg-gray-400'}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className='text-center'>
        <h2 className='text-3xl font-bold mb-6 text-black'>Ready for an Authentic Varanasi Experience?</h2>
        <div className='flex flex-wrap justify-center gap-4'>
          <button 
            className='px-8 py-4 text-lg rounded-lg font-medium border border-black text-black hover:bg-black hover:text-white'
            onClick={() => navigate('/')}
          >
            Explore Verified Stays
          </button>
          <button 
            className='px-8 py-4 text-lg rounded-lg font-medium bg-black text-white hover:bg-gray-800'
            onClick={() => navigate('/tour')}
          >
            Plan My Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tourist;