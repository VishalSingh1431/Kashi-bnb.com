import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Owner = () => {
  const navigate = useNavigate();
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // monthly, quarterly, yearly

  const calculateEarnings = (commissionRate, subscriptionFee = 0) => {
    const revenue = billingPeriod === 'quarterly' ? monthlyRevenue * 3 : 
                   billingPeriod === 'yearly' ? monthlyRevenue * 12 : 
                   monthlyRevenue;
    const commissionAmount = (revenue * commissionRate) / 100;
    return Math.round(revenue - commissionAmount - subscriptionFee);
  };

  const calculateLoss = (commissionRate) => {
    const revenue = billingPeriod === 'quarterly' ? monthlyRevenue * 3 : 
                   billingPeriod === 'yearly' ? monthlyRevenue * 12 : 
                   monthlyRevenue;
    return Math.round((revenue * commissionRate) / 100);
  };

  const calculateProfit = (commissionRate, subscriptionFee = 0) => {
    const kashiEarnings = calculateEarnings(commissionRate, subscriptionFee);
    const oyoEarnings = calculateEarnings(15); // OYO has 15% commission
    return Math.round(kashiEarnings - oyoEarnings);
  };

  const getSubscriptionFee = (plan) => {
    const fees = {
      starter: { monthly: 1499, quarterly: 3999, yearly: 10999 },
      pro: { monthly: 2999, quarterly: 8999, yearly: 24999 },
      scale: { monthly: 4999, quarterly: 17999, yearly: 49999 }
    };
    return fees[plan][billingPeriod] || 0;
  };

  const getBillingPeriodLabel = () => {
    switch (billingPeriod) {
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return 'Monthly';
    }
  };

  return (
    <div className='min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 py-8' style={{ backgroundColor: '#f3eadb' }}>
      {/* Hero Section */}
      <div className='mb-8 p-8 text-center bg-white rounded-2xl shadow-lg border border-gray-100'>
        <h1 className='text-4xl font-bold mb-4 text-gray-900'>Keep 100% of your bookings — List free on KashiBnB</h1>
        <p className='text-xl mb-6 text-gray-600'>Commission-Free Subscription Plans • Accept commission-free bookings • Sell direct • Grow revenue</p>
        <p className='text-lg mb-6 text-gray-600'>Choose a plan that fits your property size — from single flats to multi-room homes</p>
        <p className='text-lg font-semibold mb-6 text-blue-600'>Plans from ₹1,499/month</p>
        <button
          onClick={() => document.getElementById('subscription-plans').scrollIntoView({ behavior: 'smooth' })}
          className='px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        >
          View Plans
        </button>
      </div>

      {/* Subscription Plans */}
      <div id='subscription-plans' className='mb-12'>
        <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>COMMISSION-FREE SUBSCRIPTION PLANS</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-stretch'>
          {/* Starter Plan */}
          <div className='p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col'>
            <h3 className='text-xl font-bold mb-2 text-gray-900'>Starter</h3>
            <p className='text-sm mb-2 text-blue-600 font-medium'>2BHK or less</p>
            <p className='text-xs mb-4 text-gray-500'>Perfect for single flats & small homestays</p>
            <div className='mb-4'>
              <p className='text-lg font-bold text-gray-900'>₹1,499/month</p>
              <p className='text-sm text-gray-600'>₹3,999/quarter</p>
              <p className='text-sm text-gray-600'>₹10,999/year</p>
            </div>
            <ul className='space-y-2 mb-6'>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Free listing on KashiBnB</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Commission-free bookings from guests</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>1 hour remote training for ground staff</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Facilitate listing on other OTAs</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Videography reel for social media + boost on KashiBnB channels</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Professional photography (one shoot)</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Helpdesk: Revenue growth playbook</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/number')}
              className='w-full py-3 rounded-xl font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300'
            >
              Choose Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className='p-6 rounded-2xl bg-white shadow-xl border-2 border-blue-500 relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform scale-105 flex flex-col'>
            <div className='absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl rounded-tr-xl bg-blue-600 text-white'>
              POPULAR
            </div>
            <h3 className='text-xl font-bold mb-2 text-gray-900'>Pro</h3>
            <p className='text-sm mb-2 text-blue-600 font-medium'>2 to 5 rooms</p>
            <p className='text-xs mb-4 text-gray-500'>For owner-managed guesthouses and small BnBs</p>
            <div className='mb-4'>
              <p className='text-lg font-bold text-gray-900'>₹2,999/month</p>
              <p className='text-sm text-gray-600'>₹8,999/quarter</p>
              <p className='text-sm text-gray-600'>₹24,999/year</p>
            </div>
            <ul className='space-y-2 mb-6'>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Everything in Starter, plus:</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>3 hours on-site / remote staff training & SOPs</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Priority placement in search & weekly social boost</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Videography reel (short + long cut) + twice monthly promotion</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Channel manager integration & OTA sync help</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Monthly performance report & pricing tips</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/number')}
              className='w-full py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300'
            >
              Choose Plan
            </button>
          </div>

          {/* Scale Plan */}
          <div className='p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col'>
            <h3 className='text-xl font-bold mb-2 text-gray-900'>Scale</h3>
            <p className='text-sm mb-2 text-blue-600 font-medium'>5 to 10 rooms</p>
            <p className='text-xs mb-4 text-gray-500'>For multi-unit homestays and small hotels</p>
            <div className='mb-4'>
              <p className='text-lg font-bold text-gray-900'>₹4,999/month</p>
              <p className='text-sm text-gray-600'>₹17,999/quarter</p>
              <p className='text-sm text-gray-600'>₹49,999/year</p>
            </div>
            <ul className='space-y-2 mb-6'>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Everything in Pro, plus:</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Onboarding: 5 hours on-site training + SOP manual</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Dedicated account manager (phone & WhatsApp)</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Higher marketing allocation (featured campaigns)</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Advanced revenue optimisation + dynamic pricing guidance</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Quarterly photoshoot & social media creative pack</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/number')}
              className='w-full py-3 rounded-xl font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300'
            >
              Choose Plan
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className='p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <h3 className='text-xl font-bold mb-2 text-gray-900'>Enterprise</h3>
            <p className='text-sm mb-2 text-blue-600 font-medium'>10+ rooms</p>
            <p className='text-xs mb-4 text-gray-500'>For larger guesthouses, hotels & groups — custom SLA</p>
            <div className='mb-4'>
              <p className='text-lg font-bold text-gray-900'>Custom</p>
              <p className='text-sm text-gray-600'>Monthly: Custom — Contact sales</p>
              <p className='text-sm text-gray-600'>Quarterly/Yearly: Custom — Contact sales</p>
            </div>
            <ul className='space-y-2 mb-6'>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Everything in Scale, plus:</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Dedicated account team & monthly on-site audits</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Custom marketing & distribution plan (email + paid ads)</span>
              </li>

              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Priority booking support & settlement (faster payouts)</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Custom pricing — call for quote & bespoke onboarding</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <span className='text-gray-700 text-sm'>Dedicated chatbot for 24/7 business support & help</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/number')}
              className='w-full py-3 rounded-xl font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300'
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Free Listing Notice */}
      <div className='mb-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 text-center'>
        <h3 className='text-2xl font-bold mb-4 text-gray-900'>Free Listing Available</h3>
        <p className='text-lg text-gray-700 mb-4'>You can list your property for free on KashiBnB without any subscription</p>
        <p className='text-gray-600 mb-4'>Free listing includes basic visibility and commission-free bookings</p>
        <p className='text-sm text-gray-500'>Upgrade to any plan above for additional benefits and premium features</p>
      </div>

      {/* OTA Comparison Table */}
      <div className='mb-12 p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-lg border border-gray-100'>
        <h2 className='text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900'>Earnings Comparison: Other OTAs vs KashiBnB</h2>
        <p className='text-base sm:text-lg mb-4 sm:mb-6 text-gray-600 text-center px-2'>See how much more you can earn with KashiBnB's commission-free model</p>
        
        {/* Revenue Input */}
        <div className='mb-6 sm:mb-8 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm'>
          <div className='max-w-4xl mx-auto'>
            {/* Revenue Input Section */}
            <div className='mb-6 sm:mb-8'>
              <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4'>
                <label className='text-base sm:text-lg lg:text-xl font-bold text-gray-800 text-center sm:text-left'>
                  Enter your {billingPeriod === 'quarterly' ? 'quarterly' : billingPeriod === 'yearly' ? 'yearly' : 'monthly'} revenue
                </label>
                <div className='flex items-center gap-2'>
                  <span className='text-xl sm:text-2xl font-bold text-blue-600'>₹</span>
                  <input
                    type='number'
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(parseInt(e.target.value) || 0)}
                    className='px-3 sm:px-4 py-2 sm:py-3 lg:py-4 text-lg sm:text-xl font-bold text-gray-900 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 w-24 sm:w-32 lg:w-40 text-center'
                    min='1000'
                    placeholder='50000'
                  />
                </div>
              </div>
            </div>
            
            {/* Billing Period Selector */}
            <div className='text-center'>
              <div className='flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-4'>
                <label className='text-base sm:text-lg lg:text-xl font-bold text-gray-800'>
                  Select billing period
                </label>
                <div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                      billingPeriod === 'monthly'
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50 hover:scale-105'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('quarterly')}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                      billingPeriod === 'quarterly'
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50 hover:scale-105'
                    }`}
                  >
                    Quarterly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                      billingPeriod === 'yearly'
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50 hover:scale-105'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              <p className='text-xs sm:text-sm text-gray-600 font-medium'>Calculations will update automatically</p>
            </div>
          </div>
        </div>
        
        <div className='overflow-x-auto shadow-lg rounded-lg'>
          <table className='w-full border-collapse border border-gray-300 rounded-lg overflow-hidden min-w-[600px] sm:min-w-[800px]'>
            <thead>
              <tr className='bg-gray-50'>
                 <th className='border border-gray-300 px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-bold text-gray-900 text-xs sm:text-sm'>Platform/Plan</th>
                 <th className='border border-gray-300 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-bold text-gray-900 text-xs sm:text-sm'>Commission</th>
                 <th className='border border-gray-300 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-bold text-gray-900 text-xs sm:text-sm'>Fee</th>
                 <th className='border border-gray-300 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-bold text-gray-900 text-xs sm:text-sm'>Total Pay</th>
                 <th className='border border-gray-300 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-bold text-gray-900 text-xs sm:text-sm'>Your Income</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Create array of all platforms with their earnings for sorting
                const platforms = [
                  {
                    name: 'KashiBnB (Starter Plan)',
                    commission: '0% Commission',
                    subscriptionFee: getSubscriptionFee('starter'),
                    earnings: calculateEarnings(0, getSubscriptionFee('starter')),
                    loss: 0,
                    profit: calculateProfit(0, getSubscriptionFee('starter')),
                    isKashi: true
                  },
                  {
                    name: 'KashiBnB (Pro Plan)',
                    commission: '0% Commission',
                    subscriptionFee: getSubscriptionFee('pro'),
                    earnings: calculateEarnings(0, getSubscriptionFee('pro')),
                    loss: 0,
                    profit: calculateProfit(0, getSubscriptionFee('pro')),
                    isKashi: true
                  },
                  {
                    name: 'KashiBnB (Scale Plan)',
                    commission: '0% Commission',
                    subscriptionFee: getSubscriptionFee('scale'),
                    earnings: calculateEarnings(0, getSubscriptionFee('scale')),
                    loss: 0,
                    profit: calculateProfit(0, getSubscriptionFee('scale')),
                    isKashi: true
                  },
                  {
                    name: 'KashiBnB (Free Listing)',
                    commission: '6% Commission',
                    subscriptionFee: 0,
                    earnings: calculateEarnings(6),
                    loss: calculateLoss(6),
                    profit: calculateProfit(6),
                    isKashi: true
                  },
                  {
                    name: 'OYO',
                    commission: '10-15%',
                    subscriptionFee: 0,
                     earnings: calculateEarnings(13),
                     loss: calculateLoss(13),
                    profit: 0,
                    isKashi: false
                  },
                  {
                    name: 'MakeMyTrip',
                    commission: '12-18%',
                    subscriptionFee: 0,
                     earnings: calculateEarnings(20),
                     loss: calculateLoss(20),
                    profit: 0,
                    isKashi: false
                  },
                  {
                    name: 'Airbnb',
                    commission: '14-20%',
                    subscriptionFee: 0,
                     earnings: calculateEarnings(17),
                     loss: calculateLoss(17),
                    profit: 0,
                    isKashi: false
                  },
                  {
                    name: 'Booking.com',
                    commission: '15-25%',
                    subscriptionFee: 0,
                    earnings: calculateEarnings(15),
                    loss: calculateLoss(15),
                    profit: 0,
                    isKashi: false
                  }
                ];

                // Sort by earnings in descending order
                platforms.sort((a, b) => b.earnings - a.earnings);

                return platforms.map((platform, index) => {
                  // Calculate net profit/loss: profit - loss
                  const netProfitLoss = platform.profit - platform.loss;
                  const isPositive = netProfitLoss > 0;
                  
                  return (
                    <tr key={index} className={platform.isKashi ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}>
                      <td className={`border border-gray-300 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold text-xs sm:text-sm ${platform.isKashi ? 'text-green-800' : 'text-gray-900'}`}>
                        {platform.name}
                      </td>
                      <td className={`border border-gray-300 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center font-bold text-xs sm:text-sm ${platform.isKashi ? 'text-green-600' : 'text-red-600'}`}>
                        {platform.commission}
                      </td>
                       <td className={`border border-gray-300 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center font-bold text-xs sm:text-sm ${platform.isKashi ? 'text-green-600' : 'text-gray-400'}`}>
                         ₹{platform.subscriptionFee.toLocaleString()}
                       </td>
                       <td className={`border border-gray-300 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center font-bold text-xs sm:text-sm ${platform.isKashi ? 'text-green-600' : 'text-red-600'}`}>
                         ₹{(platform.loss + platform.subscriptionFee).toLocaleString()}
                       </td>
                       <td className={`border border-gray-300 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center font-bold text-xs sm:text-sm ${platform.isKashi ? 'text-green-600' : 'text-red-600'}`}>
                         ₹{platform.earnings.toLocaleString()}
                       </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
        
      </div>

      {/* Why Other Platforms Eat Your Earnings */}
      <div className='mb-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100'>
        <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>Why other platforms eat your earnings</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <div className='flex items-start'>
              <span className='mr-3 text-red-500 font-bold text-lg'>•</span>
              <span className='text-gray-700'>High commission fees: OTAs commonly take 10–25% per booking — that's revenue that never reaches your pocket.</span>
            </div>
            <div className='flex items-start'>
              <span className='mr-3 text-red-500 font-bold text-lg'>•</span>
              <span className='text-gray-700'>Listing & marketing costs: To rank on OTAs you often need to discount, invest in promotions or pay for visibility.</span>
            </div>
            <div className='flex items-start'>
              <span className='mr-3 text-red-500 font-bold text-lg'>•</span>
              <span className='text-gray-700'>Guest acquisition & payment fees: Multiple hidden charges (payment gateway fees, service fees) reduce your effective rate.</span>
            </div>
          </div>
          <div className='space-y-4'>
            <div className='flex items-start'>
              <span className='mr-3 text-red-500 font-bold text-lg'>•</span>
              <span className='text-gray-700'>Price pressure & parity rules: OTAs often force rate parity and prevent direct discounting, preventing you from selling direct at better margins.</span>
            </div>
            <div className='flex items-start'>
              <span className='mr-3 text-red-500 font-bold text-lg'>•</span>
              <span className='text-gray-700'>Slow payouts & holdbacks: Some OTAs delay settlements or retain pre-authorization funds, affecting your cash flow.</span>
            </div>
          </div>
        </div>
      </div>



      {/* FAQ Section */}
      <div className='mb-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100'>
        <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>FAQs</h2>
        <div className='space-y-6'>
          <div className='p-4 bg-gray-50 rounded-xl'>
            <h3 className='text-lg font-bold mb-2 text-gray-900'>Can I list for free and upgrade later?</h3>
            <p className='text-gray-700'>Yes — free listing is immediate; upgrade anytime for extra benefits.</p>
          </div>
          <div className='p-4 bg-gray-50 rounded-xl'>
            <h3 className='text-lg font-bold mb-2 text-gray-900'>Do I still get bookings if I don't subscribe?</h3>
            <p className='text-gray-700'>Yes — free listing gets visibility, but subscribed properties get priority promotion and marketing.</p>
          </div>
          <div className='p-4 bg-gray-50 rounded-xl'>
            <h3 className='text-lg font-bold mb-2 text-gray-900'>How quickly do you pay out?</h3>
            <p className='text-gray-700'>We aim for fast settlements; Scale & Enterprise customers receive priority payout windows.</p>
          </div>
          <div className='p-4 bg-gray-50 rounded-xl'>
            <h3 className='text-lg font-bold mb-2 text-gray-900'>Do you help list on other OTAs?</h3>
            <p className='text-gray-700'>Yes — we facilitate listings and help with channel manager integration where applicable.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='mb-12 p-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg text-center'>
        <h2 className='text-3xl font-bold mb-4 text-white'>Ready to keep 100% of your bookings?</h2>
        <p className='text-xl mb-6 text-blue-100'>Start free listing on KashiBnB today</p>
      </div>
    </div>
  );
};

export default Owner; 