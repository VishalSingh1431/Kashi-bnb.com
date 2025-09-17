import React from 'react';
import { FiDollarSign, FiLink, FiInfo } from 'react-icons/fi';

const AdditionalChargesForm = ({ listing, handleInputChange }) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-green-100 rounded-lg mr-3">
          <FiDollarSign className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Additional Charges & Integration</h3>
          <p className="text-sm text-gray-600">Set extra charges and integrate with other platforms</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Pet Charge */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pet Charge (per night)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">₹</span>
            </div>
            <input
              type="number"
              name="petCharge"
              value={listing.petCharge || ''}
              onChange={handleInputChange}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Additional charge for guests bringing pets
          </p>
        </div>

        {/* Extra Adult Charge */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extra Adult Charge (per night, beyond limit)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">₹</span>
            </div>
            <input
              type="number"
              name="extraAdultCharge"
              value={listing.extraAdultCharge || ''}
              onChange={handleInputChange}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Charge for each adult beyond the maximum limit
          </p>
        </div>

        {/* iCal Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            iCal Calendar Link (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLink className="text-gray-400" size={16} />
            </div>
            <input
              type="url"
              name="icalLink"
              value={listing.icalLink || ''}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://calendar.google.com/calendar/ical/..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Import your calendar from other booking platforms (Airbnb, Booking.com, etc.)
          </p>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start">
            <FiInfo className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" size={16} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="space-y-1 text-xs">
                <li>• Pet charges apply per pet per night</li>
                <li>• Extra adult charges apply for each adult beyond your maximum limit</li>
                <li>• iCal links help sync availability across platforms</li>
                <li>• Leave fields empty if no additional charges apply</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalChargesForm;

