import React, { useState } from 'react';
import { FiUpload, FiX, FiChevronLeft, FiChevronRight, FiUsers } from 'react-icons/fi';

const StaffImagesUploader = ({ 
  staffImages, 
  setStaffImages, 
  currentStaffImageIndex, 
  setCurrentStaffImageIndex,
  nextStaffImage,
  prevStaffImage 
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const newImages = [];
    let processedCount = 0;

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file,
            name: file.name
          });
          
          processedCount++;
          if (processedCount === files.length) {
            setStaffImages(prev => [...prev, ...newImages]);
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        processedCount++;
        if (processedCount === files.length) {
          setStaffImages(prev => [...prev, ...newImages]);
          setIsUploading(false);
        }
      }
    }
  };

  const removeStaffImage = (imageId) => {
    setStaffImages(prev => {
      const newImages = prev.filter(img => img.id !== imageId);
      if (currentStaffImageIndex >= newImages.length && newImages.length > 0) {
        setCurrentStaffImageIndex(newImages.length - 1);
      } else if (newImages.length === 0) {
        setCurrentStaffImageIndex(0);
      }
      return newImages;
    });
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <FiUsers className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
            Our Staff <span className="text-xs sm:text-sm font-normal text-gray-500">(KashiBnB Trained)</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Upload photos of your trained staff (Optional)
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-4">
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 md:p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
            <FiUpload className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1">
              Click to upload trained staff photos
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 10MB each
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Staff Images Display */}
      {staffImages.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              Trained Staff Photos ({staffImages.length})
            </p>
            {staffImages.length > 1 && (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={prevStaffImage}
                  className="p-1 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Previous photo"
                >
                  <FiChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                </button>
                <span className="text-xs text-gray-600 px-1 sm:px-2">
                  {currentStaffImageIndex + 1} / {staffImages.length}
                </span>
                <button
                  onClick={nextStaffImage}
                  className="p-1 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Next photo"
                >
                  <FiChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          <div className="relative group">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={staffImages[currentStaffImageIndex]?.url}
                alt={`KashiBnB trained staff member ${currentStaffImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Remove button */}
            <button
              onClick={() => removeStaffImage(staffImages[currentStaffImageIndex]?.id)}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              title="Remove photo"
            >
              <FiX className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Thumbnail navigation */}
          {staffImages.length > 1 && (
            <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {staffImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentStaffImageIndex(index)}
                  className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentStaffImageIndex
                      ? 'border-purple-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`KashiBnB trained staff ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isUploading && (
        <div className="text-center py-3 sm:py-4">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-purple-600">
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-purple-600"></div>
            <span className="hidden sm:inline">Uploading staff photos...</span>
            <span className="sm:hidden">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffImagesUploader;
