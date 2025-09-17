import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../Components/Tooltip';

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
      <div className='mb-8 p-6 sm:p-8 text-center bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-100 relative overflow-hidden'>
        {/* Background Animation Elements */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
          <div className='absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse'></div>
          <div className='absolute top-20 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-30 animate-bounce'></div>
          <div className='absolute bottom-10 left-1/4 w-12 h-12 bg-blue-300 rounded-full opacity-25 animate-ping'></div>
          <div className='absolute bottom-20 right-1/3 w-14 h-14 bg-indigo-300 rounded-full opacity-20 animate-pulse'></div>
        </div>
        
        <div className='relative z-10'>
          <div className='mb-6'>
            <span className='inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4 animate-fade-in'>
              🎉 Commission-Free Model
            </span>
          </div>
          
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight'>
            Keep <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600'>100%</span> of your bookings
            <br />
            <span className='text-blue-600'>List free on KashiBnB</span>
          </h1>
          
          <div className='flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 text-sm sm:text-base'>
            <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-colors cursor-default'>
              ✓ Commission-Free Plans
            </span>
            <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium hover:bg-green-200 transition-colors cursor-default'>
              ✓ Direct Bookings
            </span>
            <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium hover:bg-purple-200 transition-colors cursor-default'>
              ✓ Grow Revenue
            </span>
          </div>
          
          <p className='text-lg sm:text-xl mb-6 text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Choose a plan that fits your property size — from single flats to multi-room homes
          </p>
          
          <div className='mb-8'>
            <div className='inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
              <span className='mr-2'>💰</span>
              Plans from <span className='text-yellow-300 ml-1'>₹1,499/month</span>
            </div>
          </div>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
        <button
          onClick={() => document.getElementById('subscription-plans').scrollIntoView({ behavior: 'smooth' })}
              className='group px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2'
            >
              <span>View Plans</span>
              <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
              </svg>
            </button>
            
            <button
              onClick={() => navigate('/number')}
              className='group px-6 py-3 rounded-xl font-medium transition-all duration-300 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transform hover:scale-105 flex items-center gap-2'
            >
              <span>📞</span>
              <span>Get Help</span>
        </button>
          </div>
          
          <div className='mt-8 text-sm text-gray-500'>
            <p>No setup fees • Cancel anytime</p>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div id='subscription-plans' className='mb-12'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
              COMMISSION-FREE
            </span>
            <br />
            <span className='text-gray-800'>SUBSCRIPTION PLANS</span>
          </h2>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            Choose the perfect plan for your property size and start earning more today
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-stretch'>
          {/* Starter Plan */}
          <div className='group p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500 opacity-20'></div>
            <h3 className='text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors'>Starter</h3>
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
                <Tooltip content="Create and manage your property listing on KashiBnB platform with no upfront costs. Includes basic property details, photos, and availability calendar." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Free listing on KashiBnB</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Keep 100% of your booking revenue. No commission fees deducted from guest payments - you receive the full amount directly." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Commission-free bookings from guests</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="One-on-one remote training session with our experts to help your staff understand guest management, booking processes, and platform features." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>1 hour remote training for ground staff</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="We guide you through the process of creating accounts and listing your property on other Online Travel Agencies (OTAs) like Booking.com, Airbnb, etc. We provide step-by-step assistance to help you set up your listings and maximize your reach across multiple platforms." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Facilitate listing on other OTAs</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Professional video content created for your property to use on social media platforms, plus promotional boost on KashiBnB's official social channels." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Videography reel for social media + boost on KashiBnB channels</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Professional photo shoot of your property including interior, exterior, and key amenities. High-quality images to attract more guests." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Professional photography (one shoot)</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Comprehensive guide and strategies to increase your property's revenue, including pricing tips, guest experience improvements, and marketing tactics." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Helpdesk: Revenue growth playbook</span>
                </Tooltip>
              </li>
            </ul>
            <button
              onClick={() => navigate('/number')}
              className='group w-full py-3 rounded-xl font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2'
            >
              <span>Choose Plan</span>
              <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
              </svg>
            </button>
          </div>

          {/* Pro Plan */}
          <div className='group p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50 shadow-xl border-2 border-blue-500 relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 transform scale-105 flex flex-col overflow-hidden'>
            <div className='absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl rounded-tr-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white animate-pulse'>
              POPULAR
            </div>
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500'></div>
            <div className='absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500 opacity-10'></div>
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
                <Tooltip content="Extended training session (3 hours) either on-site at your property or remotely. Includes Standard Operating Procedures (SOPs) for guest management, check-in/check-out processes, and quality standards." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>3 hours on-site / remote staff training & SOPs</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Your property gets higher visibility in search results on KashiBnB platform, plus weekly promotional posts on our social media channels to drive more bookings." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Priority placement in search & weekly social boost</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Professional video content in both short (30-60 seconds) and long (2-3 minutes) formats for different social media platforms, plus bi-weekly promotional campaigns on KashiBnB channels." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Videography reel (short + long cut) + twice monthly promotion</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Integration with channel management systems to sync your availability and rates across multiple booking platforms (Booking.com, Airbnb, etc.) automatically." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Channel manager integration & OTA sync help</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Detailed monthly analytics report showing your booking performance, revenue trends, and personalized pricing recommendations to maximize your income." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Monthly performance report & pricing tips</span>
                </Tooltip>
              </li>
            </ul>
            <button
              onClick={() => navigate('/number')}
              className='group w-full py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2'
            >
              <span>Choose Plan</span>
              <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
              </svg>
            </button>
          </div>

          {/* Scale Plan */}
          <div className='group p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500 opacity-20'></div>
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
                <Tooltip content="Comprehensive 5-hour on-site training session at your property, plus a detailed Standard Operating Procedures manual covering all aspects of guest management, maintenance, and quality standards." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Onboarding: 5 hours on-site training + SOP manual</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Your personal account manager available via phone and WhatsApp for immediate support, strategic guidance, and assistance with any property management needs." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Dedicated account manager (phone & WhatsApp)</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Enhanced marketing support with featured campaigns, priority placement in promotional materials, and higher budget allocation for your property's marketing efforts." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Higher marketing allocation (featured campaigns)</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Advanced analytics and AI-powered pricing recommendations that automatically adjust your rates based on demand, seasonality, local events, and competitor pricing to maximize revenue." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Advanced revenue optimisation + dynamic pricing guidance</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Professional photo shoot every quarter to keep your listing fresh, plus a complete social media creative pack with ready-to-use posts, stories, and promotional materials." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Quarterly photoshoot & social media creative pack</span>
                </Tooltip>
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
          <div className='group p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500 opacity-20'></div>
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
                <Tooltip content="A dedicated team of account managers, marketing specialists, and operations experts assigned exclusively to your property, plus monthly on-site quality audits and performance reviews." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Dedicated account team & monthly on-site audits</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Tailored marketing strategy including email campaigns, paid advertising on Google and social media, and custom distribution plans across multiple channels to maximize your property's visibility." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Custom marketing & distribution plan (email + paid ads)</span>
                </Tooltip>
              </li>

              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Priority customer support for booking inquiries and faster payment settlements with expedited payout processing to improve your cash flow." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Priority booking support & settlement (faster payouts)</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="Flexible pricing structure tailored to your property size and requirements. Contact our sales team for a custom quote and personalized onboarding process designed specifically for your business needs." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Custom pricing — call for quote & bespoke onboarding</span>
                </Tooltip>
              </li>
              <li className='flex items-start'>
                <span className='mr-2 text-green-500 font-bold'>✓</span>
                <Tooltip content="AI-powered chatbot available 24/7 to handle guest inquiries, booking questions, and provide instant support for your business operations, reducing your workload and improving guest experience." position="bottom">
                  <span className='text-gray-700 text-sm cursor-help hover:text-blue-600 transition-colors'>Dedicated chatbot for 24/7 business support & help</span>
                </Tooltip>
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
      <div className='mb-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md border border-green-200 text-center'>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-lg'>🎉</span>
            <span className='font-semibold text-green-800'>Free Listing Available</span>
          </div>
          <div className='hidden sm:block w-px h-6 bg-green-300'></div>
          <p className='text-sm text-gray-600'>Basic visibility • Commission-free bookings</p>
          <button
            onClick={() => navigate('/add-listing')}
            className='px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors'
          >
            Start Free
          </button>
        </div>
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
        
        <div className='shadow-lg rounded-lg' style={{ overflowX: 'auto', overflowY: 'visible' }}>
          <table className='w-full border-collapse border border-gray-300 rounded-lg min-w-[800px] sm:min-w-[1000px]'>
            <thead>
              <tr className='bg-gray-50'>
                 <th className='border border-gray-300 px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-bold text-gray-900 text-xs sm:text-sm'>Platform/Plan</th>
                 <th className='border border-gray-300 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-bold text-gray-900 text-xs sm:text-sm'>
                   <Tooltip content="Commission rate charged by each platform on your bookings. This percentage is deducted from your total revenue before you receive payment." position="bottom">
                     <span className='cursor-help hover:text-blue-600 transition-colors'>Commission</span>
                   </Tooltip>
                 </th>
                 <th className='border border-gray-300 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-bold text-gray-900 text-xs sm:text-sm'>
                   <Tooltip content="Monthly subscription fee for KashiBnB plans. Other OTAs don't charge subscription fees but take higher commissions instead." position="bottom">
                     <span className='cursor-help hover:text-blue-600 transition-colors'>Fee</span>
                   </Tooltip>
                 </th>
                 <th className='border border-gray-300 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-bold text-gray-900 text-xs sm:text-sm'>
                   <Tooltip content="Total amount you pay to the platform = Commission amount + Subscription fee. This is the total cost of using each platform." position="bottom">
                     <span className='cursor-help hover:text-blue-600 transition-colors'>Total Pay</span>
                   </Tooltip>
                 </th>
                 <th className='border border-gray-300 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-bold text-gray-900 text-xs sm:text-sm'>
                   <Tooltip content="Your net income after deducting all platform costs. Calculated as: Total Revenue - Commission - Subscription Fee = Your Income" position="bottom">
                     <span className='cursor-help hover:text-blue-600 transition-colors'>Your Income</span>
                   </Tooltip>
                 </th>
                 <th className='border border-gray-300 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-bold text-gray-900 text-xs sm:text-sm'>
                   <Tooltip content="Percentage and amount more you earn with KashiBnB compared to other platforms. Calculated as: (KashiBnB Income - Other Platform Income) / Other Platform Income × 100" position="bottom">
                     <span className='cursor-help hover:text-blue-600 transition-colors'>% More with KashiBnB</span>
                   </Tooltip>
                 </th>
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

                // Find the top KashiBnB plan (highest earning KashiBnB plan)
                const topKashiPlan = platforms.find(p => p.isKashi && p.earnings === Math.max(...platforms.filter(p => p.isKashi).map(p => p.earnings)));

                return platforms.map((platform, index) => {
                  // Calculate net profit/loss: profit - loss
                  const netProfitLoss = platform.profit - platform.loss;
                  const isPositive = netProfitLoss > 0;
                  
                  // Calculate percentage more with KashiBnB
                  let percentageMore = '';
                  if (!platform.isKashi && topKashiPlan) {
                    const difference = topKashiPlan.earnings - platform.earnings;
                    const percentage = Math.round((difference / platform.earnings) * 100);
                    const amount = difference;
                    percentageMore = `${percentage}% (₹${amount.toLocaleString()})`;
                  } else if (platform.isKashi) {
                    percentageMore = '—';
                  }
                  
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
                       <td className={`border border-gray-300 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center font-bold text-xs sm:text-sm ${platform.isKashi ? 'text-green-600' : 'text-green-600'}`}>
                         {percentageMore}
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
      <div className='mb-12 p-6 sm:p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg border border-red-200'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-3 text-red-800'>Why other platforms eat your earnings</h2>
          <p className='text-sm sm:text-base text-red-600 font-medium'>Discover the hidden costs that reduce your profits</p>
        </div>
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
          <div className='space-y-4 sm:space-y-6'>
            <div className='flex items-start p-4 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow'>
              <div className='flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-0.5'>
                <span className='text-red-600 font-bold text-sm'>1</span>
              </div>
              <div>
                <h3 className='font-bold text-red-800 mb-2 text-sm sm:text-base'>High Commission Fees</h3>
                <p className='text-gray-700 text-sm sm:text-base leading-relaxed'>OTAs commonly take <span className='font-semibold text-red-600'>10–25% per booking</span> — that's revenue that never reaches your pocket.</p>
              </div>
            </div>
            
            <div className='flex items-start p-4 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow'>
              <div className='flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-0.5'>
                <span className='text-red-600 font-bold text-sm'>2</span>
              </div>
              <div>
                <h3 className='font-bold text-red-800 mb-2 text-sm sm:text-base'>Listing & Marketing Costs</h3>
                <p className='text-gray-700 text-sm sm:text-base leading-relaxed'>To rank on OTAs you often need to <span className='font-semibold text-red-600'>discount, invest in promotions</span> or pay for visibility.</p>
              </div>
            </div>
            
            <div className='flex items-start p-4 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow'>
              <div className='flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-0.5'>
                <span className='text-red-600 font-bold text-sm'>3</span>
              </div>
              <div>
                <h3 className='font-bold text-red-800 mb-2 text-sm sm:text-base'>Hidden Payment Fees</h3>
                <p className='text-gray-700 text-sm sm:text-base leading-relaxed'>Multiple hidden charges <span className='font-semibold text-red-600'>(payment gateway fees, service fees)</span> reduce your effective rate.</p>
              </div>
            </div>
          </div>
          
          <div className='space-y-4 sm:space-y-6'>
            <div className='flex items-start p-4 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow'>
              <div className='flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-0.5'>
                <span className='text-red-600 font-bold text-sm'>4</span>
              </div>
              <div>
                <h3 className='font-bold text-red-800 mb-2 text-sm sm:text-base'>Price Pressure & Parity Rules</h3>
                <p className='text-gray-700 text-sm sm:text-base leading-relaxed'>OTAs often force <span className='font-semibold text-red-600'>rate parity</span> and prevent direct discounting, limiting your pricing flexibility.</p>
              </div>
            </div>
            
            <div className='flex items-start p-4 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow'>
              <div className='flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-0.5'>
                <span className='text-red-600 font-bold text-sm'>5</span>
              </div>
              <div>
                <h3 className='font-bold text-red-800 mb-2 text-sm sm:text-base'>Slow Payouts & Holdbacks</h3>
                <p className='text-gray-700 text-sm sm:text-base leading-relaxed'>Some OTAs <span className='font-semibold text-red-600'>delay settlements</span> or retain pre-authorization funds, affecting your cash flow.</p>
              </div>
            </div>
            
            <div className='p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200'>
              <div className='flex items-center mb-2'>
                <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3'>
                  <span className='text-white font-bold text-xs'>✓</span>
                </div>
                <h3 className='font-bold text-green-800 text-sm sm:text-base'>The Solution</h3>
              </div>
              <p className='text-gray-700 text-sm sm:text-base leading-relaxed'>With KashiBnB's <span className='font-semibold text-green-600'>commission-free model</span>, you keep 100% of your booking revenue and avoid all these hidden costs.</p>
            </div>
          </div>
        </div>
      </div>



      {/* FAQ Section */}
      <div className='mb-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100'>
        <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>FAQs</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
              <p className='text-gray-700'>We process payouts <span className='font-semibold text-green-600'>within 24 hours</span> when guests checkout.</p>
          </div>
          <div className='p-4 bg-gray-50 rounded-xl'>
            <h3 className='text-lg font-bold mb-2 text-gray-900'>Do you help list on other OTAs?</h3>
            <p className='text-gray-700'>Yes — we facilitate listings and help with channel manager integration where applicable.</p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='text-lg font-bold mb-2 text-gray-900'>What's the difference between plans?</h3>
              <p className='text-gray-700'>Starter (2BHK or less), Pro (2-5 rooms), Scale (5-10 rooms), Enterprise (10+ rooms). Higher plans include more training, marketing support, and dedicated account management.</p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='text-lg font-bold mb-2 text-gray-900'>Can I change my plan anytime?</h3>
              <p className='text-gray-700'>Yes — you can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.</p>
            </div>
          </div>
          
          <div className='space-y-6'>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='text-lg font-bold mb-2 text-gray-900'>Is there a setup fee or hidden costs?</h3>
              <p className='text-gray-700'>No setup fees, no hidden costs. You only pay the monthly subscription fee and keep 100% of your booking revenue.</p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='text-lg font-bold mb-2 text-gray-900'>How do I manage my bookings?</h3>
              <p className='text-gray-700'>You get access to our owner dashboard where you can manage bookings, update availability, view analytics, and communicate with guests.</p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='text-lg font-bold mb-2 text-gray-900'>What support do I get?</h3>
              <p className='text-gray-700'>All plans include helpdesk support. Pro+ plans get dedicated account managers and priority support channels.</p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='text-lg font-bold mb-2 text-gray-900'>Can I cancel anytime?</h3>
              <p className='text-gray-700'>Yes — no long-term contracts. You can cancel anytime and your listing remains active until the end of your billing period.</p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='text-lg font-bold mb-2 text-gray-900'>Do you provide photography services?</h3>
              <p className='text-gray-700'>Yes — Starter plan includes one professional photoshoot, Pro+ plans get quarterly photoshoots, and Enterprise gets custom photography packages.</p>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl'>
              <h3 className='text-lg font-bold mb-2 text-gray-900'>How do I get started?</h3>
              <p className='text-gray-700'>Simply click "Choose Plan" or contact us via the call button. We'll guide you through the entire setup process step by step.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='mb-12 p-8 sm:p-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl text-center relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
          <div className='absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse'></div>
          <div className='absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full opacity-15 animate-bounce'></div>
          <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-20 animate-ping'></div>
        </div>
        <div className='relative z-10'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight'>
            Ready to keep <span className='text-yellow-300'>100%</span> of your bookings?
          </h2>
          <p className='text-xl mb-8 text-blue-100 max-w-2xl mx-auto'>Start free listing on KashiBnB today and join thousands of successful property owners</p>
          <div className='flex justify-center items-center'>
            <button
              onClick={() => navigate('/number')}
              className='group px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2'
            >
              <span>📞</span>
              <span>Get Help</span>
            </button>
          </div>
          <div className='mt-6 text-blue-200 text-sm'>
            <p>✨ No setup fees • Cancel anytime • 24/7 support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner; 