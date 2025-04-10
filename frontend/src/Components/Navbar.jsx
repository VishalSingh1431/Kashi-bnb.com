import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import Profile from "./Profile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    <nav className="shadow-md p-4 absolute z-10 w-full bg-white/20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          
          <Link to="/">
            <img
              className="w-20 h-20 md:w-40 md:h-40 rounded-lg"
              src="https://kashibnb.in/wp-content/uploads/2024/09/Image-3-1.jpg"
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
        <div className={`fixed inset-0 bg-white bg-opacity-95 z-20 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="relative h-full w-auto min-w-[250px] max-w-[90%] bg-white shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2"
            >
              <X size={30} className="text-black" />
            </button>

            <ul className="pt-20 px-4 space-y-4">
              {[
                { name: "Home", path: "/" }, 
                { name: "Why KashiBnB", path: "/about" },
                { name: "Add Your Listing", path: "/add-listing" },
                { name: "Activities", path: "/activities" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.name} className="rounded-2xl py-2 px-4 hover:bg-gray-100">
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-xl font-bold text-black"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {isLoggedIn ? (
                <>
                  <li className="rounded-2xl py-2 px-4 hover:bg-gray-100">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-xl font-bold text-black"
                    >
                      <User size={20} />
                      {user.name || "Profile"}
                    </Link>
                  </li>
                  <li className="mt-8">
                    <button
                      onClick={handleLogout}
                      className="w-full text-center bg-red-500 text-white py-3 px-6 rounded-2xl text-xl font-bold hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="mt-8">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-blue-500 text-white py-3 px-6 rounded-2xl text-xl font-bold hover:bg-blue-600 transition-colors"
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
            {[
              { name: "Home", path: "/" }, 
              { name: "Why KashiBnB", path: "/about" },
              { name: "Add Your Listing", path: "/add-listing" },
              { name: "Activities", path: "/activities" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <li key={item.name} className="rounded-2xl py-2 px-4 hover:text-blue-500">
                <Link to={item.path} className="cursor-pointer">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {isLoggedIn ? (
            <div className="relative">
              <div 
                className="flex flex-col"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <button className="flex items-center gap-2 bg-blue-500 text-white py-3 px-6 rounded-2xl text-lg font-bold hover:bg-blue-600 transition-colors cursor-pointer">
                  <User size={20} />
                  {user.name || "Profile"}
                </button>
                <div 
                  className={`absolute top-full left-0 right-0 bg-white rounded-md shadow-lg py-1 z-30 ${isProfileOpen ? 'block' : 'hidden'}`}
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-red-500 hover:text-white cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white py-3 px-6 rounded-2xl text-lg font-bold hover:bg-blue-600 transition-colors cursor-pointer"
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