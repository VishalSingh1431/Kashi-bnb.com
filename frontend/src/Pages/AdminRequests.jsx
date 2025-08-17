import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND } from '../assets/Vars';
import { useAuth } from '../App';
import { FiCheck, FiX, FiEye, FiUser, FiMail, FiPhone, FiCalendar, FiHome, FiClock, FiAlertCircle } from 'react-icons/fi';

const AdminRequests = () => {
  const [requests, setRequests] = useState({ pending: [], approved: [], rejected: [], declined: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const nav = useNavigate();
  const { user, refreshUserData } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !user.is_admin) {
      nav('/');
      return;
    }

    fetchRequests();
  }, [nav, user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND}/api/v1/admin/request`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    try {
      setProcessing(true);
      const response = await axios.post(`${BACKEND}/api/v1/admin/makeHoteler`, {
        email: request.email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Refresh requests
        await fetchRequests();
        
        // Show success message
        alert(`User ${request.email} promoted to hotel owner successfully!`);
        
        // If this is the current user, refresh their data
        if (request.email === user.email) {
          await refreshUserData();
        }
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (request) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    try {
      setProcessing(true);
      const response = await axios.post(`${BACKEND}/api/v1/admin/rejectHoteler`, {
        email: request.email,
        reason: reason || 'Request rejected by admin'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Refresh requests
        await fetchRequests();
        alert(`Request for ${request.email} rejected successfully!`);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'declined': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheck className="text-green-600" />;
      case 'rejected': return <FiX className="text-red-600" />;
      case 'declined': return <FiAlertCircle className="text-orange-600" />;
      default: return <FiClock className="text-blue-600" />;
    }
  };

  if (!user?.is_admin) return null;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hotel Owner Requests</h1>
        <p className="text-gray-600 mt-2">Manage hotel owner access requests</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {Object.entries(requests).map(([status, statusRequests]) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === status
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusRequests.length})
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading requests...</p>
          </div>
        ) : requests[activeTab]?.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiHome className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No {activeTab} requests found</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            {requests[activeTab]?.map((request) => (
              <div key={request.id} className="border-b border-gray-200 last:border-b-0">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status || 'pending'}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(request.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <FiUser className="text-gray-400" />
                          <span className="font-medium">{request.email}</span>
                        </div>
                        {request.phone && (
                          <div className="flex items-center space-x-2">
                            <FiPhone className="text-gray-400" />
                            <span className="text-gray-600">{request.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      {request.message && (
                        <p className="text-gray-600 mt-2 text-sm">{request.message}</p>
                      )}
                      
                      {request.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                          <span className="font-medium text-red-800">Rejection Reason:</span>
                          <span className="text-red-700 ml-2">{request.rejectionReason}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Details"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      
                      {activeTab === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request)}
                            disabled={processing}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                          >
                            <FiCheck className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          
                          <button
                            onClick={() => handleReject(request)}
                            disabled={processing}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                          >
                            <FiX className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Request Details</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Email:</label>
                <p className="text-gray-900">{selectedRequest.email}</p>
              </div>
              
              {selectedRequest.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone:</label>
                  <p className="text-gray-900">{selectedRequest.phone}</p>
                </div>
              )}
              
              {selectedRequest.message && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Message:</label>
                  <p className="text-gray-900">{selectedRequest.message}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <p className="text-gray-900 capitalize">{selectedRequest.status || 'pending'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Requested:</label>
                <p className="text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
