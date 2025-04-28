import React from 'react';

const Owner = () => {
  return (
    <div className='min-h-screen pt-40 px-4 sm:px-6 lg:px-8' style={{ backgroundColor: '#f3eadb' }}>
      {/* Hero Section */}
      <div className='mb-8 p-6 text-center border border-black rounded-lg' style={{ backgroundColor: '#f3eadb' }}>
        <h1 className='text-3xl font-bold mb-4 text-black'>High Commission from Platforms like Airbnb?</h1>
        <p className='text-xl mb-6 text-black'>Go Local with KashiBnB & Earn More</p>
        <button className='px-6 py-3 rounded-lg font-medium transition border border-black text-black hover:bg-black hover:text-white'>
          List Your Property & Earn More
        </button>
      </div>

      {/* Subscription Plans */}
      <div className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-center text-black'>MONTHLY SUBSCRIPTION PLANS</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full rounded-lg overflow-hidden' style={{ backgroundColor: '#f3eadb', border: '1px solid black' }}>
            <thead style={{ backgroundColor: '#f3eadb' }}>
              <tr className='border-b border-black'>
                <th className='py-3 px-4 text-left text-black'>Features</th>
                <th className='py-3 px-4 text-left text-black'>KashiBnB</th>
                <th className='py-3 px-4 text-left text-black'>airbnb</th>
                <th className='py-3 px-4 text-left text-black'>make (w/) trip</th>
                <th className='py-3 px-4 text-left text-black'>Booking.com</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b border-black'>
                <td className='py-3 px-4 font-medium text-black'>COMMISSION PER BOOKING</td>
                <td className='py-3 px-4 text-black'>₹999 (Based on Plan)</td>
                <td className='py-3 px-4 text-black'>15-18%</td>
                <td className='py-3 px-4 text-black'>15-20%</td>
                <td className='py-3 px-4 text-black'>15-20%</td>
              </tr>
              <tr className='border-b border-black'>
                <td className='py-3 px-4 font-medium text-black'>LISTING FEE</td>
                <td className='py-3 px-4 text-black'>₹0</td>
                <td className='py-3 px-4 text-black'>₹0</td>
                <td className='py-3 px-4 text-black'>₹0</td>
                <td className='py-3 px-4 text-black'>₹0</td>
              </tr>
              <tr className='border-b border-black'>
                <td className='py-3 px-4 font-medium text-black'>MULTI-PLATFORM SYNC</td>
                <td className='py-3 px-4 text-black'>✓</td>
                <td className='py-3 px-4 text-black'>✗</td>
                <td className='py-3 px-4 text-black'>✗</td>
                <td className='py-3 px-4 text-black'>✗</td>
              </tr>
              <tr>
                <td className='py-3 px-4 font-medium text-black'>LOCAL SUPPORT</td>
                <td className='py-3 px-4 text-black'>✓</td>
                <td className='py-3 px-4 text-black'>✗</td>
                <td className='py-3 px-4 text-black'>✗</td>
                <td className='py-3 px-4 text-black'>✗</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Details */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        {/* Basic Plan */}
        <div className='p-6 rounded-lg border border-black' style={{ backgroundColor: '#f3eadb' }}>
          <h3 className='text-xl font-bold mb-2 text-black'>Basic Plan</h3>
          <p className='text-2xl font-bold mb-4 text-black'>₹999/month</p>
          <ul className='space-y-2'>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>List on KashiBnB</span>
            </li>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>Local customer support</span>
            </li>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>No commission on bookings</span>
            </li>
          </ul>
          <button className='mt-6 w-full py-2 rounded-lg font-medium border border-black text-black hover:bg-black hover:text-white'>
            Choose Plan
          </button>
        </div>

        {/* Growth Plan */}
        <div className='p-6 rounded-lg border-2 border-black relative' style={{ backgroundColor: '#f3eadb', transform: 'scale(1.05)' }}>
          <div className='absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg bg-black text-white'>
            POPULAR
          </div>
          <h3 className='text-xl font-bold mb-2 text-black'>Growth Plan</h3>
          <p className='text-2xl font-bold mb-4 text-black'>₹2,999/month</p>
          <ul className='space-y-2'>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>Everything in Basic Plan</span>
            </li>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>Multi-platform listing</span>
            </li>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>Dynamic pricing support</span>
            </li>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>Monthly insights & recommendations</span>
            </li>
          </ul>
          <button className='mt-6 w-full py-2 rounded-lg font-medium border border-black text-black hover:bg-black hover:text-white'>
            Choose Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className='p-6 rounded-lg border border-black' style={{ backgroundColor: '#f3eadb' }}>
          <h3 className='text-xl font-bold mb-2 text-black'>Premium Plan</h3>
          <p className='text-2xl font-bold mb-4 text-black'>₹4,999/month</p>
          <ul className='space-y-2'>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>Everything in Growth Plan</span>
            </li>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>Full property management support</span>
            </li>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>Guest screening & verification</span>
            </li>
            <li className='flex items-start'>
              <span className='mr-2 text-black'>✓</span>
              <span className='text-black'>Hospitality training for staff</span>
            </li>
          </ul>
          <button className='mt-6 w-full py-2 rounded-lg font-medium border border-black text-black hover:bg-black hover:text-white'>
            Choose Plan
          </button>
        </div>
      </div>

      {/* Host School Section */}
      <div className='p-6 rounded-lg border border-black mb-12' style={{ backgroundColor: '#f3eadb' }}>
        <h2 className='text-2xl font-bold mb-4 text-black'>KashiBnB Host School</h2>
        <p className='mb-6 text-black'>Learn how to maximize your earnings and provide excellent guest experiences</p>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 rounded-lg border border-black'>
            <h3 className='font-bold mb-2 text-black'>Better Guest Experience</h3>
            <p className='text-sm text-black'>Learn cleaning standards, amenities setup, and check-in processes</p>
          </div>
          <div className='p-4 rounded-lg border border-black'>
            <h3 className='font-bold mb-2 text-black'>Handling Bookings & Reviews</h3>
            <p className='text-sm text-black'>Master communication and review management</p>
          </div>
          <div className='p-4 rounded-lg border border-black'>
            <h3 className='font-bold mb-2 text-black'>Maximize Earnings</h3>
            <p className='text-sm text-black'>Smart pricing strategies and occupancy optimization</p>
          </div>
        </div>
        
        <button className='mt-6 px-6 py-2 rounded-lg font-medium border border-black text-black hover:bg-black hover:text-white'>
          Join Host School
        </button>
      </div>

      {/* FAQ Section */}
      
    </div>
  );
};

export default Owner;