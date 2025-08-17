import React from "react";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const Card = ({ name, price, image, images, rating, options, address, gmap, onClick }) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add filled stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={`full-${i}`} className="w-4 h-4 text-yellow-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half" className="w-4 h-4 text-yellow-400" />);
    }
    
    // Add empty stars to complete 5 stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<BsStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  // Use the first image from images array, fallback to single image, or use placeholder
  const displayImage = images && images.length > 0 
    ? images[0].url 
    : image || "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <motion.div
      className="w-full max-w-sm rounded-2xl shadow-lg overflow-hidden border border-black hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
    >
      <img
        src={displayImage}
        alt={name}
        className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover"
      />
      <div className="p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl font-semibold">{name}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="text-base sm:text-lg text-black">₹{price}/night</p>
          <div className="flex items-center space-x-1">
            {rating && rating > 0 ? (
              <>
                <div className="flex items-center space-x-1">
                  {renderStars(rating)}
                </div>
                <span className="text-black text-sm sm:text-base ml-1">({rating})</span>
              </>
            ) : (
              <div className="flex items-center space-x-1">
                {renderStars(0)}
                <span className="text-gray-400 text-sm sm:text-base ml-1">No rating</span>
              </div>
            )}
          </div>
        </div>
        {address && <p className="mt-2 text-black text-xs sm:text-sm">{address}</p>}
        {gmap && (
          <a
            href={gmap}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs sm:text-sm hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View on Google Maps
          </a>
        )}
        <div className="mt-3 text-black">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center text-xs sm:text-sm">
                ✔ {option}
              </div>
            ))}
          </div>
        </div>
        <motion.button
          className="mt-3 sm:mt-4 w-full border text-black py-2 rounded-3xl hover:bg-black hover:text-white text-sm sm:text-base"
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