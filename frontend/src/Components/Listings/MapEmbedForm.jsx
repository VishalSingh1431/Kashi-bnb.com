import React, { useState } from 'react';
import { FiMapPin, FiPlay, FiX, FiInfo, FiGlobe } from 'react-icons/fi';

const MapEmbedForm = ({ mapUrl, onMapUrlChange }) => {
  const [isValidUrl, setIsValidUrl] = useState(false);

  // Extract embed URL from various map service formats
  const extractEmbedUrl = (url) => {
    if (!url) return null;
    
    // Google Maps patterns
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

  const handleUrlChange = (e) => {
    const url = e.target.value;
    onMapUrlChange(url);
    
    const embedUrl = extractEmbedUrl(url);
    setIsValidUrl(!!embedUrl);
  };

  const embedUrl = extractEmbedUrl(mapUrl);

  return (
    <div className="space-y-6">
      {/* Map Embed Area */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="aspect-[4/3] relative">
          {isValidUrl && embedUrl ? (
            <>
              <iframe
                src={embedUrl}
                title="Property Location"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => onMapUrlChange('')}
                  className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
                  title="Remove map"
                >
                  <FiX size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center">
                <FiMapPin size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Add Property Location</h3>
                <p className="text-sm text-gray-600 mb-4">Show guests where your property is located</p>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
                  <strong>Required:</strong> Helps guests find your property
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map URL Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Property Location</h3>
            <p className="text-sm text-gray-600">
              {mapUrl ? 'Map URL added' : 'No map added yet'}
            </p>
          </div>
          {mapUrl && (
            <button
              onClick={() => onMapUrlChange('')}
              className="flex items-center gap-2 px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              <FiX size={14} />
              Remove
            </button>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Google Maps URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="url"
              value={mapUrl || ''}
              onChange={handleUrlChange}
              placeholder="https://maps.google.com/maps?q=..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            />
            {mapUrl && !isValidUrl && (
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

          {mapUrl && !isValidUrl && (
            <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
              <FiInfo size={16} />
              Please enter a valid Google Maps URL
            </div>
          )}
        </div>

        {/* Map Guidelines */}
        <div className="bg-green-50 rounded-xl p-4">
          <h4 className="font-semibold text-green-800 mb-2">🗺️ Map Guidelines</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Use Google Maps URLs only</li>
            <li>• Copy the URL from Google Maps search</li>
            <li>• Include the exact property address</li>
            <li>• This helps guests find your location easily</li> 
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MapEmbedForm; 