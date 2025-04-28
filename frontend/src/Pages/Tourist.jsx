import React, { useState, useEffect } from 'react';

const Tourist = () => {
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
    <div className='min-h-screen pt-40 px-4 sm:px-6 lg:px-8' style={{ backgroundColor: '#f3eadb' }}>
      {/* Hero Section */}
      {/* <div className='mb-8 p-6 text-center border border-black rounded-lg' style={{ backgroundColor: '#f3eadb' }}>
        <h1 className='text-3xl font-bold mb-4 text-black'>Book Direct, Pay Less!</h1>
        <p className='text-xl mb-6 text-black'>No Airbnb Fees - Authentic Stays in Varanasi</p>
        <div className='max-w-md mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-4'>
            <input type='text' placeholder='Location' className='p-2 border border-black rounded text-black' />
            <input type='date' className='p-2 border border-black rounded text-black' />
            <input type='date' className='p-2 border border-black rounded text-black' />
          </div>
          <button className='px-6 py-3 rounded-lg font-medium border border-black text-black hover:bg-black hover:text-white w-full'>
            Search Stays
          </button>
        </div>
      </div> */}

      {/* Why Choose KashiBnB */}
      <div className='mb-12 p-6 border border-black rounded-lg' style={{ backgroundColor: '#f3eadb' }}>
        <h2 className='text-2xl font-bold mb-6 text-center text-black'>Why Choose KashiBnB?</h2>
        <div className='overflow-x-auto mb-8'>
          <table className='min-w-full rounded-lg overflow-hidden' style={{ backgroundColor: '#f3eadb', border: '1px solid black' }}>
            <thead style={{ backgroundColor: '#f3eadb' }}>
              <tr className='border-b border-black'>
                <th className='py-3 px-4 text-left text-black'>Features</th>
                <th className='py-3 px-4 text-left text-black'>KashiBnB</th>
                <th className='py-3 px-4 text-left text-black'>airbnb</th>
                <th className='py-3 px-4 text-left text-black'>Booking.com</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b border-black'>
                <td className='py-3 px-4 font-medium text-black'>GUEST SERVICE FEE</td>
                <td className='py-3 px-4 text-black'>₹0</td>
                <td className='py-3 px-4 text-black'>10-15%</td>
                <td className='py-3 px-4 text-black'>10-15%</td>
              </tr>
              <tr className='border-b border-black'>
                <td className='py-3 px-4 font-medium text-black'>VERIFIED STAYS</td>
                <td className='py-3 px-4 text-black'>✓</td>
                <td className='py-3 px-4 text-black'>✗</td>
                <td className='py-3 px-4 text-black'>✗</td>
              </tr>
              <tr className='border-b border-black'>
                <td className='py-3 px-4 font-medium text-black'>LOCAL SUPPORT</td>
                <td className='py-3 px-4 text-black'>✓</td>
                <td className='py-3 px-4 text-black'>✗</td>
                <td className='py-3 px-4 text-black'>✗</td>
              </tr>
              <tr>
                <td className='py-3 px-4 font-medium text-black'>EXCLUSIVE STAYS</td>
                <td className='py-3 px-4 text-black'>✓</td>
                <td className='py-3 px-4 text-black'>✗</td>
                <td className='py-3 px-4 text-black'>✗</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='p-4 border border-black rounded-lg'>
            <h3 className='font-bold text-lg mb-2 text-black'>Lower Prices</h3>
            <p className='text-black'>No platform fees means you save 10-15% compared to other platforms</p>
          </div>
          <div className='p-4 border border-black rounded-lg'>
            <h3 className='font-bold text-lg mb-2 text-black'>Verified Stays</h3>
            <p className='text-black'>Our team personally inspects each property for quality assurance</p>
          </div>
          <div className='p-4 border border-black rounded-lg'>
            <h3 className='font-bold text-lg mb-2 text-black'>Local Experiences</h3>
            <p className='text-black'>Book authentic activities directly with your stay</p>
          </div>
        </div>
      </div>

      {/* Guest Reviews - Responsive Slider */}
      <div className='mb-12 p-6 border border-black rounded-lg' style={{ backgroundColor: '#f3eadb' }}>
        <h2 className='text-2xl font-bold mb-6 text-center text-black'>What Guests Say</h2>
        <div className='relative'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {visibleReviews.map((review, index) => (
              <div key={index} className='p-4 border border-black rounded-lg'>
                <div className='flex items-center mb-3'>
                  <div className='w-10 h-10 rounded-full bg-gray-400 mr-3'></div>
                  <div>
                    <h4 className='font-bold text-black'>{review.name}</h4>
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
                <p className='text-black mb-2 italic'>"{review.comment}"</p>
                <p className='text-black text-sm'>{review.stay}</p>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevReview}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800'
          >
            &lt;
          </button>
          <button 
            onClick={nextReview}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800'
          >
            &gt;
          </button>
        </div>

        {/* Navigation Dots */}
        <div className='flex justify-center mt-6'>
          {Array.from({ length: reviews.length - itemsToShow + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 mx-1 rounded-full ${currentIndex === idx ? 'bg-black' : 'bg-gray-400'}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tourist;
