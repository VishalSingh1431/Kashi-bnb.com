import React from "react";
import { FiEdit, FiSave, FiX } from "react-icons/fi";

const HotelHeader = ({ isOwnerOrAdmin, editMode, handleEditToggle, handleCancelEdit }) => {
  if (!isOwnerOrAdmin) return null;

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={handleEditToggle}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        {editMode ? (
          <>
            <FiSave /> Save Changes
          </>
        ) : (
          <>
            <FiEdit /> Edit Hotel
          </>
        )}
      </button>
      {editMode && (
        <button
          onClick={handleCancelEdit}
          className="flex items-center gap-2 px-4 py-2 ml-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <FiX /> Cancel
        </button>
      )}
    </div>
  );
};

export default HotelHeader;