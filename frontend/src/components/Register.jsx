import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import myPicture from '../assets/sidePicture.png';
import logo from '../assets/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // Для виведення помилок API
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logoUrl = logo;
  const sideImageUrl = myPicture;

  // 3. Валідація на стороні клієнта
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Усі поля мають бути заповнені");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Будь ласка, введіть коректний email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 4. Підключення API (POST /api/auth/register)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Успіх → redirect /login
        navigate('/login');
      } else {
        // Помилка → показати повідомлення
        setError(data.message || "Сталася помилка при реєстрації");
      }
    } catch (err) {
      setError("Не вдалося з'єднатися з сервером");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[950px] min-h-[600px] rounded-[2.5rem] shadow-2xl flex overflow-hidden relative">
        
        {/* Кнопка повернення */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 z-10 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>

        {/* ЛІВА ЧАСТИНА: Форма */}
        <div className="flex-1 p-10 md:p-14 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2 mb-6">
            <img src={logoUrl} alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-700 mb-1">Реєстрація</h1>
          <p className="text-gray-400 text-sm mb-8 text-center">Створіть свій акаунт у TechStore</p>

          {/* Виведення помилок */}
          {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} noValidate className="w-full max-w-[320px] space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#335c67] transition-all placeholder:text-gray-300"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#335c67] transition-all placeholder:text-gray-300"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#4B32B1] text-white py-3 rounded-xl font-medium shadow-md transition-all active:scale-[0.98] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3b2888]'}`}
            >
              {isLoading ? 'Зачекайте...' : 'Зареєструватися'}
            </button>
          </form>

          <p className="mt-8 text-xs text-gray-400 text-center">
            Вже маєте акаунт? <Link to="/login" className="text-gray-500 hover:text-[#335c67] underline font-medium">Увійти.</Link>
          </p>
        </div>

        {/* ПРАВА ЧАСТИНА: Картинка */}
        <div className="hidden lg:block flex-1 relative">
          <img src={sideImageUrl} alt="Side visual" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4B32B1]/40 to-transparent"></div>
        </div>

      </div>
    </div>
  );
};

export default Register;