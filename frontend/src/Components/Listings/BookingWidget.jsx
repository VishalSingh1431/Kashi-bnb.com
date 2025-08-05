import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiPlus, FiMinus, FiEdit3, FiCheck, FiX } from "react-icons/fi";

const BookingWidget = ({
  listing,
  startDate,
  endDate,
  guestCount,
  setStartDate,
  setEndDate,
  setGuestCount,
  calculateTotal,
  handleInputChange
}) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const nights = startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0;
  
  const handleGuestChange = (type, action) => {
    setGuestCount(prev => ({
      ...prev,
      [type]: action === 'increment' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

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
        
      <div className="mb-3 sm:mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div>
            <label htmlFor="checkin" className="text-xs font-semibold block mb-1 text-gray-700">CHECK-IN</label>
            <DatePicker
              id="checkin"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Add date"
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
              popperPlacement="auto"
            />
          </div>
          <div>
            <label htmlFor="checkout" className="text-xs font-semibold block mb-1 text-gray-700">CHECKOUT</label>
            <DatePicker
              id="checkout"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Add date"
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
              popperPlacement="auto"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-3 sm:pt-4 mb-3 sm:mb-4">
        <label className="text-xs font-semibold block mb-2 text-gray-700">GUESTS</label>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center py-1">
            <div className="flex-1 min-w-0">
              <span className="font-medium text-xs sm:text-sm md:text-base leading-tight">Adults</span>
              <p className="text-xs text-gray-500 leading-tight truncate">Ages 13 or above</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => handleGuestChange('adults', 'decrement')}
                className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition disabled:opacity-50"
                disabled={guestCount.adults <= 1}
              >
                <FiMinus size={10} className="sm:w-3 sm:h-3" />
              </button>
              <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{guestCount.adults}</span>
              <button 
                onClick={() => handleGuestChange('adults', 'increment')}
                className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition"
              >
                <FiPlus size={10} className="sm:w-3 sm:h-3" />
              </button>
            </div>
          </div>
            
          <div className="flex justify-between items-center py-1">
            <div className="flex-1 min-w-0">
              <span className="font-medium text-xs sm:text-sm md:text-base leading-tight">Children</span>
              <p className="text-xs text-gray-500 leading-tight truncate">Ages 2-12</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => handleGuestChange('children', 'decrement')}
                className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition disabled:opacity-50"
                disabled={guestCount.children <= 0}
              >
                <FiMinus size={10} className="sm:w-3 sm:h-3" />
              </button>
              <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{guestCount.children}</span>
              <button 
                onClick={() => handleGuestChange('children', 'increment')}
                className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition"
              >
                <FiPlus size={10} className="sm:w-3 sm:h-3" />
              </button>
            </div>
          </div>
            
          <div className="flex justify-between items-center py-1">
            <div className="flex-1 min-w-0">
              <span className="font-medium text-xs sm:text-sm md:text-base leading-tight">Infants</span>
              <p className="text-xs text-gray-500 leading-tight truncate">Under 2</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => handleGuestChange('infants', 'decrement')}
                className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition disabled:opacity-50"
                disabled={guestCount.infants <= 0}
              >
                <FiMinus size={10} className="sm:w-3 sm:h-3" />
              </button>
              <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{guestCount.infants}</span>
              <button 
                onClick={() => handleGuestChange('infants', 'increment')}
                className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition"
              >
                <FiPlus size={10} className="sm:w-3 sm:h-3" />
              </button>
            </div>
          </div>
            
          <div className="flex justify-between items-center py-1">
            <div className="flex-1">
              <span className="font-medium text-sm sm:text-base">Pets</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => handleGuestChange('pets', 'decrement')}
                className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition disabled:opacity-50"
                disabled={guestCount.pets <= 0}
              >
                <FiMinus size={10} className="sm:w-3 sm:h-3" />
              </button>
              <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{guestCount.pets}</span>
              <button 
                onClick={() => handleGuestChange('pets', 'increment')}
                className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition"
              >
                <FiPlus size={10} className="sm:w-3 sm:h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
        
      {/* Guest Limits - Clickable to Edit */}
      <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
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
      
      <button 
        className="w-full bg-rose-500 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-rose-600 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        disabled={!startDate || !endDate}
      >
        Reserve
      </button>
      
      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-sm">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            ₹{listing.rate || 0} x {nights > 0 ? nights : 0} nights
          </p>
          <p className="font-medium">₹{nights > 0 ? parseInt(listing.rate || 0) * nights : 0}</p>
        </div>
        <div className="border-t pt-3 sm:pt-4 mb-3 sm:mb-4">
          <div className="flex justify-between font-semibold text-base sm:text-lg">
            <p>Total</p>
            <p>₹{calculateTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;
