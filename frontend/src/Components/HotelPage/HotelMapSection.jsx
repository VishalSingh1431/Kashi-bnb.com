import React from 'react';
import { FiMapPin, FiGlobe } from 'react-icons/fi';

const HotelMapSection = ({ hotel, editMode, tempHotel, handleInputChange }) => {
  // Extract embed URL from various map service formats
  const extractEmbedUrl = (url) => {
    if (!url) return null;
    
    // Handle Google Maps place URLs
    if (url.includes('/maps/place/')) {
      // Extract the place name and coordinates
      const placeMatch = url.match(/\/maps\/place\/([^\/]+)\/@([^\/]+)/);
      if (placeMatch) {
        const placeName = placeMatch[1];
        const coordinates = placeMatch[2];
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&ll=${coordinates}&output=embed`;
      }
    }
    
    // Handle regular Google Maps URLs
    const googlePatterns = [
      /maps\.google\.com\/maps\?q=([^&\s]+)/,
      /maps\.google\.com\/maps\?ll=([^&\s]+)/,
      /maps\.google\.com\/maps\?addr=([^&\s]+)/,
      /maps\.google\.com\/maps\?daddr=([^&\s]+)/
    ];
    
    // Google Maps embed pattern
    const googleEmbedPattern = /maps\.google\.com\/maps\?.*output=embed/;
    
    // If it's already an embed URL
    if (googleEmbedPattern.test(url)) {
      return url;
    }
    
    // Try to convert regular Google Maps URL to embed
    for (const pattern of googlePatterns) {
      const match = url.match(pattern);
      if (match) {
        const location = encodeURIComponent(match[1]);
        return `https://maps.google.com/maps?q=${location}&output=embed`;
      }
    }
    
    // If it's a direct embed URL
    if (url.includes('embed')) {
      return url;
    }
    
    return null;
  };

  const mapUrl = editMode ? tempHotel?.gmap : hotel?.gmap;
  const embedUrl = extractEmbedUrl(mapUrl);

  if (!mapUrl && !editMode) {
    return null; // Don't render anything if no map and not in edit mode
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <FiMapPin className="text-green-600 mr-2" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Location</h3>
      </div>
      
      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps URL
            </label>
            <input
              type="url"
              name="gmap"
              value={tempHotel?.gmap || ''}
              onChange={handleInputChange}
              placeholder="https://www.google.com/maps/place/Your+Property+Name/@coordinates..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Copy the URL from Google Maps when you search for your property
            </p>
          </div>
          
          {embedUrl && (
            <div className="mt-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  title="Property Location"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <FiGlobe className="mr-1" size={12} />
                Map preview loaded successfully
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {embedUrl ? (
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title="Property Location"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiMapPin size={48} className="mx-auto mb-2" />
              <p>No map available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelMapSection; 