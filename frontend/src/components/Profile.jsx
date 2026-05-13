import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import profileIcon from '../assets/profile.png';
import wishlistIcon from '../assets/wishlist.png';
import ordersIcon from '../assets/orders.png';
import logoutIcon from '../assets/logout.png';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Профіль', icon: profileIcon },
    { id: 'wishlist', label: 'Список бажань', icon: wishlistIcon },
    { id: 'orders', label: 'Історія покупок', icon: ordersIcon },
    { id: 'logout', label: 'Вийти', icon: logoutIcon },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-t from-[#E5E0FF] to-white flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-[1250px] min-h-[650px] rounded-2xl shadow-sm flex overflow-hidden border border-gray-50">
        
        {/* SIDEBAR */}
        <div className="w-[320px] border-r border-gray-100 p-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-[#4B32B1] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-[#4B32B1]/10">
            A
          </div>

          <h2 className="text-xl font-medium text-gray-700 mb-1">
            Особистий кабінет
          </h2>

          <p className="text-gray-400 text-[13px] text-center mb-10">
            Керуйте своїм обліковим записом
          </p>

          <div className="w-full space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  tab.id === 'logout'
                    ? handleLogout()
                    : setActiveTab(tab.id)
                }
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#4B32B1] text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <img
                  src={tab.icon}
                  alt=""
                  className={`w-5 h-5 ${
                    activeTab === tab.id ? 'brightness-0 invert' : ''
                  }`}
                />

                <span className="text-sm font-medium">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-16 flex items-center justify-center">
          <h1 className="text-2xl text-gray-300 font-light tracking-wider">
            {activeTab === 'profile' && 'Персональна інформація'}
            {activeTab === 'wishlist' && 'Список бажань'}
            {activeTab === 'orders' && 'Історія покупок'}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Profile;