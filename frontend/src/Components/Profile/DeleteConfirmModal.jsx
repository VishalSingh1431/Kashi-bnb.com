import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const DeleteConfirmModal = ({ deleteConfirm, onCancel, onDelete }) => {
  if (!deleteConfirm) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <FiTrash2 className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
            <div className="mt-2 px-7 pt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
              </p>
              <p className="text-sm text-red-500 mt-2">
                This will also delete all associated data (hotels, bookings, etc.).
              </p>
            </div>
          </div>
          <div className="items-center px-4 py-3 mt-4">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
