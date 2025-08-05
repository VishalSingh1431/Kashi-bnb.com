import React from "react";
import { FiWifi } from "react-icons/fi";
import { 
  FaTv,
  FaCar,
  FaSwimmingPool,
  FaFireExtinguisher,
  FaFirstAid,
  FaTemperatureLow,
  FaShower,
  FaFilter,
  FaBox
} from "react-icons/fa";
import { GiWashingMachine } from "react-icons/gi";
import { MdKitchen } from "react-icons/md";

const amenityIcons = {
  wifi: <FiWifi />,
  tv: <FaTv />,
  kitchen: <MdKitchen />,
  washingmachine: <GiWashingMachine />,
  parking: <FaCar />,
  ac: <FaTemperatureLow />,
  pool: <FaSwimmingPool />,
  fireextinguisher: <FaFireExtinguisher />,
  firstaid: <FaFirstAid />,
  geyser: <FaShower />,
  microwave: <FaBox />,
  waterFilter: <FaFilter />,
};

const HotelAmenities = ({ hotel, editMode, tempHotel, handleAmenityChange }) => {
  const getAmenities = () => {
    const amenities = [];
    
    if (hotel.wifi) amenities.push({ name: "WiFi", icon: amenityIcons.wifi });
    if (hotel.tv) amenities.push({ name: "TV", icon: amenityIcons.tv });
    if (hotel.kitchen) amenities.push({ name: "Kitchen", icon: amenityIcons.kitchen });
    if (hotel.washingmachine) amenities.push({ name: "Washing Machine", icon: amenityIcons.washingmachine });
    if (hotel.parking) amenities.push({ name: "Parking", icon: amenityIcons.parking });
    if (hotel.ac) amenities.push({ name: "Air Conditioning", icon: amenityIcons.ac });
    if (hotel.pool) amenities.push({ name: "Pool", icon: amenityIcons.pool });
    if (hotel.fireextinguisher) amenities.push({ name: "Fire Extinguisher", icon: amenityIcons.fireextinguisher });
    if (hotel.firstaid) amenities.push({ name: "First Aid Kit", icon: amenityIcons.firstaid });
    if (hotel.geyser) amenities.push({ name: "Geyser", icon: amenityIcons.geyser });
    if (hotel.microwave) amenities.push({ name: "Microwave", icon: amenityIcons.microwave });
    if (hotel.waterFilter) amenities.push({ name: "Water Filter", icon: amenityIcons.waterFilter });

    return amenities;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 md:mb-6 text-gray-800">What this place offers</h2>
      {editMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="wifi"
              name="wifi"
              checked={tempHotel.wifi || false}
              onChange={handleAmenityChange}
              className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
            />
            <label htmlFor="wifi" className="flex items-center text-xs sm:text-sm">
              <FiWifi className="mr-2 text-sm sm:text-base" /> WiFi
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tv"
              name="tv"
              checked={tempHotel.tv || false}
              onChange={handleAmenityChange}
              className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
            />
            <label htmlFor="tv" className="flex items-center text-xs sm:text-sm">
              <FaTv className="mr-2 text-sm sm:text-base" /> TV
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="kitchen"
              name="kitchen"
              checked={tempHotel.kitchen || false}
              onChange={handleAmenityChange}
              className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
            />
            <label htmlFor="kitchen" className="flex items-center text-xs sm:text-sm">
              <MdKitchen className="mr-2 text-sm sm:text-base" /> Kitchen
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="washingmachine"
              name="washingmachine"
              checked={tempHotel.washingmachine || false}
              onChange={handleAmenityChange}
              className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
            />
            <label htmlFor="washingmachine" className="flex items-center text-xs sm:text-sm">
              <GiWashingMachine className="mr-2 text-sm sm:text-base" /> Washing Machine
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="parking"
              name="parking"
              checked={tempHotel.parking || false}
              onChange={handleAmenityChange}
              className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
            />
            <label htmlFor="parking" className="flex items-center text-xs sm:text-sm">
              <FaCar className="mr-2 text-sm sm:text-base" /> Parking
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ac"
              name="ac"
              checked={tempHotel.ac || false}
              onChange={handleAmenityChange}
              className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
            />
            <label htmlFor="ac" className="flex items-center text-xs sm:text-sm">
              <FaTemperatureLow className="mr-2 text-sm sm:text-base" /> Air Conditioning
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pool"
              name="pool"
              checked={tempHotel.pool || false}
              onChange={handleAmenityChange}
              className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
            />
            <label htmlFor="pool" className="flex items-center text-xs sm:text-sm">
              <FaSwimmingPool className="mr-2 text-sm sm:text-base" /> Pool
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="fireextinguisher"
              name="fireextinguisher"
              checked={tempHotel.fireextinguisher || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="fireextinguisher" className="flex items-center">
              <FaFireExtinguisher className="mr-2" /> Fire Extinguisher
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="firstaid"
              name="firstaid"
              checked={tempHotel.firstaid || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="firstaid" className="flex items-center">
              <FaFirstAid className="mr-2" /> First Aid Kit
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="geyser"
              name="geyser"
              checked={tempHotel.geyser || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="geyser" className="flex items-center">
              <FaShower className="mr-2" /> Geyser
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="microwave"
              name="microwave"
              checked={tempHotel.microwave || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
                         <label htmlFor="microwave" className="flex items-center">
               <FaBox className="mr-2" /> Microwave
             </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="waterFilter"
              name="waterFilter"
              checked={tempHotel.waterFilter || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="waterFilter" className="flex items-center">
              <FaFilter className="mr-2" /> Water Filter
            </label>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {getAmenities().map((amenity, index) => (
            <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xl mr-3 flex-shrink-0 text-blue-600">
                {amenity.icon}
              </span>
              <span className="capitalize text-gray-700 font-medium">{amenity.name}</span>
            </div>
          ))}
          {getAmenities().length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              <p>No amenities listed yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelAmenities;