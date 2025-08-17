import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown, Phone } from "lucide-react";
import Profile from "./Profile";
import NumberForm from "./NumberForm";
import { useAuth } from "../App";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [whyKashiOpen, setWhyKashiOpen] = useState(false);
  const [mobileWhyKashiOpen, setMobileWhyKashiOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="shadow-md p-3 md:p-4 opacity absolute z-10 w-full h-auto overflow-visible" style={{ backgroundColor: '#f3eadb' }}>
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center overflow-visible">
        {/* Logo - Left Side */}
        <div className="flex-shrink-0 mr-auto border-0 outline-none">
          <Link to="/" className="focus:outline-none border-0 outline-none">
            <img
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg border-0"
              src="/images/newlogo.jpg"
              alt="Logo"
            />
          </Link>
        </div>

        {/* Right Side - All Navigation Items */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 ml-auto">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none text-black p-2 hover:bg-orange-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
            <ul className="flex gap-6 lg:gap-8 xl:gap-10 font-bold text-black text-xl border-0">
              <li className="rounded-2xl py-3 px-4 md:px-6 lg:px-8 transition-all duration-300 border-0 hover:scale-105 active:scale-95 group">
                <Link to="/" className="cursor-pointer focus:outline-none border-0 outline-none block w-full h-full text-black group-hover:text-orange-600 group-active:text-orange-800">
                  Home
                </Link>
              </li>
              
              {/* Desktop Why KashiBnB Dropdown */}
              <li 
                className="relative rounded-2xl py-3 px-4 md:px-6 lg:px-8 transition-all duration-300 border-0 hover:scale-105 active:scale-95 group"
                onMouseEnter={() => setWhyKashiOpen(true)}
                onMouseLeave={() => setWhyKashiOpen(false)}
              >
                <div className="flex items-center gap-2 cursor-pointer border-0 text-black group-hover:text-orange-600 group-active:text-orange-800 pb-4">
                  Why KashiBnB
                  <ChevronDown className={`transition-transform ${whyKashiOpen ? 'rotate-180' : ''}`} size={18} />
                </div>
                {whyKashiOpen && (
                  <div 
                    className="absolute left-0 mt-0 w-44 rounded-lg py-2 z-30 border-0 transition-all duration-300"
                    style={{ 
                      backgroundColor: '#f3eadb',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)',
                      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
                    }}
                  >
                    <Link
                      to="/owner"
                      className="block px-4 py-2 font-bold text-black hover:text-orange-600 focus:outline-none border-0 transition-all duration-200 rounded-md"
                    >
                      For Owner
                    </Link>
                    <Link
                      to="/tourist"
                      className="block px-4 py-2 font-bold text-black hover:text-orange-600 focus:outline-none border-0 transition-all duration-200 rounded-md"
                    >
                      For Tourist
                    </Link>
                  </div>
                )}
              </li>

              {/* Direct link to Tours in desktop menu */}
              <li className="rounded-2xl py-3 px-4 md:px-6 lg:px-8 transition-all duration-300 border-0 hover:scale-105 active:scale-95 group">
                <Link to="/tour" className="cursor-pointer focus:outline-none border-0 block w-full h-full text-black group-hover:text-orange-600 group-active:text-orange-800">
                   Tour & Travels
                </Link>
              </li>

              <li className="rounded-2xl py-3 px-4 md:px-6 lg:px-8 transition-all duration-300 border-0 hover:scale-105 active:scale-95 group">
                <Link to="/add-listing" className="cursor-pointer focus:outline-none border-0 block w-full h-full text-black group-hover:text-orange-600 group-active:text-orange-800">
                  Add Your Listing
                </Link>
              </li>
              <li className="rounded-2xl py-3 px-4 md:px-6 lg:px-8 transition-all duration-300 border-0 hover:scale-105 active:scale-95 group">
                <Link to="/number" className="flex items-center gap-2 cursor-pointer focus:outline-none border-0 block w-full h-full text-black group-hover:text-orange-600 group-active:text-orange-800">
                  <Phone size={20} /> Call Us
                </Link>
              </li>
            </ul>

            {isLoggedIn ? (
              <div className="relative border-0 overflow-visible">
                <div 
                  className="flex flex-col border-0 overflow-visible p-4"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button className="flex items-center gap-2 py-3 px-6 rounded-2xl text-lg font-bold text-black transition-all duration-300 cursor-pointer focus:outline-none border-0 hover:text-orange-600 hover:scale-105 active:text-orange-800 active:scale-95">
                    <User size={20} />
                    {user.first_name || user.name || "Profile"}
                  </button>
                  <div 
                    className={`absolute top-full right-0 mt-0 w-40 rounded-lg py-2 z-50 border-0 transition-all duration-300 ${isProfileOpen ? 'block' : 'hidden'}`}
                    style={{ 
                      backgroundColor: '#f3eadb',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)',
                      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
                    }}
                    onMouseEnter={() => setIsProfileOpen(true)}
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <Link
                      to="/profile"
                      className="block w-full px-3 py-2 font-bold text-black hover:text-orange-600 hover:bg-orange-50 focus:outline-none border-0 transition-all duration-200 rounded-md text-center"
                    >
                      My Profile
                    </Link>
                    {user?.is_admin && (
                      <>
                        <div className="border-t border-gray-300 my-1 mx-2"></div>
                        <Link
                          to="/admin/requests"
                          className="block w-full px-3 py-2 font-bold text-black hover:text-orange-600 hover:bg-orange-50 focus:outline-none border-0 transition-all duration-200 rounded-md text-center"
                        >
                          Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-300 my-1 mx-2"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-3 py-2 font-bold text-black hover:text-orange-600 hover:bg-orange-50 focus:outline-none border-0 transition-all duration-200 rounded-md text-center"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-black rounded-3xl py-3 px-6 text-lg font-bold transition-all duration-300 cursor-pointer focus:outline-none border-0 hover:text-orange-600 hover:scale-105 active:text-orange-800 active:scale-95"
                style={{ backgroundColor: '#f3eadb' }}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isOpen && (
          <div className="fixed inset-0 bg-opacity-95 z-50 transition-all duration-300 ease-in-out" style={{ backgroundColor: '#f3eadb' }}>
            <div className="relative h-full w-full flex flex-col items-center overflow-y-auto pt-16 pb-8 animate-in slide-in-from-top-2 duration-300">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <X size={28} className="text-black" />
              </button>

              {/* Mobile Menu Items */}
              <div className="w-full max-w-sm px-6 space-y-6 animate-in fade-in duration-500 delay-100">
                <ul className="space-y-4">
                  <li className="rounded-2xl py-3 px-6 text-center transition-all duration-300 hover:scale-105 active:scale-95 group" style={{ backgroundColor: '#f3eadb' }}>
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-xl font-bold text-black focus:outline-none group-hover:text-orange-600 group-active:text-orange-800"
                    >
                      Home
                    </Link>
                  </li>
                </ul>
                
                {/* Main Navigation Items with extra spacing */}
                <ul className="space-y-4 pt-4">
                  {/* Mobile Why KashiBnB Dropdown */}
                  <li className="rounded-2xl py-3 px-6 text-center transition-all duration-300 hover:scale-105 active:scale-95 group" style={{ backgroundColor: '#f3eadb' }}>
                    <div className="flex flex-col items-center">
                      <button 
                        onClick={() => setMobileWhyKashiOpen(!mobileWhyKashiOpen)}
                        className="flex items-center justify-center gap-2 text-xl font-bold text-black focus:outline-none group-hover:text-orange-600 group-active:text-orange-800"
                      >
                        Why KashiBnB
                        <ChevronDown className={`transition-transform ${mobileWhyKashiOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileWhyKashiOpen && (
                        <div className="w-full mt-3 space-y-2">
                          <Link
                            to="/owner"
                            onClick={() => setIsOpen(false)}
                            className="block w-full py-2 text-lg font-bold text-black rounded-lg focus:outline-none hover:text-orange-600 transition-all duration-200 hover:bg-orange-50"
                          >
                            For Owner
                          </Link>
                          <Link
                            to="/tourist"
                            onClick={() => setIsOpen(false)}
                            className="block w-full py-2 text-lg font-bold text-black rounded-lg focus:outline-none hover:text-orange-600 transition-all duration-200 hover:bg-orange-50"
                          >
                            For Tourist
                          </Link>
                        </div>
                      )}
                    </div>
                  </li>

                  {/* Tour & Travels */}
                  <li className="rounded-2xl py-3 px-6 text-center transition-all duration-300 hover:scale-105 active:scale-95 group" style={{ backgroundColor: '#f3eadb' }}>
                    <Link
                      to="/tour"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-xl font-bold text-black focus:outline-none group-hover:text-orange-600 group-active:text-orange-800"
                    >
                       Tour & Travels
                    </Link>
                  </li>

                  {/* Add Your Listing */}
                  <li className="rounded-2xl py-3 px-6 text-center transition-all duration-300 hover:scale-105 active:scale-95 group" style={{ backgroundColor: '#f3eadb' }}>
                    <Link
                      to="/add-listing"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-xl font-bold text-black focus:outline-none group-hover:text-orange-600 group-active:text-orange-800"
                    >
                      Add Your Listing
                    </Link>
                  </li>

                  {/* Call Us */}
                  <li className="rounded-2xl py-3 px-6 text-center transition-all duration-300 hover:scale-105 active:scale-95 group" style={{ backgroundColor: '#f3eadb' }}>
                    <Link
                      to="/number"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 text-xl font-bold text-black focus:outline-none group-hover:text-orange-600 group-active:text-orange-800"
                    >
                      <Phone size={20} /> Call Us
                    </Link>
                  </li>
                </ul>

                {/* Authentication Section */}
                {isLoggedIn ? (
                  <div className="pt-4 border-t-2 border-orange-200">
                    <ul className="space-y-4">
                      <li className="rounded-2xl py-3 px-6 text-center transition-all duration-300 hover:scale-105 active:scale-95 group" style={{ backgroundColor: '#f3eadb' }}>
                        <Link
                          to="/profile"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 text-xl font-bold text-black focus:outline-none group-hover:text-orange-600 group-active:text-orange-800"
                        >
                          <User size={20} />
                          {user.first_name || user.name || "Profile"}
                        </Link>
                      </li>
                      {user?.is_admin && (
                        <li className="rounded-2xl py-3 px-6 text-center transition-all duration-300 hover:scale-105 active:scale-95 group" style={{ backgroundColor: '#f3eadb' }}>
                          <Link
                            to="/admin/requests"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 text-xl font-bold text-black focus:outline-none group-hover:text-orange-600 group-active:text-orange-800"
                          >
                            Admin Panel
                          </Link>
                        </li>
                      )}
                      <li className="pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full py-3 px-6 rounded-2xl text-xl font-bold text-black transition-all duration-300 focus:outline-none hover:text-orange-600 hover:scale-105 active:text-orange-800 active:scale-95 hover:bg-orange-100"
                          style={{ backgroundColor: '#f3eadb' }}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="pt-4 border-t-2 border-orange-200">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full py-3 px-6 rounded-2xl text-xl font-bold text-black transition-all duration-300 focus:outline-none hover:text-orange-600 hover:scale-105 active:text-orange-800 active:scale-95 hover:bg-orange-100 text-center"
                      style={{ backgroundColor: '#f3eadb' }}
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;