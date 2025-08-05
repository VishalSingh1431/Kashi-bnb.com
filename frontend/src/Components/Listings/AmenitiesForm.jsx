import React from "react";
import { FiWifi } from "react-icons/fi";
import { FaTv, FaCar, FaSwimmingPool, FaFireExtinguisher, FaFirstAid, FaTemperatureLow, FaShower, FaFilter, FaBox } from "react-icons/fa";
import { GiWashingMachine } from "react-icons/gi";
import { MdKitchen } from "react-icons/md";

const amenitiesList = [
  { id: 'wifi', name: 'WiFi', icon: <FiWifi className="mr-2" /> },
  { id: 'tv', name: 'TV', icon: <FaTv className="mr-2" /> },
  { id: 'kitchen', name: 'Kitchen', icon: <MdKitchen className="mr-2" /> },
  { id: 'washingmachine', name: 'Washing Machine', icon: <GiWashingMachine className="mr-2" /> },
  { id: 'parking', name: 'Parking', icon: <FaCar className="mr-2" /> },
  { id: 'ac', name: 'Air Conditioning', icon: <FaTemperatureLow className="mr-2" /> },
  { id: 'pool', name: 'Pool', icon: <FaSwimmingPool className="mr-2" /> },
  { id: 'fireextinguisher', name: 'Fire Extinguisher', icon: <FaFireExtinguisher className="mr-2" /> },
  { id: 'firstaid', name: 'First Aid Kit', icon: <FaFirstAid className="mr-2" /> },
  { id: 'geyser', name: 'Geyser', icon: <FaShower className="mr-2" /> },
  { id: 'microwave', name: 'Microwave', icon: <FaBox className="mr-2" /> },
  { id: 'waterFilter', name: 'Water Filter', icon: <FaFilter className="mr-2" /> }
];

const AmenitiesForm = ({ listing, handleAmenityChange }) => {
  return (
    <div className="border-b pb-4 sm:pb-6 mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center sm:text-left">What this place offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-md sm:max-w-none mx-auto sm:mx-0">
        {amenitiesList.map(amenity => (
          <div key={amenity.id} className="flex items-center justify-start bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none p-3 sm:p-0 border sm:border-0 border-gray-200">
            <input
              type="checkbox"
              id={amenity.id}
              name={amenity.id}
              checked={listing[amenity.id]}
              onChange={handleAmenityChange}
              className="mr-3 h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={amenity.id} className="flex items-center text-xs sm:text-sm font-medium text-gray-700 cursor-pointer flex-1 min-w-0">
              <span className="mr-2 text-blue-600 flex-shrink-0">{amenity.icon}</span>
              <span className="truncate leading-tight">{amenity.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesForm;
