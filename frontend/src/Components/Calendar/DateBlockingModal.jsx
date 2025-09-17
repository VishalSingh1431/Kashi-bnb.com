import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiX, FiCalendar, FiAlertCircle, FiSave } from 'react-icons/fi';
import axios from '../../utils/axiosConfig';

const DateBlockingModal = ({ isOpen, onClose, hotelId, onBlockSuccess }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (startDate >= endDate) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/v1/calendar/block-dates', {
        hotelId,
        from: startDate.toISOString(),
        to: endDate.toISOString(),
        reason
      });

      if (response.data.success) {
        onBlockSuccess();
        onClose();
        setStartDate(null);
        setEndDate(null);
        setReason('');
      }
    } catch (error) {
      console.error('Error blocking dates:', error);
      setError(error.response?.data?.message || 'Failed to block dates');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStartDate(null);
    setEndDate(null);
    setReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <FiCalendar className="text-red-600" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Block Dates</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                placeholderText="Select start date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                placeholderText="Select end date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Maintenance, Personal use, etc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={3}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <FiAlertCircle className="text-red-600" size={16} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiSave size={16} />
                    Block Dates
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DateBlockingModal;
