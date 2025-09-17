import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND } from '../assets/Vars';
import { FiUsers, FiHome, FiUserPlus, FiEye, FiShield, FiCoffee } from 'react-icons/fi';

const TeamMemberDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.is_team_member) {
      nav('/');
      return;
    }

    fetchUsers();
  }, [nav, user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND}/api/v1/team/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToHotelOwner = async (userId) => {
    try {
      await axios.patch(`${BACKEND}/api/v1/team/users/${userId}/promote-hotel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update user in state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, has_hotel: true } : u
      ));
      
      alert('User promoted to hotel owner successfully');
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('Failed to promote user: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.mobile?.includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || 
                       (filterRole === 'hoteler' && user.has_hotel) ||
                       (filterRole === 'restaurant' && user.has_restr) ||
                       (filterRole === 'regular' && !user.has_hotel && !user.has_restr);
    
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user?.is_team_member) return null;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Member Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users and promote them to hotel/restaurant owners</p>
          </div>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FiShield className="h-4 w-4" />
            Admin Panel
          </Link>
        </div>
        
        {/* Team Member Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <FiUsers className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Team Member Access</h3>
              <p className="text-blue-700 text-sm">
                As a team member, you can promote users to hotel owners and restaurant owners. You can also view and manage user listings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">All Users</option>
          <option value="hoteler">Hotel Owners</option>
          <option value="restaurant">Restaurant Owners</option>
          <option value="regular">Regular Users</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <FiUsers className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.mobile && (
                        <div className="text-sm text-gray-500">{user.mobile}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.has_hotel && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <FiHome className="h-3 w-3 mr-1" />
                            Hotel Owner
                          </span>
                        )}
                        {user.has_restr && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FiCoffee className="h-3 w-3 mr-1" />
                            Restaurant Owner
                          </span>
                        )}
                        {!user.has_hotel && !user.has_restr && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Regular User
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {!user.has_hotel && (
                          <button
                            onClick={() => handlePromoteToHotelOwner(user.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Promote to Hotel Owner"
                          >
                            <FiUserPlus className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMemberDashboard;
