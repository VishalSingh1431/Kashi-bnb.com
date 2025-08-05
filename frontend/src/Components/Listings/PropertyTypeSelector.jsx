import React from "react";
import { 
  FiHome, 
  FiGrid, 
  FiMapPin, 
  FiStar,
  FiAnchor,
  FiBriefcase,
  FiMoreHorizontal,
  FiBox
} from "react-icons/fi";

const PropertyTypeSelector = ({ selectedType, onTypeSelect, editMode = false }) => {
  const propertyTypes = [
    { id: "Villa", name: "Villa", icon: FiHome, description: "Luxury villa with private amenities" },
    { id: "Guesthouse", name: "Guesthouse", icon: FiGrid, description: "Cozy guesthouse experience" },
    { id: "Cottage", name: "Cottage", icon: FiBox, description: "Charming cottage in nature" },
    { id: "Bungalow", name: "Bungalow", icon: FiHome, description: "Single-story bungalow" },
    { id: "Farmstay", name: "Farmstay", icon: FiBox, description: "Rural farm experience" },
    { id: "Resort", name: "Resort", icon: FiStar, description: "Full-service resort" },
    { id: "At Ghat", name: "At Ghat", icon: FiAnchor, description: "Riverside accommodation" },
    { id: "House", name: "House", icon: FiHome, description: "Traditional house" },
    { id: "Flat/apartment", name: "Flat/apartment", icon: FiGrid, description: "Modern apartment" },
    { id: "Farm", name: "Farm", icon: FiBox, description: "Working farm accommodation" },
    { id: "Hotel", name: "Hotel", icon: FiBriefcase, description: "Professional hotel service" },
    { id: "Others", name: "Others", icon: FiMoreHorizontal, description: "Other accommodation types" }
  ];

  if (!editMode) {
    const selectedProperty = propertyTypes.find(type => type.id === selectedType);
    if (!selectedProperty) return null;
    
    const IconComponent = selectedProperty.icon;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Property Type</h3>
        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
          <IconComponent className="text-blue-600 mr-3" size={24} />
          <div>
            <p className="font-medium text-gray-800">{selectedProperty.name}</p>
            <p className="text-sm text-gray-600">{selectedProperty.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center sm:text-left">Which of these describes your place?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {propertyTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <div
              key={type.id}
              onClick={() => onTypeSelect(type.id)}
              className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                <IconComponent 
                  className={`mb-2 sm:mb-0 sm:mr-2 sm:mr-3 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} 
                  size={20} 
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm md:text-base font-medium leading-tight break-words ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                    {type.name}
                  </p>
                  <p className={`text-xs sm:text-xs md:text-sm mt-1 leading-tight break-words ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
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

export default PropertyTypeSelector;