import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown } from "lucide-react";
import Profile from "./Profile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [whyKashiOpen, setWhyKashiOpen] = useState(false);
  const [mobileWhyKashiOpen, setMobileWhyKashiOpen] = useState(false);
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
    <nav className="shadow-md p-4 absolute z-10 w-full" style={{ backgroundColor: '#f3eadb' }}>
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
        <div className={`fixed inset-0 bg-opacity-95 z-20 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} style={{ backgroundColor: '#f3eadb' }}>
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
                        className="block w-full py-2 text-lg font-semibold text-gray-700 rounded-lg  "
                      >
                        For Owner
                      </Link>
                      <Link
                        to="/tourist"
                        onClick={() => setIsOpen(false)}
                        className="block w-full py-2 text-lg font-semibold text-gray-700 rounded-lg  "
                      >
                        For Tourist
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
              <li className="rounded-2xl py-2 px-4 text-center">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-xl font-bold text-black"
                >
                  Contact
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  <li className="rounded-2xl py-2 px-4 text-center">
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
                      className="w-full max-w-xs text-center py-3 px-6 rounded-2xl text-xl font-bold   transition-colors"
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
                    className="block w-full max-w-xs text-center py-3 px-6 rounded-2xl text-xl font-bold transition-colors  "
                  >
                    Login / Signup
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

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
              className="relative rounded-2xl py-2 px-4   transition-colors"
              onMouseEnter={() => setWhyKashiOpen(true)}
              onMouseLeave={() => setWhyKashiOpen(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                Why KashiBnB
                <ChevronDown className={`transition-transform ${whyKashiOpen ? 'rotate-180' : ''}`} size={18} />
              </div>
              {whyKashiOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md  py-1 z-30  "style={{ backgroundColor: '#f3eadb' }}>
                  <Link
                    to="/owner"
                    className="block px-4 py-2 text-gray-800 "
                  >
                    For Owner
                  </Link>
                  <Link
                    to="/tourist"
                    className="block px-4 py-2 text-gray-800  "
                  >
                    For Tourist
                  </Link>
                </div>
              )}
            </li>

            <li className="rounded-2xl py-2 px-4  transition-colors">
              <Link to="/add-listing" className="cursor-pointer">
                Add Your Listing
              </Link>
            </li>
            <li className="rounded-2xl py-2 px-4  transition-colors">
              <Link to="/contact" className="cursor-pointer">
                Contact
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
                <button className="flex items-center gap-2  py-3 px-6 rounded-2xl text-lg font-bold transition-colors cursor-pointer">
                  <User size={20} />
                  {user.name || "Profile"}
                </button>
                <div 
                  className={`absolute top-full left-0 right-0  rounded-md shadow-lg py-1 z-30 ${isProfileOpen ? 'block' : 'hidden'}`}
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800  cursor-pointer"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800   cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-black border   rounded-3xl py-3 px-6     text-lg font-bold transition-colors cursor-pointer"
            >
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;