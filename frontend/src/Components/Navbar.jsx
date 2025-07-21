import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown, Phone } from "lucide-react";
import Profile from "./Profile";
import NumberForm from "./NumberForm";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [whyKashiOpen, setWhyKashiOpen] = useState(false);
  const [mobileWhyKashiOpen, setMobileWhyKashiOpen] = useState(false);
  const [tourTravelOpen, setTourTravelOpen] = useState(false);
  const [mobileTourTravelOpen, setMobileTourTravelOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token") !== null;
  
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : {};
    } catch (error) {
      console.error("Error parsing user data:", error);
      return {};
    }
  };
  const user = getUserData();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <nav className="shadow-md p-4 opacity absolute z-10 w-full h-auto" style={{ backgroundColor: '#f3eadb' }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link to="/">
            <img
              className="w-10 h-10 md:w-25 md:h-25 rounded-lg"
              src="/images/newlogo.jpg"
              alt="Logo"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-black p-2"
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isOpen && (
          <div className="fixed inset-0 bg-opacity-95 z-20 transition-opacity duration-300" style={{ backgroundColor: '#f3eadb' }}>
            <div className="relative h-full w-full flex flex-col items-center overflow-y-auto">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2"
              >
                <X size={30} className="text-black" />
              </button>

              <ul className="pt-20 px-4 w-full max-w-md space-y-4">
                <li className="rounded-2xl py-2 px-4 text-center" style={{ backgroundColor: '#f3eadb' }}>
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-xl font-bold text-black"
                  >
                    Home
                  </Link>
                </li>
                
                {/* Mobile Why KashiBnB Dropdown - Centered */}
                <li className="rounded-2xl py-2 px-4 text-center" style={{ backgroundColor: '#f3eadb' }}>
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => setMobileWhyKashiOpen(!mobileWhyKashiOpen)}
                      className="flex items-center justify-center gap-2 text-xl font-bold text-black"
                    >
                      Why KashiBnB
                      <ChevronDown className={`transition-transform ${mobileWhyKashiOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileWhyKashiOpen && (
                      <div className="w-full mt-2 space-y-2">
                        <Link
                          to="/owner"
                          onClick={() => setIsOpen(false)}
                          className="block w-full py-2 text-lg font-bold text-black rounded-lg"
                        >
                          For Owner
                        </Link>
                        <Link
                          to="/tourist"
                          onClick={() => setIsOpen(false)}
                          className="block w-full py-2 text-lg font-bold text-black rounded-lg"
                        >
                          For Tourist
                        </Link>
                      </div>
                    )}
                  </div>
                </li>

                {/* Mobile Tour & Travels Dropdown - Centered */}
                <li className="rounded-2xl py-2 px-4 text-center" style={{ backgroundColor: '#f3eadb' }}>
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => setMobileTourTravelOpen(!mobileTourTravelOpen)}
                      className="flex items-center justify-center gap-2 text-xl font-bold text-black"
                    >
                      Tour & Travels
                      <ChevronDown className={`transition-transform ${mobileTourTravelOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileTourTravelOpen && (
                      <div className="w-full mt-2 space-y-2">
                        <Link
                          to="/tours"
                          onClick={() => setIsOpen(false)}
                          className="block w-full py-2 text-lg font-bold text-black rounded-lg"
                        >
                          Tours
                        </Link>
                        <Link
                          to="/travel-packages"
                          onClick={() => setIsOpen(false)}
                          className="block w-full py-2 text-lg font-bold text-black rounded-lg"
                        >
                          Travel Packages
                        </Link>
                      </div>
                    )}
                  </div>
                </li>

                <li className="rounded-2xl py-2 px-4 text-center" style={{ backgroundColor: '#f3eadb' }}>
                  <Link
                    to="/add-listing"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-xl font-bold text-black"
                  >
                    Add Your Listing
                  </Link>
                </li>
                <li className="rounded-2xl py-2 px-4 text-center" style={{ backgroundColor: '#f3eadb' }}>
                  <Link
                    to="/number"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 text-xl font-bold text-black"
                  >
                    <Phone size={20} /> Call Us
                  </Link>
                </li>

                {isLoggedIn ? (
                  <>
                    <li className="rounded-2xl py-2 px-4 text-center" style={{ backgroundColor: '#f3eadb' }}>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 text-xl font-bold text-black"
                      >
                        <User size={20} />
                        {user.name || "Profile"}
                      </Link>
                    </li>
                    <li className="mt-8 flex justify-center">
                      <button
                        onClick={handleLogout}
                        className="w-full max-w-xs text-center py-3 px-6 rounded-2xl text-xl font-bold text-black transition-colors"
                        style={{ backgroundColor: '#f3eadb' }}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="mt-8 flex justify-center">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full max-w-xs text-center py-3 px-6 rounded-2xl text-xl font-bold text-black transition-colors"
                      style={{ backgroundColor: '#f3eadb' }}
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5">
          <ul className="flex gap-5 font-bold text-black text-xl">
            <li className="rounded-2xl py-2 px-4 transition-colors">
              <Link to="/" className="cursor-pointer">
                Home
              </Link>
            </li>
            
            {/* Desktop Why KashiBnB Dropdown */}
            <li 
              className="relative rounded-2xl py-2 px-4 transition-colors"
              onMouseEnter={() => setWhyKashiOpen(true)}
              onMouseLeave={() => setWhyKashiOpen(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                Why KashiBnB
                <ChevronDown className={`transition-transform ${whyKashiOpen ? 'rotate-180' : ''}`} size={18} />
              </div>
              {whyKashiOpen && (
                <div className="border absolute left-0 mt-2 w-48 rounded-md py-1 z-30 shadow-lg" style={{ backgroundColor: '#f3eadb' }}>
                  <Link
                    to="/owner"
                    className="block px-4 py-2 font-bold text-black hover:bg-gray-100"
                  >
                    For Owner
                  </Link>
                  <Link
                    to="/tourist"
                    className="block px-4 py-2 font-bold text-black hover:bg-gray-100"
                  >
                    For Tourist
                  </Link>
                </div>
              )}
            </li>

            {/* Desktop Tour & Travels Dropdown */}
            <li 
              className="relative rounded-2xl py-2 px-4 transition-colors"
              onMouseEnter={() => setTourTravelOpen(true)}
              onMouseLeave={() => setTourTravelOpen(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                Tour & Travels
                <ChevronDown className={`transition-transform ${tourTravelOpen ? 'rotate-180' : ''}`} size={18} />
              </div>
              {tourTravelOpen && (
                <div className="border absolute left-0 mt-2 w-48 rounded-md py-1 z-30 shadow-lg" style={{ backgroundColor: '#f3eadb' }}>
                  <Link
                    to="/tours"
                    className="block px-4 py-2 font-bold text-black hover:bg-gray-100"
                  >
                    Tours
                  </Link>
                  <Link
                    to="/travel-packages"
                    className="block px-4 py-2 font-bold text-black hover:bg-gray-100"
                  >
                    Travel Packages
                  </Link>
                </div>
              )}
            </li>

            <li className="rounded-2xl py-2 px-4 transition-colors">
              <Link to="/add-listing" className="cursor-pointer">
                Add Your Listing
              </Link>
            </li>
            <li className="rounded-2xl py-2 px-4 transition-colors">
              <Link to="/number" className="flex items-center gap-1 cursor-pointer">
                <Phone size={20} /> Call Us
              </Link>
            </li>
          </ul>

          {isLoggedIn ? (
            <div className="relative">
              <div 
                className="flex flex-col"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <button className="flex items-center gap-2 py-3 px-6 rounded-2xl text-lg font-bold text-black transition-colors cursor-pointer">
                  <User size={20} />
                  {user.name || "Profile"}
                </button>
                <div 
                  className={`border absolute top-full left-0 right-0 rounded-md shadow-lg py-1 z-30 ${isProfileOpen ? 'block' : 'hidden'}`} style={{ backgroundColor: '#f3eadb' }}
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 font-bold text-black hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 font-bold text-black hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-black border rounded-3xl py-3 px-6 text-lg font-bold transition-colors cursor-pointer"
              style={{ backgroundColor: '#f3eadb' }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;