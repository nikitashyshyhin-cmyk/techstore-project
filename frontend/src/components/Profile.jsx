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

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      try {
        const response = await axiosInstance.get('/api/users/me');

        setUser(response.data);

        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || ''
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const fallbackUser = {
          name: 'Artem Danshyn',
          email: 'example@gmail.com',
          phone: '+380501234567'
        };

        setUser(fallbackUser);
        setFormData(fallbackUser);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);

    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const userInitial =
    user?.name?.trim().charAt(0).toUpperCase() || 'A';

  const tabs = [
    { id: 'profile', label: 'Профіль', icon: profileIcon },
    { id: 'wishlist', label: 'Список бажань', icon: wishlistIcon },
    { id: 'orders', label: 'Історія покупок', icon: ordersIcon },
    { id: 'logout', label: 'Вийти', icon: logoutIcon },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4B32B1] animate-pulse">
        Завантаження профілю...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-t from-[#E5E0FF] to-white flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-[1250px] min-h-[650px] rounded-2xl shadow-sm flex overflow-hidden border border-gray-50">

        <div className="w-[320px] border-r border-gray-100 p-10 flex flex-col items-center">
          <div className="w-28 h-28 bg-[#4B32B1] rounded-full flex items-center justify-center text-white text-4xl font-bold mb-6">
            {userInitial}
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
                    ? 'bg-[#4B32B1] text-white'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <img
                  src={tab.icon}
                  alt=""
                  className={`w-5 h-5 ${
                    activeTab === tab.id
                      ? 'brightness-0 invert'
                      : ''
                  }`}
                />

                <span className="text-sm font-medium">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-16 flex flex-col items-center">
          {activeTab === 'profile' ? (
            <div className="w-full max-w-[500px]">
              <h1 className="text-2xl text-gray-400 font-light tracking-wider mb-10 text-center">
                Персональна інформація
              </h1>

              <div className="space-y-6">
                {[
                  { label: 'Email Address', key: 'email' },
                  { label: 'Full Name', key: 'name' },
                  { label: 'Phone Number', key: 'phone' }
                ].map((field) => (
                  <div
                    key={field.key}
                    className="p-5 rounded-xl border bg-gray-50"
                  >
                    <label className="text-[10px] uppercase text-gray-300 font-bold tracking-widest block mb-1">
                      {field.label}
                    </label>

                    <input
                      type={
                        field.key === 'email'
                          ? 'email'
                          : 'text'
                      }
                      name={field.key}
                      value={
                        isEditing
                          ? formData[field.key]
                          : user[field.key]
                      }
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-transparent text-sm font-medium focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-8 flex justify-center gap-4">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-[#4B32B1] text-white px-20 py-4 rounded-lg"
                  >
                    Редагувати
                  </button>
                ) : (
                  <>
                    <button className="bg-green-600 text-white px-12 py-4 rounded-lg">
                      Зберегти зміни
                    </button>

                    <button
                      onClick={handleCancel}
                      className="bg-white border border-gray-200 text-gray-500 px-12 py-4 rounded-lg"
                    >
                      Скасувати
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 italic">
                Контент відсутній
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;