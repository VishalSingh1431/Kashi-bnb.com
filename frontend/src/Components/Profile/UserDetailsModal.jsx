import React from 'react';
import { FiX } from 'react-icons/fi';

const UserDetailsModal = ({ showModal, selectedUser, onClose }) => {
  if (!showModal || !selectedUser) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">User Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">
                {selectedUser.first_name && selectedUser.last_name 
                  ? `${selectedUser.first_name} ${selectedUser.last_name}` 
                  : selectedUser.name || 'Not provided'
                }
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
            </div>
            
            {selectedUser.mobile && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.mobile}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1 text-sm text-gray-900">
                {selectedUser.verified ? 'Verified' : 'Unverified'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Roles</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedUser.is_admin && <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Admin</span>}
                {selectedUser.has_hotel && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Hotel Owner</span>}
                {selectedUser.has_restr && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Restaurant Owner</span>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Joined</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
