import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

import profileIcon from '../assets/profile.png';
import wishlistIcon from '../assets/wishlist.png';
import ordersIcon from '../assets/orders.png';
import logoutIcon from '../assets/logout.png';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Коли бекенд буде готовий, цей запит запрацює
        const response = await axiosInstance.get('/api/users/me');
        setUser(response.data);
      } catch (err) {
        // Тимчасова заглушка для тестування UI, поки бекенд-задача не замерджена
        setUser({
          name: 'firstName lastName',
          email: 'example@gmail.com',
          phone: '+380 50 123 45 67'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || 'A';

  const tabs = [
    { id: 'profile', label: 'Профіль', icon: profileIcon },
    { id: 'wishlist', label: 'Список бажань', icon: wishlistIcon },
    { id: 'orders', label: 'Історія покупок', icon: ordersIcon },
    { id: 'logout', label: 'Вийти', icon: logoutIcon },
  ];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-[#4B32B1] animate-pulse">Завантаження профілю...</div>;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-t from-[#E5E0FF] to-white flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-[1250px] min-h-[650px] rounded-2xl shadow-sm flex overflow-hidden border border-gray-50">
        
        {/* SIDEBAR */}
        <div className="w-[320px] border-r border-gray-100 p-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-[#4B32B1] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-[#4B32B1]/10">
            {userInitial}
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-1">Особистий кабінет</h2>
          <p className="text-gray-400 text-[13px] text-center mb-10">Керуйте своїм обліковим записом</p>

          <div className="w-full space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.id === 'logout' ? handleLogout() : setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id 
                  ? 'bg-[#4B32B1] text-white shadow-md' 
                  : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <img src={tab.icon} alt="" className={`w-5 h-5 ${activeTab === tab.id ? 'brightness-0 invert' : ''}`} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-16 flex flex-col items-center justify-center">
          {activeTab === 'profile' ? (
            <>
              <h1 className="text-2xl text-gray-400 font-light mb-12 tracking-wider">Персональна інформація</h1>
              <div className="w-full max-w-[500px] space-y-5">
                {[
                  { label: 'Email Address', value: user.email, icon: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/> },
                  { label: 'Full Name', value: user.name, icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/> },
                  { label: 'Phone Number', value: user.phone, icon: <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/> }
                ].map((field, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 bg-gray-50/80 rounded-lg border border-gray-100 shadow-sm">
                    <div className="text-gray-300 ml-2">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{field.icon}</svg>
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase text-gray-300 font-bold tracking-widest block mb-1">{field.label}</label>
                      <p className="text-gray-600 text-sm font-medium">{field.value || 'Не вказано'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="text-6xl opacity-10">{activeTab === 'wishlist' ? '💜' : '📋'}</div>
              <p className="text-gray-400 italic">
                {activeTab === 'wishlist' ? 'Ваш список бажань поки що порожній...' : 'Ви ще не зробили жодного замовлення.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;