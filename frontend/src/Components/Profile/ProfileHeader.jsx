import React from 'react';

const ProfileHeader = () => {
  return (
    <div className="shadow-lg" style={{ backgroundColor: '#f3eadb' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Profile Dashboard</h1>
          <p className="text-lg text-gray-700">Manage your account, bookings, and preferences</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
