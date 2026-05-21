import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

import profileIcon from '../assets/profile.png';
import wishlistIcon from '../assets/wishlist.png';
import ordersIcon from '../assets/orders.png';
import logoutIcon from '../assets/logout.png';
import securityIcon from '../assets/security.png';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Стани для редагування профілю
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState(null); 
  const [isSaving, setIsSaving] = useState(false);

  // Стани для зміни пароля
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  // Об'єкт для відстеження видимості паролів ({ currentPassword: false, ... })
  const [showPasswords, setShowPasswords] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [pwdErrors, setPwdErrors] = useState({});
  const [pwdStatusMsg, setPwdStatusMsg] = useState(null);
  const [isSavingPwd, setIsSavingPwd] = useState(false);

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

  // --- ЛОГІКА РЕДАГУВАННЯ ПРОФІЛЮ ---
  const validateField = (name, value) => {
    let error = null;
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = "Email є обов'язковим";
      else if (!emailRegex.test(value)) error = "Невірний формат Email";
    }
    if (name === 'name') {
      const nameRegex = /^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґ']+\s[A-ZА-ЯІЇЄҐ][a-zа-яіїєґ']+$/;
      if (!value.trim()) error = "Ім'я не може бути порожнім";
      else if (!nameRegex.test(value.trim())) error = "Введіть ім'я та прізвище (2 слова з великої літери)";
    }
    if (name === 'phone') {
      const phoneRegex = /^\+380\d{9}$/;
      if (!value.trim()) error = "Номер телефону обов'язковий";
      else if (!phoneRegex.test(value)) error = "Формат: +380XXXXXXXXX (12 цифр)";
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    if (statusMsg) setStatusMsg(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setStatusMsg(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: user.name, email: user.email, phone: user.phone });
    setErrors({});
    setStatusMsg(null);
  };

  const handleSubmitProfile = async () => {
    const newErrors = {
      email: validateField('email', formData.email),
      name: validateField('name', formData.name),
      phone: validateField('phone', formData.phone)
    };
    
    const activeErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v != null));
    setErrors(activeErrors);

    if (Object.keys(activeErrors).length > 0) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const response = await axiosInstance.put('/api/users/me', formData);
      setUser(response.data);
      setIsEditing(false);
      setStatusMsg({ type: 'success', text: '✓ Дані успішно оновлено' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors(prev => ({ ...prev, email: 'Користувач з таким Email вже існує.' }));
      } else {
        setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Помилка оновлення профілю.' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // --- ЛОГІКА ЗМІНИ ПАРОЛЯ ---
  const validatePwdField = (name, value, allValues = pwdData) => {
    let error = null;
    if (name === 'currentPassword' && !value) {
      error = "Введіть поточний пароль";
    }
    if (name === 'newPassword') {
      if (!value) error = "Введіть новий пароль";
      else if (value.length < 6) error = "Пароль має містити мінімум 6 символів"; 
    }
    if (name === 'confirmPassword') {
      if (!value) error = "Підтвердіть новий пароль";
      else if (value !== allValues.newPassword) error = "Паролі не співпадають";
    }
    return error;
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    const newPwdData = { ...pwdData, [name]: value };
    setPwdData(newPwdData);
    
    const newErrors = { ...pwdErrors };
    newErrors[name] = validatePwdField(name, value, newPwdData);
    if (name === 'newPassword' && newPwdData.confirmPassword) {
      newErrors.confirmPassword = validatePwdField('confirmPassword', newPwdData.confirmPassword, newPwdData);
    }
    
    setPwdErrors(newErrors);
    if (pwdStatusMsg) setPwdStatusMsg(null);
  };

  // Функція перемикання видимості пароля
  const togglePasswordVisibility = (key) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmitPassword = async () => {
    const newErrors = {
      currentPassword: validatePwdField('currentPassword', pwdData.currentPassword),
      newPassword: validatePwdField('newPassword', pwdData.newPassword),
      confirmPassword: validatePwdField('confirmPassword', pwdData.confirmPassword)
    };
    
    const activeErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v != null));
    setPwdErrors(activeErrors);

    if (Object.keys(activeErrors).length > 0) return;

    setIsSavingPwd(true);
    setPwdStatusMsg(null);

    try {
      await axiosInstance.put('/api/users/me/password', {
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword,
        confirmPassword: pwdData.confirmPassword
      });
      
      setPwdStatusMsg({ type: 'success', text: '✓ Пароль успішно змінено' });
      // Очищаємо форму та видимість
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswords({ currentPassword: false, newPassword: false, confirmPassword: false });
      setTimeout(() => setPwdStatusMsg(null), 3000);
    } catch (err) {
      setPwdStatusMsg({ type: 'error', text: err.response?.data?.message || 'Неправильний поточний пароль або помилка сервера.' });
    } finally {
      setIsSavingPwd(false);
    }
  };

  const hasProfileChanges = user && JSON.stringify(formData) !== JSON.stringify({ name: user.name, email: user.email, phone: user.phone });
  const hasProfileErrors = Object.values(errors).some(err => err !== null) || !formData.name || !formData.email || !formData.phone;
  const canSaveProfile = hasProfileChanges && !hasProfileErrors;

  const canSavePwd = pwdData.currentPassword && pwdData.newPassword && pwdData.confirmPassword && !Object.values(pwdErrors).some(err => err !== null);

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || 'A';

  const tabs = [
    { id: 'profile', label: 'Профіль', icon: profileIcon },
    { id: 'security', label: 'Безпека', icon: securityIcon },
    { id: 'wishlist', label: 'Список бажань', icon: wishlistIcon },
    { id: 'orders', label: 'Історія покупок', icon: ordersIcon },
    { id: 'logout', label: 'Вийти', icon: logoutIcon },
  ];

  // Іконки ока (Lucide)
  const eyeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const eyeOffIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-[#4B32B1] animate-pulse">Завантаження профілю...</div>;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-t from-[#E5E0FF] to-white flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-[1250px] min-h-[650px] rounded-2xl shadow-sm flex overflow-hidden border border-gray-50">
        
        {/* SIDEBAR */}
        <div className="w-[320px] border-r border-gray-100 p-10 flex flex-col items-center">
          <div className="w-28 h-28 bg-[#4B32B1] rounded-full flex items-center justify-center text-white text-4xl font-bold mb-6 shadow-xl shadow-[#4B32B1]/10 transition-all duration-500">
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
                <img src={tab.icon} alt="" className={`w-5 h-5 ${activeTab === tab.id ? 'brightness-0 invert' : ''} ${tab.id === 'security' && activeTab !== 'security' ? 'opacity-60' : ''}`} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-16 flex flex-col items-center justify-start overflow-y-auto relative">
          
          {/* ТАБ: ПРОФІЛЬ */}
          {activeTab === 'profile' && (
            <div className="w-full max-w-[500px] mx-auto mt-4 animate-fade-in relative z-10">
              <h1 className="text-2xl text-gray-400 font-light tracking-wider mb-10 text-center">Персональна інформація</h1>

              {statusMsg && statusMsg.type === 'error' && (
                <div className="mb-6 p-4 rounded-lg text-sm font-medium border bg-red-50 text-red-600 border-red-200">
                  {statusMsg.text}
                </div>
              )}

              <div className="space-y-6">
                {[
                  { label: 'Email Address', key: 'email', icon: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/> },
                  { label: 'Full Name', key: 'name', icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/> },
                  { label: 'Phone Number', key: 'phone', icon: <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/> }
                ].map((field, idx) => (
                  <div key={idx} className="relative z-10">
                    <div className={`flex items-center gap-4 p-5 rounded-xl border shadow-sm transition-all duration-300 ${isEditing ? 'bg-white border-gray-200' : 'bg-gray-50/80 border-gray-100'} ${errors[field.key] ? 'border-red-300 bg-red-50/30' : ''}`}>
                      <div className={`ml-2 transition-colors ${errors[field.key] ? 'text-red-400' : 'text-gray-300'}`}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{field.icon}</svg>
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] uppercase text-gray-300 font-bold tracking-widest block mb-1">{field.label}</label>
                        <input
                          type={field.key === 'email' ? 'email' : 'text'}
                          name={field.key}
                          value={isEditing ? formData[field.key] : (user[field.key] || 'Не вказано')}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full bg-transparent text-sm font-medium focus:outline-none border-b pb-1 transition-colors disabled:opacity-100 disabled:text-gray-600 disabled:cursor-default ${
                            isEditing 
                            ? errors[field.key] ? 'border-red-400 text-red-500 border-dashed' : 'border-gray-300 focus:border-[#4B32B1] text-gray-700 border-dashed' 
                            : 'border-transparent text-gray-600'
                          }`}
                          placeholder={`Введіть ${field.label.toLowerCase()}`}
                        />
                      </div>
                    </div>
                    <div className={`absolute -bottom-4 left-6 transition-opacity duration-300 ${errors[field.key] ? 'opacity-100' : 'opacity-0'}`}>
                      <span className="text-[11px] text-red-500 italic">{errors[field.key] || ' '}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 flex flex-col items-center gap-4 relative z-0">
                <div className="flex gap-4">
                  {!isEditing ? (
                    <button 
                      onClick={handleEdit} 
                      className="bg-[#4B32B1] text-white px-20 py-4 rounded-lg font-medium shadow-xl shadow-[#4B32B1]/10 hover:bg-[#3b2888] transition-all"
                    >
                      Редагувати
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleSubmitProfile} 
                        disabled={!canSaveProfile || isSaving}
                        className={`px-12 py-4 rounded-lg font-medium shadow-xl transition-all ${
                          canSaveProfile 
                          ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/10' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isSaving ? 'Збереження...' : 'Зберегти зміни'}
                      </button>
                      <button 
                        onClick={handleCancel} 
                        disabled={isSaving} 
                        className="bg-white border border-gray-200 text-gray-500 px-12 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all"
                      >
                        Скасувати
                      </button>
                    </>
                  )}
                </div>
                <div className={`h-6 transition-opacity duration-500 ${statusMsg?.type === 'success' ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-green-600 text-sm font-medium">{statusMsg?.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* ТАБ: БЕЗПЕКА (Зміна пароля) */}
          {activeTab === 'security' && (
            <div className="w-full max-w-[500px] mx-auto mt-4 animate-fade-in relative z-10">
              <h1 className="text-2xl text-gray-400 font-light tracking-wider mb-10 text-center">Зміна пароля</h1>

              {pwdStatusMsg && pwdStatusMsg.type === 'error' && (
                <div className="mb-6 p-4 rounded-lg text-sm font-medium border bg-red-50 text-red-600 border-red-200">
                  {pwdStatusMsg.text}
                </div>
              )}

              <div className="space-y-6">
                {[
                  { label: 'Поточний пароль', key: 'currentPassword' },
                  { label: 'Новий пароль', key: 'newPassword' },
                  { label: 'Підтвердження пароля', key: 'confirmPassword' }
                ].map((field, idx) => (
                  <div key={idx} className="relative z-10">
                    <div className={`flex items-center gap-4 p-5 rounded-xl border shadow-sm transition-all duration-300 bg-white border-gray-200 ${pwdErrors[field.key] ? 'border-red-300 bg-red-50/30' : ''}`}>
                      <div className={`ml-2 transition-colors ${pwdErrors[field.key] ? 'text-red-400' : 'text-gray-300'}`}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0110 0v4"></path>
                        </svg>
                      </div>
                      <div className="flex-1 relative"> {/* relative потрібен для ока */}
                        <label className="text-[10px] uppercase text-gray-300 font-bold tracking-widest block mb-1">{field.label}</label>
                        {/* Кнопка "Показати пароль" */}
                        <button 
                          type="button" 
                          onClick={() => togglePasswordVisibility(field.key)}
                          className="absolute right-0 bottom-1.5 p-1 text-gray-400 hover:text-[#4B32B1] focus:outline-none transition-colors z-10"
                          title={showPasswords[field.key] ? "Приховати пароль" : "Показати пароль"}
                        >
                          {showPasswords[field.key] ? eyeOffIcon : eyeIcon}
                        </button>
                        <input
                          type={showPasswords[field.key] ? "text" : "password"}
                          name={field.key}
                          value={pwdData[field.key]}
                          onChange={handlePwdChange}
                          className={`w-full bg-transparent text-sm font-medium focus:outline-none border-b pb-1 transition-colors text-gray-700 pr-10 ${
                            pwdErrors[field.key] ? 'border-red-400 text-red-500 border-dashed' : 'border-gray-300 focus:border-[#4B32B1] border-dashed'
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div className={`absolute -bottom-4 left-6 transition-opacity duration-300 ${pwdErrors[field.key] ? 'opacity-100' : 'opacity-0'}`}>
                      <span className="text-[11px] text-red-500 italic">{pwdErrors[field.key] || ' '}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 flex flex-col items-center gap-4 relative z-0">
                <button 
                  onClick={handleSubmitPassword} 
                  disabled={!canSavePwd || isSavingPwd}
                  className={`px-16 py-4 rounded-lg font-medium shadow-xl transition-all ${
                    canSavePwd 
                    ? 'bg-[#4B32B1] text-white hover:bg-[#3b2888] shadow-[#4B32B1]/10' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSavingPwd ? 'Оновлення...' : 'Змінити пароль'}
                </button>
                
                <div className={`h-6 transition-opacity duration-500 ${pwdStatusMsg?.type === 'success' ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-green-600 text-sm font-medium">{pwdStatusMsg?.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* ІНШІ ТАБИ (Empty State) */}
          {activeTab !== 'profile' && activeTab !== 'security' && (
            <div className="text-center space-y-4 animate-fade-in w-full h-full flex flex-col justify-center items-center pb-20 relative z-10">
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