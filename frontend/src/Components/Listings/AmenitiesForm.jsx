import React from "react";
import { FiWifi } from "react-icons/fi";
import { FaTv, FaCar, FaSwimmingPool, FaFireExtinguisher, FaFirstAid, FaTemperatureLow } from "react-icons/fa";
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
  { id: 'kit', name: 'Basic Kit', icon: <FaFirstAid className="mr-2" /> }
];

const AmenitiesForm = ({ listing, handleAmenityChange }) => {
  return (
    <div className="border-b pb-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {amenitiesList.map(amenity => (
          <div key={amenity.id} className="flex items-center">
            <input
              type="checkbox"
              id={amenity.id}
              name={amenity.id}
              checked={listing[amenity.id]}
              onChange={handleAmenityChange}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor={amenity.id} className="flex items-center">
              {amenity.icon} {amenity.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesForm;
