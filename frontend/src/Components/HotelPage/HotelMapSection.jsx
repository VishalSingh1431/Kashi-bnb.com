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
    
    // Handle phone location sharing URLs (goo.gl/maps, maps.app.goo.gl, etc.)
    if (url.includes('goo.gl/maps') || url.includes('maps.app.goo.gl')) {
      // For short URLs, we'll need to resolve them, but for now return the original URL
      // The iframe should handle the redirect
      return url.includes('output=embed') ? url : `${url}&output=embed`;
    }
    
    // Handle coordinates in various formats
    const coordPatterns = [
      // @lat,lng format
      /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      // ll=lat,lng format
      /ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      // q=lat,lng format
      /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/
    ];
    
    for (const pattern of coordPatterns) {
      const match = url.match(pattern);
      if (match) {
        const lat = match[1];
        const lng = match[2];
        return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
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
    
    // For any other Google Maps URL, try to add embed parameter
    if (url.includes('maps.google.com') || url.includes('google.com/maps')) {
      return url.includes('output=embed') ? url : `${url}${url.includes('?') ? '&' : '?'}output=embed`;
    }
    
    return null;
  };

  const mapUrl = editMode ? tempHotel?.gmap : hotel?.gmap;
  const embedUrl = extractEmbedUrl(mapUrl);

  if (!mapUrl && !editMode) {
    return null; // Don't render anything if no map and not in edit mode
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <FiMapPin className="text-green-600 mr-2" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Where you'll be</h3>
      </div>
      
      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Address
            </label>
            <textarea
              name="address"
              value={tempHotel?.address || ''}
              onChange={handleInputChange}
              placeholder="Enter the full address of your property..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide the complete address including street, city, state, and postal code
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps URL
            </label>
            <input
              type="url"
              name="gmap"
              value={tempHotel?.gmap || ''}
              onChange={handleInputChange}
              placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/place/Your+Property+Name/@coordinates..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              From phone: Share location → Copy link (maps.app.goo.gl/...)<br/>
              From computer: Search property → Share → Copy link
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
          {/* Hotel Address Display */}
          {hotel?.address && (
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
              <FiMapPin className="text-green-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                <p className="text-gray-700 leading-relaxed">{hotel.address}</p>
              </div>
            </div>
          )}
          
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