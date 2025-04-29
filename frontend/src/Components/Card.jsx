import React from "react";
import { motion } from "framer-motion";

const Card = ({ name, price, image, rating, options, address, gmap, onClick }) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="max-w-sm w-80  rounded-2xl shadow-lg overflow-hidden border border-black hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick} // Add onClick handler here
    >
      <img
        src={image}
        alt={name}
        className="w-full h-48 md:h-56 lg:h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{name}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="text-lg text-black">₹{price}/night</p>
          <div className="flex items-center space-x-1">
            <span className="text-black">{rating}</span>
          </div>
        </div>
        {address && <p className="mt-2 text-black text-sm">{address}</p>}
        {gmap && (
          <a
            href={gmap}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2  text-sm hover:underline"
            onClick={(e) => e.stopPropagation()} // Prevent map link click from triggering card navigation
          >
            View on Google Maps
          </a>
        )}
        <div className="mt-3 text-black">
          <div className="grid grid-cols-2 gap-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center">
                ✔ {option}
              </div>
            ))}
          </div>
        </div>
        <motion.button
          className="mt-4 w-full border  text-black py-2 rounded-3xl hover:bg-black hover:text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Card;