import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#fcf5ee] py-10 font-sans text-sm text-[#333]">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-10 px-4">
        {/* Column 1: Logo & Tagline */}
        <div className="min-w-[200px] flex-1">
          <h2 className="mb-2 text-2xl font-bold text-[#e74c3c]">KashiBnB</h2>
          <p>Discover authentic homestays and unforgettable experiences in the spiritual heart of Varanasi.</p>
          <div className="mt-2">
            <a href="#" className="mr-3 text-xl">
              📘
            </a>
            <a href="#" className="mr-3 text-xl">
              🐦
            </a>
            <a href="#" className="text-xl">
              📸
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="min-w-[150px] flex-1">
          <h4 className="mb-2 font-semibold">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#group-yatra">Group Yatra</a>
            </li>
            <li>
              <a href="#villas">Villas</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Explore More */}
        <div className="min-w-[150px] flex-1">
          <h4 className="mb-2 font-semibold">Explore More</h4>
          <ul className="space-y-1">
            <li>
              <a href="#tours">Special Tours</a>
            </li>
            <li>
              <a href="#blog">Blog</a>
            </li>
            <li>
              <a href="#faqs">FAQs</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Subscribe */}
        <div className="min-w-[200px] flex-1">
          <h4 className="mb-2 font-semibold">Contact Us</h4>
          <p className="my-1">
            <strong>Address:</strong>
            <br />
            Bhelupur, Varanasi, UP 221010
          </p>
          <p className="my-1">
            <strong>Phone:</strong>
            <br />
            +91 80117 08595
            <br />
            +91 70543 47998
          </p>
          <p className="my-1">
            <strong>Email:</strong>
            <br />
            <a href="mailto:kashibnb@gmail.com">kashibnb@gmail.com</a>
          </p>

          <h4 className="my-4 font-semibold">Stay Updated</h4>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              required
              className="flex-1 rounded-l border border-gray-300 px-2 py-2"
            />
            <button
              type="submit"
              className="rounded-r bg-[#e74c3c] px-4 py-2 text-white"
            >
              ➤
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-[#e0e0e0] pt-3 text-center text-[#777]">
        © 2025 KashiBnB. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;