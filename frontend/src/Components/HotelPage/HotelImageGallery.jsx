import React from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const HotelImageGallery = ({ 
  hotel, 
  editMode, 
  currentImageIndex, 
  setCurrentImageIndex,
  handleImageUpload 
}) => {
  const nextImage = () => {
    if (hotel?.images?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.length);
    }
  };

  const prevImage = () => {
    if (hotel?.images?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hotel.images.length) % hotel.images.length);
    }
  };

  return (
    <div className="relative mb-4 sm:mb-6 md:mb-8 rounded-xl overflow-hidden">
      <div className="aspect-[16/9] bg-gray-200 relative">
        {hotel.images?.length ? (
          <>
            <img 
              src={hotel.images[currentImageIndex]?.url} 
              alt={hotel.images[currentImageIndex]?.name || hotel.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4">
              <button 
                onClick={prevImage}
                className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:scale-105 transition transform"
                aria-label="Previous image"
              >
                <FiChevronLeft size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={nextImage}
                className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:scale-105 transition transform"
                aria-label="Next image"
              >
                <FiChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {hotel.images.length > 1 ? `${currentImageIndex + 1}/${hotel.images.length}` : '1/1'}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-500 text-sm sm:text-base">No images available</span>
          </div>
        )}
      </div>
      {editMode && (
        <div className="mt-2 sm:mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
      )}
    </div>
  );
};

export default HotelImageGallery;