import React from 'react';
import { 
  FaWhatsapp, 
  FaInstagram, 
  FaPhoneAlt, 
  FaShip, 
  FaCar, 
  FaMotorcycle, 
  FaCamera 
} from 'react-icons/fa';
import { GiTempleGate, GiIndiaGate, GiMeditation } from 'react-icons/gi';
import { MdEmojiPeople, MdDirectionsBoat } from 'react-icons/md';
import { IoMdPhotos } from 'react-icons/io';

const Activities = () => {
  return (
    <div className="min-h-screen pt-52 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto  py-8 font-sans  ">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">Kashi Tour Services</h1>
        <p className="text-xl text-blue-600 mb-4">Your One-Stop Guide to Varanasi</p>
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-medium text-blue-800">"We Make Your Stay Hassle-Free!"</p>
          <div className="flex justify-center items-center mt-3 space-x-6">
            <a href="https://wa.me/917355733892" className="flex items-center text-green-600 hover:text-green-800">
              <FaWhatsapp className="mr-2" /> WhatsApp
            </a>
            <a href="tel:+917355733892" className="flex items-center text-blue-600 hover:text-blue-800">
              <FaPhoneAlt className="mr-2" /> +91-7355733892
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Spiritual Experiences */}
        <section className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center mb-4">
            <GiTempleGate className="text-3xl text-yellow-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Spiritual & Temple Experiences</h2>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>VIP Darshan & Mangala Aarti (Kashi Vishwanath)</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Rudra Abhishek & Personalized Pooja</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Pind Daan / Asthi Visarjan</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Sankat Mochan Hanuman Temple</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Kaal Bhairav Temple (The Kotwal of Kashi)</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>New Kashi Vishwanath (Birla Temple, BHU)</span>
            </li>
          </ul>
        </section>

        {/* Sightseeing & Tours */}
        <section className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex items-center mb-4">
            <GiIndiaGate className="text-3xl text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Sightseeing & Local Tours</h2>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Airport Pick-up & Drop – <span className="font-semibold">Starts at ₹700</span></span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Local City Tour & Sarnath Visit</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Ghat Walk & Banarasi Food Tour</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Banarasi Silk Weaving Centre Visit</span>
            </li>
          </ul>
        </section>

        {/* River Experiences */}
        <section className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500">
          <div className="flex items-center mb-4">
            <FaShip className="text-3xl text-teal-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">River & Cruise Experiences</h2>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>Boat Ride in Ganges (Sunrise/Sunset)</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>Luxury Alaknanda Cruise (Booking Available)</span>
            </li>
          </ul>
        </section>

        {/* Transport & Extras */}
        <section className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
          <div className="flex items-center mb-4">
            <FaCar className="text-3xl text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Transport & Extras</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Cab for Outstation Travel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Scooty on Rent 24x7 – <span className="font-semibold">Starts at ₹450</span></span>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Photography Services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Yoga by the Ganges</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Special Offer */}
      <div className="mt-10 bg-gradient-to-r from-yellow-400 to-yellow-600 p-5 rounded-xl text-center text-white shadow-lg">
        <h3 className="text-2xl font-bold mb-2">Special Offer!</h3>
        <p className="text-lg">Book multiple services & get a <span className="font-bold">FREE boat ride!</span></p>
      </div>

      {/* Social Media */}
      <div className="mt-10 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow Us for Discounts</h3>
        <a href="https://instagram.com/yashkashibnb" className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all">
          <FaInstagram className="mr-2 text-xl" /> @YashKashiBNB
        </a>
        <p className="mt-4 text-gray-600">Scan for quick bookings:</p>
        <div className="mt-2 p-3 bg-white inline-block rounded-lg shadow-md">
          {/* Replace with your actual QR code */}
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">
            [WhatsApp QR Code]
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>Contact: Satendra Kumar Giri | +91-7355733892</p>
        <p className="mt-1">© {new Date().getFullYear()} Kashi Tour Services</p>
      </footer>
    </div>
  );
};

export default Activities;