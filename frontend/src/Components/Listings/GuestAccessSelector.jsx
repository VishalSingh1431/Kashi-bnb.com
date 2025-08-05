import React from "react";
import { FiHome, FiGrid, FiUsers } from "react-icons/fi";

const GuestAccessSelector = ({ selectedAccess, onAccessSelect, editMode = false }) => {
  const accessTypes = [
    {
      id: "Entire place",
      name: "An entire place",
      description: "Guests have the whole place to themselves.",
      icon: FiHome
    },
    {
      id: "Room",
      name: "A room",
      description: "Guests have their own room in a home, plus access to shared spaces.",
      icon: FiGrid
    },
    {
      id: "Shared room",
      name: "A shared room in a hostel",
      description: "Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.",
      icon: FiUsers
    }
  ];

  if (!editMode) {
    const selectedAccessType = accessTypes.find(type => type.id === selectedAccess);
    if (!selectedAccessType) return null;
    
    const IconComponent = selectedAccessType.icon;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Guest Access</h3>
        <div className="flex items-center p-4 bg-green-50 rounded-lg">
          <IconComponent className="text-green-600 mr-3" size={24} />
          <div>
            <p className="font-medium text-gray-800">{selectedAccessType.name}</p>
            <p className="text-sm text-gray-600">{selectedAccessType.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center sm:text-left">What type of place will guests have?</h3>
      <div className="space-y-3 sm:space-y-4">
        {accessTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedAccess === type.id;
          
          return (
            <div
              key={type.id}
              onClick={() => onAccessSelect(type.id)}
              className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                <IconComponent 
                  className={`mb-2 sm:mb-0 sm:mr-2 sm:mt-1 ${isSelected ? 'text-green-600' : 'text-gray-600'}`} 
                  size={20} 
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm md:text-base font-medium leading-tight break-words ${isSelected ? 'text-green-800' : 'text-gray-800'}`}>
                    {type.name}
                  </p>
                  <p className={`text-xs sm:text-xs md:text-sm mt-1 leading-tight break-words ${isSelected ? 'text-green-600' : 'text-gray-600'}`}>
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuestAccessSelector;