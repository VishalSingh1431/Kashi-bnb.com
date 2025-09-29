import React, { useState, useEffect } from 'react';
import { FiEdit3, FiCheck, FiX } from "react-icons/fi";
import AuthPromptModal from '../AuthPromptModal';

const BookingWidget = ({
  listing,
  handleInputChange
}) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const isAuthenticated = token && user;
  

  


  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingField === 'rate') {
      const event = {
        target: { name: 'rate', value: editValue }
      };
      handleInputChange(event);
    } else if (editingField.startsWith('max')) {
      const event = {
        target: { name: editingField, value: editValue }
      };
      handleInputChange(event);
    }
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };
  
  return (
    <div className="border rounded-xl p-3 sm:p-4 md:p-6 shadow-lg bg-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-1 sm:gap-2 mb-2">
            <div className="text-lg sm:text-xl font-semibold">
              ₹
              {editingField === 'rate' ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-16 sm:w-20 p-1 text-lg sm:text-xl font-semibold border-b border-rose-500 focus:outline-none bg-transparent"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1">
                    <FiCheck size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <button onClick={cancelEdit} className="text-red-600 hover:text-red-700 p-1">
                    <FiX size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              ) : (
                <span 
                  onClick={() => startEditing('rate', listing.rate || '')}
                  className="w-16 sm:w-20 p-1 text-lg sm:text-xl font-semibold border-b border-transparent hover:border-gray-300 cursor-pointer inline-block"
                >
                  {listing.rate || '0'}
                </span>
              )}
            </div>
            <span className="text-sm sm:text-base font-normal"> night</span>
            <FiEdit3 className="text-gray-400" size={14} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Click to edit nightly rate</p>
        </div>
      </div>
        

        
      {/* Guest Limits - Clickable to Edit */}
              <div className="border-t pt-2 sm:pt-3 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Guest Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div>
            <label className="block text-gray-600 mb-1 text-xs sm:text-sm">Max Adults</label>
            {editingField === 'maxAdults' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                  max="20"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1">
                  <FiCheck size={12} />
                </button>
                <button onClick={cancelEdit} className="text-red-600 hover:text-red-700 p-1">
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => startEditing('maxAdults', listing.maxAdults || 16)}
                className="w-full p-1 sm:p-2 border rounded text-xs sm:text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {listing.maxAdults || 16}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-xs sm:text-sm">Max Children</label>
            {editingField === 'maxChildren' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                  max="10"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1">
                  <FiCheck size={12} />
                </button>
                <button onClick={cancelEdit} className="text-red-600 hover:text-red-700 p-1">
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => startEditing('maxChildren', listing.maxChildren || 5)}
                className="w-full p-1 sm:p-2 border rounded text-xs sm:text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {listing.maxChildren || 5}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-xs sm:text-sm">Max Infants</label>
            {editingField === 'maxInfants' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                  max="10"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1">
                  <FiCheck size={12} />
                </button>
                <button onClick={cancelEdit} className="text-red-600 hover:text-red-700 p-1">
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => startEditing('maxInfants', listing.maxInfants || 5)}
                className="w-full p-1 sm:p-2 border rounded text-xs sm:text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {listing.maxInfants || 5}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-xs sm:text-sm">Max Pets</label>
            {editingField === 'maxPets' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-1 sm:p-2 border rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                  max="5"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1">
                  <FiCheck size={12} />
                </button>
                <button onClick={cancelEdit} className="text-red-600 hover:text-red-700 p-1">
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => startEditing('maxPets', listing.maxPets || 2)}
                className="w-full p-1 sm:p-2 border rounded text-xs sm:text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {listing.maxPets || 2}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Guest and Room Form Inputs */}
      <div className="mt-4 sm:mt-6">
        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-gray-800">Property Capacity</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500 truncate leading-tight mb-1">Guests</p>
            <input
              type="number"
              name="maxInRoom"
              value={listing.maxInRoom || 2}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-center sm:text-left text-sm"
              min="1"
              max="50"
            />
        </div>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500 truncate leading-tight mb-1">Rooms</p>
            <input
              type="number"
              name="totalRoom"
              value={listing.totalRoom || 1}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-center sm:text-left text-sm"
              min="1"
              max="20"
            />
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Please login to manage bookings"
      />
    </div>
  );
};

export default BookingWidget;
