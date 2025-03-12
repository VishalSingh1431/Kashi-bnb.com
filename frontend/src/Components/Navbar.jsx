import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='shadow-md p-4 absolute z-10 w-full  bg-black/30'>
      <div className='container mx-auto flex justify-between items-center'>
        {/* Logo */}
        <div>
          <img className='w-40 md:w-72 rounded-lg' src='/images/logo1.png' alt='Logo' />
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className='md:hidden'>
          <button onClick={() => setIsOpen(!isOpen)} className='focus:outline-none'>
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Navigation Links */}
        <ul className={`md:flex gap-5 font-bold text-white text-xl absolute md:static top-16 left-0 w-full md:w-auto shadow-md md:shadow-none p-5 md:p-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
          {["Home", "Restaurants", "Hotels", "Add Your Business", "Blogs", "Contact"].map((item) => (
            <li key={item} className='rounded-2xl py-2 md:py-0 px-4 hover:text-blue-500 cursor-pointer'>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
