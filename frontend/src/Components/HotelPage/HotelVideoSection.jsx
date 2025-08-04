import React from 'react';
import { FiYoutube, FiPlay, FiMapPin } from 'react-icons/fi';

const HotelVideoSection = ({ hotel, editMode, tempHotel, handleInputChange }) => {
  // Extract YouTube video ID from various URL formats
  const extractVideoId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoUrl = editMode ? tempHotel?.videoUrl : hotel?.videoUrl;
  const videoId = extractVideoId(videoUrl);

  if (!videoUrl && !editMode) {
    return null; // Don't render anything if no video and not in edit mode
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <FiYoutube className="text-red-600 mr-2" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Property Video</h3>
      </div>
      
      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video URL
            </label>
            <input
              type="url"
              name="videoUrl"
              value={tempHotel?.videoUrl || ''}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste a YouTube video URL to showcase your property
            </p>
          </div>
          
          {videoId && (
            <div className="mt-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <FiPlay className="mr-1" size={12} />
                Video preview loaded successfully
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {videoId ? (
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiYoutube size={48} className="mx-auto mb-2" />
              <p>No video available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelVideoSection; 