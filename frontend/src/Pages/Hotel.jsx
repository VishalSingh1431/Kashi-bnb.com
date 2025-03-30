import React, { useState } from 'react';
import { FiChevronRight, FiChevronLeft, FiMapPin, FiHeart } from 'react-icons/fi';
import { FaWifi, FaParking, FaSwimmingPool, FaHotTub } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Hotel = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const images = [
    'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NzMxNjcyODcyNTg1MTAzNjU4/original/8f8356a9-3f0a-497a-a23c-17755d3b4677.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NzMxNjcyODcyNTg1MTAzNjU4/original/8f8356a9-3f0a-497a-a23c-17755d3b4677.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NzMxNjcyODcyNTg1MTAzNjU4/original/8f8356a9-3f0a-497a-a23c-17755d3b4677.jpeg?im_w=1200',
  ];

  const amenities = [
    { icon: <FaWifi />, name: 'Wifi' },
    { icon: <FaParking />, name: 'Free parking' },
    { icon: <FaSwimmingPool />, name: 'Pool' },
    { icon: <FaHotTub />, name: 'Hot tub' },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      
      {/* Hotel Name */}
      <h1 className="text-2xl font-bold mb-2">Luxury Villa with Private Pool and Ocean View</h1>

     
      {/* Image Gallery */}
      <div className="relative mb-8 rounded-xl overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img 
            src={images[currentImageIndex]} 
            alt="Hotel" 
            className="w-full max-h-1/4 object-cover"
          />
        </div>
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <button 
            onClick={prevImage}
            className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <button 
            onClick={nextImage}
            className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
        <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1}/{images.length}
        </div>
      </div>
         {/* Location - Removed rating */}
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <FiMapPin className="mr-1" />
          <span>Malibu, California, United States</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2">
          {/* Property Details */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
              <div>
                <h2 className="font-semibold">Hosted by John</h2>
                <p className="text-gray-600">10 years hosting</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-gray-500">Guests</p>
                <p className="font-medium">9</p>
              </div>
              <div>
                <p className="text-gray-500">Bedrooms</p>
                <p className="font-medium">3</p>
              </div>
              <div>
                <p className="text-gray-500">Beds</p>
                <p className="font-medium">3</p>
              </div>
              <div>
                <p className="text-gray-500">Bathrooms</p>
                <p className="font-medium">3</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About this place</h2>
            <p className={`text-gray-700 ${!showFullDescription ? 'line-clamp-4' : ''}`}>
              This stunning luxury villa offers breathtaking ocean views from every room. 
              The property features a private infinity pool, spacious outdoor living areas, 
              and high-end finishes throughout. The open-concept living space is perfect 
              for entertaining, with floor-to-ceiling windows that showcase the spectacular 
              sunset views. The gourmet kitchen is equipped with top-of-the-line appliances 
              and a large island with seating. Each bedroom has its own en-suite bathroom 
              and private balcony. Located just minutes from the beach and local restaurants, 
              this is the perfect retreat for those seeking luxury and relaxation.
              {showFullDescription && (
                <div className="mt-4">
                  <p>
                    The master suite features a king-size bed, walk-in closet, and a spa-like 
                    bathroom with a soaking tub and rain shower. The additional bedrooms are 
                    equally spacious and comfortable, each with premium linens and blackout 
                    curtains for a perfect night's sleep.
                  </p>
                  <p className="mt-2">
                    Outdoor amenities include a gas BBQ, outdoor dining area, and lounge chairs 
                    surrounding the pool. The property is fully gated for privacy and security, 
                    with parking for up to 3 cars.
                  </p>
                </div>
              )}
            </p>
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 font-semibold underline"
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          </div>

          {/* Amenities */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-xl mr-3">{amenity.icon}</span>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 border border-black rounded-lg px-4 py-2 font-medium">
              Show all amenities
            </button>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Where you'll be</h2>
            <div className="h-64 bg-gray-200 rounded-xl mb-4">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.037072772319!2d-118.6773535847846!3d34.03704688060939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e81da9b4a9f3a5%3A0x9b4a9f3a5b4a9f3a5!2sMalibu%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy"
                className="rounded-xl"
              ></iframe>
            </div>
            <p className="text-gray-700">Malibu, California, United States</p>
          </div>
        </div>

        {/* Right Column - Booking Widget */}
        <div className="md:col-span-1">
          <div className="sticky top-4 border rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xl font-semibold">$450 <span className="text-base font-normal">night</span></p>
              </div>
            </div>
            
            {/* Calendar for Check-in/Check-out */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold block mb-1">CHECK-IN</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Add date"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">CHECKOUT</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Add date"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="text-xs font-semibold block mb-1">GUESTS</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                  <option>5+ guests</option>
                </select>
              </div>
            </div>
            
            <button className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
              Reserve
            </button>
            
            <p className="text-center mt-4 text-sm text-gray-600">You won't be charged yet</p>
            
            <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-gray-600">$450 x 5 nights</p>
              </div>
              <div className="text-right">
                <p>$2,250</p>
              </div>
              <div>
                <p className="text-gray-600">Cleaning fee</p>
              </div>
              <div className="text-right">
                <p>$150</p>
              </div>
              <div>
                <p className="text-gray-600">Service fee</p>
              </div>
              <div className="text-right">
                <p>$240</p>
              </div>
              <div className="col-span-2 border-t mt-2 pt-4">
                <div className="flex justify-between font-semibold">
                  <p>Total</p>
                  <p>$2,640</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;