import React, { useState } from 'react';
import { FiYoutube, FiPlay, FiX, FiInfo } from 'react-icons/fi';

const YouTubeVideoForm = ({ videoUrl, onVideoUrlChange }) => {
  const [isValidUrl, setIsValidUrl] = useState(false);

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

  const handleUrlChange = (e) => {
    const url = e.target.value;
    onVideoUrlChange(url);
    
    const videoId = extractVideoId(url);
    setIsValidUrl(!!videoId);
  };

  const videoId = extractVideoId(videoUrl);

  return (
    <div className="space-y-6">
      {/* Video Upload Area */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="aspect-[4/3] sm:aspect-video relative min-h-[200px] sm:min-h-0">
          {isValidUrl && videoId ? (
            <>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => onVideoUrlChange('')}
                  className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
                  title="Remove video"
                >
                  <FiX size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-3 sm:p-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm">
                <FiYoutube size={32} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-red-500" />
                <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-2">Add Property Video</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Showcase your property with a YouTube video</p>
                <div className="bg-red-50 text-red-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm">
                  <strong>Optional:</strong> Great for virtual tours
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video URL Input */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left">
          <div className="mb-2 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">YouTube Video</h3>
            <p className="text-sm text-gray-600">
              {videoUrl ? 'Video URL added' : 'No video added yet'}
            </p>
          </div>
          {videoUrl && (
            <button
              onClick={() => onVideoUrlChange('')}
              className="flex items-center gap-2 px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              <FiX size={14} />
              Remove
            </button>
          )}
        </div>

        <div className="space-y-3 text-center sm:text-left">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 leading-tight">
            YouTube Video URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="url"
              value={videoUrl || ''}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-center sm:text-left leading-tight"
            />
            {videoUrl && !isValidUrl && (
              <div className="text-red-500">
                <FiX size={20} />
              </div>
            )}
            {isValidUrl && (
              <div className="text-green-500">
                <FiPlay size={20} />
              </div>
            )}
          </div>
          
          {isValidUrl && videoId && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <FiPlay size={16} />
              Video preview loaded successfully
            </div>
          )}

          {videoUrl && !isValidUrl && (
            <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
              <FiInfo size={16} />
              Please enter a valid YouTube URL
            </div>
          )}
        </div>

        {/* Video Guidelines */}
        <div className="bg-red-50 rounded-xl p-3 sm:p-4">
          <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base text-center">🎥 Video Guidelines</h4>
          <ul className="text-xs sm:text-sm text-red-700 space-y-1 text-left">
            <li>• Use YouTube video URLs only</li>
            <li>• Create a virtual tour of your property</li>
            <li>• Show rooms, amenities, and surroundings</li>
            <li>• Keep videos under 5 minutes for best engagement</li>
            <li>• Ensure good video quality and lighting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideoForm; 