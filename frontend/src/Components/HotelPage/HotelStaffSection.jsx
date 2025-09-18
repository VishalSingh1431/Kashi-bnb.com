import React, { useState } from 'react';
import { FiUsers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HotelStaffSection = ({ hotel }) => {
  const [currentStaffImageIndex, setCurrentStaffImageIndex] = useState(0);

  // Don't render if no staff images
  if (!hotel?.staffimages || hotel.staffimages.length === 0) {
    return null;
  }

  const nextStaffImage = () => {
    setCurrentStaffImageIndex((prevIndex) => 
      (prevIndex + 1) % hotel.staffimages.length
    );
  };

  const prevStaffImage = () => {
    setCurrentStaffImageIndex((prevIndex) => 
      (prevIndex - 1 + hotel.staffimages.length) % hotel.staffimages.length
    );
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg p-2 sm:p-3 md:p-4 lg:p-6 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
        <div className="p-1 sm:p-1.5 md:p-2 bg-purple-100 rounded-md sm:rounded-lg">
          <FiUsers className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800 leading-tight">
            Our Staff <span className="text-xs sm:text-sm font-normal text-gray-500">(KashiBnB Trained)</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
            Meet our trained and certified staff members
          </p>
        </div>
      </div>

      {/* Staff Images Display */}
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            Trained Staff Photos ({hotel.staffimages.length})
          </p>
          {hotel.staffimages.length > 1 && (
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
              <button
                onClick={prevStaffImage}
                className="p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
                aria-label="Previous staff photo"
              >
                <FiChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-600" />
              </button>
              <button
                onClick={nextStaffImage}
                className="p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
                aria-label="Next staff photo"
              >
                <FiChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        <div className="relative group">
          <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-video bg-gray-100 rounded-md sm:rounded-lg overflow-hidden shadow-sm">
            <img
              src={hotel.staffimages[currentStaffImageIndex]?.url}
              alt={`KashiBnB trained staff member ${currentStaffImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {hotel.staffimages.length > 1 && (
          <div className="flex gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto pb-1 sm:pb-2 scrollbar-hide">
            {hotel.staffimages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentStaffImageIndex(index)}
                className={`flex-shrink-0 w-10 h-7 sm:w-12 sm:h-8 md:w-16 md:h-10 lg:w-20 lg:h-12 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-200 touch-manipulation ${
                  index === currentStaffImageIndex
                    ? 'border-purple-500 ring-2 ring-purple-200 scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:scale-105 active:scale-95'
                }`}
                aria-label={`View staff photo ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt={`KashiBnB trained staff ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelStaffSection;
