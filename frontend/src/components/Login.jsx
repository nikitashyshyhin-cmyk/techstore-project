import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import myPicture from '../assets/sidePicture.png'
import logo from '../assets/logo.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Шляхи до файлів 
  const logoUrl = logo; // Лого
  const sideImageUrl = myPicture; // Картинка збоку

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Логін:", email, "Пароль:", password);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      {/* Основна картка-контейнер */}
      <div className="bg-white w-full max-w-[950px] min-h-[600px] rounded-[2.5rem] shadow-2xl flex overflow-hidden relative">
        
        {/* 3. Кнопка виходу на головну (всередині форми) */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 z-10 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
          title="На головну"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>

        {/* ЛІВА ЧАСТИНА: Форма */}
        <div className="flex-1 p-10 md:p-14 flex flex-col items-center justify-center">
          
          {/* 2. Лого */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <img 
              src={logoUrl} 
              alt="TechStore Logo" 
              className="w-24 h-24 object-contain" 
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-700 mb-1">Вхід у кабінет</h1>
          <p className="text-gray-400 text-sm mb-8 text-center">Введіть свої дані, щоб увійти</p>

          <form onSubmit={handleSubmit} className="w-full max-w-[320px] space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#335c67] transition-all placeholder:text-gray-300"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#335c67] transition-all placeholder:text-gray-300"
              required
            />

            <div className="flex items-center justify-between text-[10px] sm:text-xs py-1">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#335c67]" />
                Запам'ятати мене
              </label>
              <a href="#" className="text-gray-400 hover:text-[#335c67] underline">Забули пароль?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4B32B1] text-white py-3 rounded-xl font-medium hover:bg-[#3b2888] transition-colors shadow-md active:scale-[0.98]"
            >
              Увійти
            </button>
          </form>

          {/* Соціальні мережі */}
          <div className="w-full max-w-[320px] flex flex-col items-center mt-8">
            <p className="text-[10px] uppercase tracking-widest text-gray-300 mb-4 font-bold">Або через</p>
            <div className="flex gap-4">
              {[
                "https://www.svgrepo.com/show/475656/google-color.svg",
                "https://www.svgrepo.com/show/475647/facebook-color.svg",
                "https://www.svgrepo.com/show/512317/github-142.svg"
              ].map((src, i) => (
                <button key={i} className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
                  <img src={src} className="w-5 h-5" alt="social" />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Не маєте аккаунту? <Link to="/register" className="text-gray-500 hover:text-[#335c67] underline font-medium">Зареєструватися.</Link>
          </p>
        </div>

        {/* 1. ПРАВА ЧАСТИНА: Картинка */}
        <div className="hidden lg:block flex-1 relative">
          <img 
            src={sideImageUrl} 
            alt="Side visual" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Легкий градієнт поверх картинки для стилю */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#335c67]/40 to-transparent"></div>
        </div>

      </div>
    </div>
  );
};

export default Login;