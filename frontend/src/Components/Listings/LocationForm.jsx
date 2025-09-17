import React, { useState } from 'react';
import { FiMapPin, FiGlobe, FiX, FiInfo } from 'react-icons/fi';

const LocationForm = ({ listing, handleInputChange }) => {
  const [isValidUrl, setIsValidUrl] = useState(false);

  // Extract embed URL from various Google Maps URL formats
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

  const handleUrlChange = (e) => {
    const url = e.target.value;
    handleInputChange(e);
    
    const embedUrl = extractEmbedUrl(url);
    setIsValidUrl(!!embedUrl);
  };

  const embedUrl = extractEmbedUrl(listing.gmap);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">Where you'll be</h2>
      
      {/* Map Preview */}
      <div className="h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
        {isValidUrl && embedUrl ? (
          <iframe
            src={embedUrl}
            title="Property Location"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-3 sm:p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center max-w-xs sm:max-w-sm">
              <FiMapPin size={32} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-green-500" />
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-2 leading-tight">Add Property Location</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-tight break-words">Paste a Google Maps URL below</p>
              <div className="bg-green-50 text-green-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm leading-tight">
                <strong>Required:</strong> Helps guests find your property
              </div>
            </div>
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left">
          <div className="mb-2 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">Google Maps URL</h3>
            <p className="text-sm text-gray-600">
              {listing.gmap ? 'Map URL added' : 'No map URL added yet'}
            </p>
          </div>
          {listing.gmap && (
            <button
              onClick={() => {
                const event = {
                  target: { name: 'gmap', value: '' }
                };
                handleInputChange(event);
                setIsValidUrl(false);
              }}
              className="flex items-center gap-2 px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              <FiX size={14} />
              Remove
            </button>
          )}
        </div>

        <div className="space-y-3 text-center sm:text-left">
          <label className="block text-sm font-medium text-gray-700">
            Google Maps URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="url"
              name="gmap"
              value={listing.gmap || ''}
              onChange={handleUrlChange}
              placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/place/Your+Property+Name/@coordinates..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-center sm:text-left"
            />
            {listing.gmap && !isValidUrl && (
              <div className="text-red-500">
                <FiX size={20} />
              </div>
            )}
            {isValidUrl && (
              <div className="text-green-500">
                <FiGlobe size={20} />
              </div>
            )}
          </div>
          
          {isValidUrl && embedUrl && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <FiMapPin size={16} />
              Map preview loaded successfully
            </div>
          )}

          {listing.gmap && !isValidUrl && (
            <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
              <FiInfo size={16} />
              Please enter a valid Google Maps URL
            </div>
          )}
        </div>

        {/* Map Guidelines */}
        <div className="bg-green-50 rounded-xl p-3 sm:p-4">
          <h4 className="font-semibold text-green-800 mb-2">📍 How to get your Google Maps URL:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>From Phone:</strong> Share location → Copy link (maps.app.goo.gl/...)</li>
            <li>• <strong>From Computer:</strong> Search your property → Share → Copy link</li>
            <li>• <strong>Direct Link:</strong> https://maps.google.com/maps/place/Your+Property</li>
          </ul>
          <h4 className="text-sm sm:text-base font-semibold text-green-800 mb-2 sm:mb-3 text-center leading-tight">🗺️ Location Guidelines</h4>
          <ul className="text-xs sm:text-sm text-green-700 space-y-1 sm:space-y-2 text-left leading-tight">
            <li className="break-words">• Copy the URL from Google Maps when you search for your property</li>
            <li className="break-words">• Paste the URL in the field above</li>
            <li className="break-words">• The map will automatically embed in your listing</li>
            <li className="break-words">• This helps guests find your location easily</li>
            <li className="break-all text-xs">• Example: https://www.google.com/maps/place/Your+Property+Name/@coordinates...</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
