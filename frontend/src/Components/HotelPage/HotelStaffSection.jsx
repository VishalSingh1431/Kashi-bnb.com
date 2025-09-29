import React, { useState } from 'react';
import { FiUsers, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const HotelStaffSection = ({ hotel, editMode, handleStaffImageUpload, handleDeleteStaffImage }) => {
  const [currentStaffImageIndex, setCurrentStaffImageIndex] = useState(0);

  // Check if hotel has staff images
  const hasStaffImages = hotel?.staffimages && hotel.staffimages.length > 0;

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
        {hasStaffImages ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                Trained Staff Photos ({hotel.staffimages.length})
              </p>
            </div>

            {/* Uniform grid of equal frames, images not cropped */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {hotel.staffimages.map((image, index) => (
                <div key={image.id || index} className="relative bg-white rounded-md sm:rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="aspect-square w-full bg-gray-50 flex items-center justify-center">
                    <img
                      src={image.url}
                      alt={`KashiBnB trained staff ${index + 1}`}
                      className="max-w-full max-h-full object-contain p-2"
                      loading="lazy"
                    />
                  </div>
                  {editMode && (
                    <button
                      onClick={() => handleDeleteStaffImage(image.id)}
                      className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition-colors"
                      aria-label="Delete staff photo"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-6 sm:py-8 md:py-10">
            <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-video bg-gray-100 rounded-md sm:rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FiUsers className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base text-gray-500 mb-1 sm:mb-2">
                  No staff photos uploaded yet
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {editMode ? "Upload staff photos in edit mode" : "Staff photos will appear here when uploaded"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit mode upload section */}
      {editMode && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Upload Staff Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleStaffImageUpload}
            className="block w-full text-xs sm:text-sm text-gray-500
              file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4
              file:rounded-md sm:file:rounded-lg file:border-0
              file:text-xs sm:file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100
              border border-gray-300 rounded-md sm:rounded-lg p-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload photos of your trained staff members (PNG, JPG, JPEG up to 10MB each)
          </p>
        </div>
      )}
    </div>
  );
};

export default HotelStaffSection;
