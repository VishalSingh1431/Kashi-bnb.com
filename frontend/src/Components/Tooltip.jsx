import React, { useState, useEffect, useRef } from 'react';

const Tooltip = ({ children, content, position = 'bottom' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      // Only consider it mobile if it's a small screen AND has touch capability
      setIsMobile(window.innerWidth < 768 && 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global tooltip management - close all other tooltips when one opens
  useEffect(() => {
    const handleCloseOthers = () => {
      // Close this tooltip if it's not the one being opened
      if (isVisible) {
        setIsVisible(false);
      }
    };

    // Listen for the global close event
    window.addEventListener('closeAllTooltips', handleCloseOthers);
    
    return () => window.removeEventListener('closeAllTooltips', handleCloseOthers);
  }, [isVisible]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800';
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      // Close all other tooltips first
      window.dispatchEvent(new CustomEvent('closeAllTooltips'));
      // Then show this one
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      // Close all other tooltips first
      window.dispatchEvent(new CustomEvent('closeAllTooltips'));
      // Then toggle this one
      setIsVisible(!isVisible);
    }
  };

  // Close tooltip when clicking outside on mobile
  useEffect(() => {
    if (isMobile && isVisible) {
      const handleClickOutside = (event) => {
        if (!event.target.closest('.tooltip-container')) {
          setIsVisible(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isVisible]);

  return (
    <div 
      ref={tooltipRef}
      className="relative inline-block w-full tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-[9999] ${getPositionClasses()}`}>
          <div className="bg-gray-800 text-white text-xs sm:text-sm rounded-lg px-2 sm:px-3 py-2 sm:py-3 w-56 sm:w-64 md:w-72 lg:w-80 shadow-xl border border-gray-700">
            <div className="whitespace-normal break-words">
              {content}
            </div>
            <div className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
