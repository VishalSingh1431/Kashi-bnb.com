import React from 'react';
import { FiChevronRight, FiChevronLeft, FiUpload } from "react-icons/fi";

const ImageUploader = ({ images, currentImageIndex, handleImageUpload, nextImage, prevImage }) => {
  return (
    <div className="relative mb-8 rounded-xl overflow-hidden">
      <div className="aspect-[16/9] bg-gray-200 relative">
        {images.length > 0 ? (
          <>
            <img 
              src={URL.createObjectURL(images[currentImageIndex])} 
              alt={`Preview ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover"
              onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Clean up object URLs
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button 
                onClick={prevImage}
                className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition transform"
                aria-label="Previous image"
              >
                <FiChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition transform"
                aria-label="Next image"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
            <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
              {images.length > 1 ? `${currentImageIndex + 1}/${images.length}` : '1/1'}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
            <FiUpload size={48} className="mb-4" />
            <span>No images uploaded yet</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
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
        <p className="text-xs text-gray-500 mt-1">Upload high-quality images of your property (minimum 3 recommended)</p>
      </div>
    </div>
  );
};

export default ImageUploader;
