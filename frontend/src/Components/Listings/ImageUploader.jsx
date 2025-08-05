import React, { useRef, useEffect, useState } from 'react';
import { FiChevronRight, FiChevronLeft, FiUpload, FiImage, FiPlus, FiX } from "react-icons/fi";

const ImageUploader = ({ images, currentImageIndex, handleImageUpload, nextImage, prevImage, onRemoveImage, handleSetCurrentImage }) => {
  const fileInputRef = useRef(null);
  const [imageUrls, setImageUrls] = useState([]);

  // Create URLs for images
  useEffect(() => {
    if (images && images.length > 0) {
      const urls = images.map(file => URL.createObjectURL(file));
      setImageUrls(urls);
    } else {
      setImageUrls([]);
    }
  }, [images]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    handleImageUpload(event);
  };

  const removeImage = (indexToRemove) => {
    onRemoveImage(indexToRemove);
  };

  const hasImages = images && images.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Upload Area */}
      <div 
        className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100"
        onClick={handleClick}
      >
        <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] relative">
          {hasImages && imageUrls[currentImageIndex] ? (
            <>
              <img 
                src={imageUrls[currentImageIndex]} 
                alt={`Preview ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
              
              {/* Navigation Buttons */}
              <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:scale-105 transition transform"
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={16} className="sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:scale-105 transition transform"
                  aria-label="Next image"
                >
                  <FiChevronRight size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
              
              {/* Image Counter */}
              <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                {images.length > 1 ? `${currentImageIndex + 1}/${images.length}` : '1/1'}
              </div>
              
              {/* Add More Button */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="bg-blue-600 text-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-blue-700 transition-colors"
                  title="Add more images"
                >
                  <FiPlus size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-3 sm:p-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm">
                <FiUpload size={32} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-500" />
                <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-2">Upload Property Images</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Click to select images or drag and drop</p>
                <div className="bg-blue-50 text-blue-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm">
                  <strong>Tip:</strong> Upload at least 5 high-quality photos
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Controls */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Property Images</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {images && images.length > 0 
                ? `${images.length} image${images.length !== 1 ? 's' : ''} uploaded` 
                : 'No images uploaded yet'
              }
            </p>
          </div>
          <button
            onClick={handleClick}
            className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
          >
            <FiPlus size={14} className="sm:w-4 sm:h-4" />
            Add Images
          </button>
        </div>

        {/* Image Thumbnails */}
        {images && images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div 
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSetCurrentImage(index)}
                >
                  {imageUrls[index] ? (
                    <img 
                      src={imageUrls[index]} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FiImage className="text-gray-400 w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                  )}
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove image"
                >
                  <FiX size={10} className="sm:w-3 sm:h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
          <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base text-center">📸 Image Guidelines</h4>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1 text-left">
            <li>• Upload at least 5 high-quality photos</li>
            <li>• Include exterior, interior, and room shots</li>
            <li>• Use good lighting and clear angles</li>
            <li>• Show amenities and unique features</li>
            <li>• Maximum file size: 10MB per image</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;