import React from 'react';
import { FiPlus, FiUser, FiTrash2 } from 'react-icons/fi';

const AccessRequests = ({ accessRequests, requestsLoading, error, handlePromoteUser, handleDeleteRequest }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Access Requests</h1>
    {requestsLoading ? (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    ) : error ? (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    ) : (
      <div className="space-y-6">
        {accessRequests.length > 0 ? (
          accessRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{request.email}</h3>
                  <p className="text-gray-600">{request.phone}</p>
                  <p className="text-gray-600 mt-2">{request.message}</p>
                  <p className="text-sm text-indigo-600 mt-1">
                    Requested as: {request.type === 'admin' ? 'Admin' : 'Hotel Owner'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {request.type === 'hotelowner' && (
                    <button
                      onClick={() => handlePromoteUser(request.email, 'hotelowner')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                    >
                      <FiPlus className="mr-2" /> Approve Hotel Owner
                    </button>
                  )}
                  {request.type === 'admin' && (
                    <button
                      onClick={() => handlePromoteUser(request.email, 'admin')}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    >
                      <FiUser className="mr-2" /> Promote to Admin
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteRequest(request.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                  >
                    <FiTrash2 className="mr-2" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending access requests.</p>
          </div>
        )}
      </div>
    )}
  </div>
);

export default AccessRequests; 