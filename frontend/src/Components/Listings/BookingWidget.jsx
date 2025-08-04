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
    <div className="border rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xl font-semibold">
              ₹
              {editingField === 'rate' ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-20 p-1 text-xl font-semibold border-b border-rose-500 focus:outline-none bg-transparent"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-green-600 hover:text-green-700">
                    <FiCheck size={16} />
                  </button>
                  <button onClick={cancelEdit} className="text-red-600 hover:text-red-700">
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <span 
                  onClick={() => startEditing('rate', listing.rate || '')}
                  className="w-20 p-1 text-xl font-semibold border-b border-transparent hover:border-gray-300 cursor-pointer inline-block"
                >
                  {listing.rate || '0'}
                </span>
              )}
            </p>
            <span className="text-base font-normal"> night</span>
            <FiEdit3 className="text-gray-400" size={16} />
          </div>
          <p className="text-xs text-gray-500">Click to edit nightly rate</p>
        </div>
      </div>
        
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="checkin" className="text-xs font-semibold block mb-1">CHECK-IN</label>
            <DatePicker
              id="checkin"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Add date"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              popperPlacement="auto"
            />
          </div>
          <div>
            <label htmlFor="checkout" className="text-xs font-semibold block mb-1">CHECKOUT</label>
            <DatePicker
              id="checkout"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Add date"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              popperPlacement="auto"
            />
          </div>
        </div>
        
        <div className="mt-4 border rounded-lg p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">Adults</h3>
                <p className="text-xs text-gray-500">Age 13+</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('adults', 'decrement')}
                  disabled={guestCount.adults <= 1}
                  className={`p-1 rounded-full ${guestCount.adults <= 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiMinus />
                </button>
                <span className="mx-2 w-6 text-center">{guestCount.adults}</span>
                <button 
                  onClick={() => handleGuestChange('adults', 'increment')}
                  disabled={guestCount.adults >= (listing.maxAdults || 16)}
                  className={`p-1 rounded-full ${guestCount.adults >= (listing.maxAdults || 16) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">Children</h3>
                <p className="text-xs text-gray-500">Ages 2–12</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('children', 'decrement')}
                  disabled={guestCount.children <= 0}
                  className={`p-1 rounded-full ${guestCount.children <= 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiMinus />
                </button>
                <span className="mx-2 w-6 text-center">{guestCount.children}</span>
                <button 
                  onClick={() => handleGuestChange('children', 'increment')}
                  disabled={guestCount.children >= (listing.maxChildren || 5)}
                  className={`p-1 rounded-full ${guestCount.children >= (listing.maxChildren || 5) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">Infants</h3>
                <p className="text-xs text-gray-500">Under 2</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('infants', 'decrement')}
                  disabled={guestCount.infants <= 0}
                  className={`p-1 rounded-full ${guestCount.infants <= 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiMinus />
                </button>
                <span className="mx-2 w-6 text-center">{guestCount.infants}</span>
                <button 
                  onClick={() => handleGuestChange('infants', 'increment')}
                  disabled={guestCount.infants >= (listing.maxInfants || 5)}
                  className={`p-1 rounded-full ${guestCount.infants >= (listing.maxInfants || 5) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Pets</h3>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleGuestChange('pets', 'decrement')}
                  disabled={guestCount.pets <= 0}
                  className={`p-1 rounded-full ${guestCount.pets <= 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiMinus />
                </button>
                <span className="mx-2 w-6 text-center">{guestCount.pets}</span>
                <button 
                  onClick={() => handleGuestChange('pets', 'increment')}
                  disabled={guestCount.pets >= (listing.maxPets || 2)}
                  className={`p-1 rounded-full ${guestCount.pets >= (listing.maxPets || 2) ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Guest Limits - Clickable to Edit */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Guest Limits (Click to edit)</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-gray-600 mb-1">Max Adults</label>
            {editingField === 'maxAdults' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-1 border rounded text-xs"
                  min="1"
                  max="20"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-green-600">
                  <FiCheck size={12} />
                </button>
                <button onClick={cancelEdit} className="text-red-600">
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => startEditing('maxAdults', listing.maxAdults || 16)}
                className="w-full p-1 border rounded text-xs cursor-pointer hover:bg-white"
              >
                {listing.maxAdults || 16}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Max Children</label>
            {editingField === 'maxChildren' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-1 border rounded text-xs"
                  min="0"
                  max="10"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-green-600">
                  <FiCheck size={12} />
                </button>
                <button onClick={cancelEdit} className="text-red-600">
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => startEditing('maxChildren', listing.maxChildren || 5)}
                className="w-full p-1 border rounded text-xs cursor-pointer hover:bg-white"
              >
                {listing.maxChildren || 5}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Max Infants</label>
            {editingField === 'maxInfants' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-1 border rounded text-xs"
                  min="0"
                  max="10"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-green-600">
                  <FiCheck size={12} />
                </button>
                <button onClick={cancelEdit} className="text-red-600">
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => startEditing('maxInfants', listing.maxInfants || 5)}
                className="w-full p-1 border rounded text-xs cursor-pointer hover:bg-white"
              >
                {listing.maxInfants || 5}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Max Pets</label>
            {editingField === 'maxPets' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-1 border rounded text-xs"
                  min="0"
                  max="5"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-green-600">
                  <FiCheck size={12} />
                </button>
                <button onClick={cancelEdit} className="text-red-600">
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => startEditing('maxPets', listing.maxPets || 2)}
                className="w-full p-1 border rounded text-xs cursor-pointer hover:bg-white"
              >
                {listing.maxPets || 2}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button 
        className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        disabled={!startDate || !endDate}
      >
        Reserve
      </button>
      
      <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
        <div>
          <p className="text-gray-600">
            ₹{listing.rate || 0} x {nights > 0 ? nights : 0} nights
          </p>
        </div>
        <div className="text-right">
          <p>₹{nights > 0 ? parseInt(listing.rate || 0) * nights : 0}</p>
        </div>
        <div className="col-span-2 border-t mt-2 pt-4">
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>₹{calculateTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;
