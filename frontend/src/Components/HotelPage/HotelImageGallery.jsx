import React, { useEffect, useState } from "react";

const HotelImageGallery = ({ 
  hotel, 
  editMode, 
  currentImageIndex, 
  setCurrentImageIndex,
  handleImageUpload 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const nextImage = () => {
    if (hotel?.images?.length) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.length);
      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 600);
    }
  };

  // Auto-scroll functionality - always playing
  useEffect(() => {
    let interval;
    if (hotel?.images?.length > 1) {
      interval = setInterval(() => {
        nextImage();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [hotel?.images?.length, currentImageIndex]);

  return (
    <div className="relative mb-4 sm:mb-6 md:mb-8">
      {/* Simple border frame */}
      <div className="rounded-xl overflow-hidden border-4 border-gray-300 bg-white p-3 transition-all duration-500" style={{boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)'}} onMouseEnter={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.7), 0 0 0 6px rgba(255, 255, 255, 0.5), 0 12px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.2)'} onMouseLeave={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)'}>
        {/* Main image container */}
        <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] bg-gray-200 relative rounded-lg overflow-hidden" style={{boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.3), inset 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(0, 0, 0, 0.1)'}}>
          {hotel.images?.length ? (
            <>
              <img 
                src={hotel.images[currentImageIndex]?.url} 
                alt={hotel.images[currentImageIndex]?.name || hotel.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Image counter */}
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/95 px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold border-2 border-gray-300" style={{boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.7), 0 0 0 2px rgba(255, 255, 255, 0.5), 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)'}}>
                {currentImageIndex + 1} / {hotel.images.length}
              </div>

              {/* Simple thumbnail strip */}
              {hotel.images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 sm:p-3">
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                    {hotel.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-10 h-7 sm:w-12 sm:h-8 rounded overflow-hidden border-2 transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'border-white' 
                            : 'border-white/50 hover:border-white'
                        }`}
                        style={index === currentImageIndex ? 
                          {boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 0 2px rgba(255, 255, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.6)'} : 
                          {boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)'}
                        }
                        onMouseEnter={(e) => {
                          if (index !== currentImageIndex) {
                            e.target.style.boxShadow = '0 0 0 1px rgba(255, 255, 255, 0.6), 0 3px 6px rgba(0, 0, 0, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (index !== currentImageIndex) {
                            e.target.style.boxShadow = '0 0 0 1px rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)';
                          }
                        }}
                      >
                        <img 
                          src={image.url} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-lg">No images available</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit mode upload section */}
      {editMode && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 transition-all duration-500" style={{boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2)'}} onMouseEnter={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.7), 0 0 0 6px rgba(255, 255, 255, 0.5), 0 12px 24px rgba(0, 0, 0, 0.3)'} onMouseLeave={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2)'}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload New Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              border border-gray-300 rounded-lg p-2"
          />
        </div>
      )}
    </div>
  );
};

export default HotelImageGallery;