import React from "react";
import { FiWifi } from "react-icons/fi";
import { 
  FaTv,
  FaCar,
  FaSwimmingPool,
  FaFireExtinguisher,
  FaFirstAid,
  FaTemperatureLow
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
  kit: <FaFirstAid />,
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
    if (hotel.kit) amenities.push({ name: "Basic Kit", icon: amenityIcons.kit });

    return amenities;
  };

  return (
    <div className="border-b pb-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
      {editMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="wifi"
              name="wifi"
              checked={tempHotel.wifi || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="wifi" className="flex items-center">
              <FiWifi className="mr-2" /> WiFi
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tv"
              name="tv"
              checked={tempHotel.tv || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="tv" className="flex items-center">
              <FaTv className="mr-2" /> TV
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="kitchen"
              name="kitchen"
              checked={tempHotel.kitchen || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="kitchen" className="flex items-center">
              <MdKitchen className="mr-2" /> Kitchen
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="washingmachine"
              name="washingmachine"
              checked={tempHotel.washingmachine || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="washingmachine" className="flex items-center">
              <GiWashingMachine className="mr-2" /> Washing Machine
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="parking"
              name="parking"
              checked={tempHotel.parking || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="parking" className="flex items-center">
              <FaCar className="mr-2" /> Parking
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ac"
              name="ac"
              checked={tempHotel.ac || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="ac" className="flex items-center">
              <FaTemperatureLow className="mr-2" /> Air Conditioning
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pool"
              name="pool"
              checked={tempHotel.pool || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="pool" className="flex items-center">
              <FaSwimmingPool className="mr-2" /> Pool
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
              id="kit"
              name="kit"
              checked={tempHotel.kit || false}
              onChange={handleAmenityChange}
              className="mr-2"
            />
            <label htmlFor="kit" className="flex items-center">
              <FaFirstAid className="mr-2" /> Basic Kit
            </label>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {getAmenities().map((amenity, index) => (
            <div key={index} className="flex items-center">
              <span className="text-xl mr-3 flex-shrink-0">
                {amenity.icon}
              </span>
              <span className="capitalize">{amenity.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelAmenities;