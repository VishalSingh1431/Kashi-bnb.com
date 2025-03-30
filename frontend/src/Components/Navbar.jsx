import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-black p-2"
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Navigation Links - Now without overlay and proper width */}
        <div className={`fixed inset-0 bg-white bg-opacity-95 z-20 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="relative h-full w-auto min-w-[250px] max-w-[90%] bg-white shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2"
            >
              <X size={30} className="text-black" />
            </button>

            {/* Menu items */}
            <ul className="pt-20 px-4 space-y-4">
              {[
                { name: "Home", path: "/" }, 
                { name: "Why KashiBnB", path: "/about" },
                { name: "Add Your Listing", path: "/add-listing" },
                { name: "Activities", path: "/activities" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <li
                  key={item.name}
                  className="rounded-2xl py-2 px-4 hover:bg-gray-100 cursor-pointer"
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-xl font-bold text-black"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-5 font-bold text-black text-xl">
          {[
            { name: "Home", path: "/" }, 
            { name: "Why KashiBnB", path: "/about" },
            { name: "Add Your Listing", path: "/add-listing" },
            { name: "Activities", path: "/activities" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <li
              key={item.name}
              className="rounded-2xl py-2 px-4 hover:text-blue-500 cursor-pointer"
            >
              <Link to={item.path}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;