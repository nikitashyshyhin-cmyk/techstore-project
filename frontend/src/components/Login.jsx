import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios'; // Імпортуємо helper
import myPicture from '../assets/sidePicture.png';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Для виведення "Invalid email or password"
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 3. Валідація
    if (!email || !password) {
      setError("Заповніть усі поля");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Некоректний формат email");
      return;
    }

    setIsLoading(true);
    try {
      // 4. Підключення API
      const response = await axiosInstance.post('/api/auth/login', { email, password });

      // 5. Обробка відповіді (success)
      const { token } = response.data;
      localStorage.setItem("token", token);
      
      navigate('/products'); // Redirect 
    } catch (err) {
      // 5. Обробка відповіді (error)
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[950px] min-h-[600px] rounded-[2.5rem] shadow-2xl flex overflow-hidden relative">
        
        {/* Кнопка виходу на головну */}
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 z-10 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>

        <div className="flex-1 p-10 md:p-14 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2 mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-700 mb-1">Вхід у кабінет</h1>
          <p className="text-gray-400 text-sm mb-6 text-center">Введіть свої дані, щоб увійти</p>

          {/* Вивід помилки */}
          {error && <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg w-full max-w-[320px] mb-4 text-center border border-red-100 italic">
            {error}
          </div>}

          <form onSubmit={handleSubmit} className="w-full max-w-[320px] space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#4B32B1] transition-all placeholder:text-gray-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#4B32B1] transition-all placeholder:text-gray-300"
            />

            <div className="flex items-center justify-between text-[10px] sm:text-xs py-1">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#4B32B1]" />
                Запам'ятати мене
              </label>
              <a href="#" className="text-gray-400 hover:text-[#4B32B1] underline">Забули пароль?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#4B32B1] text-white py-3 rounded-xl font-medium shadow-md transition-all active:scale-[0.98] ${isLoading ? 'opacity-50' : 'hover:bg-[#3b2888]'}`}
            >
              {isLoading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>

          {/* Соціальні мережі та реєстрація */}
          <div className="w-full max-w-[320px] flex flex-col items-center mt-8">
            <p className="text-[10px] uppercase tracking-widest text-gray-300 mb-4 font-bold">Або через</p>
            <div className="flex gap-4">
              {["google-color", "facebook-color", "github-142"].map((name, i) => (
                <button key={i} className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all">
                  <img src={`https://www.svgrepo.com/show/${name === 'github-142' ? '512317' : name === 'google-color' ? '475656' : '475647'}/${name}.svg`} className="w-5 h-5" alt="social" />
                </button>
              ))}
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-400 text-center">
            Не маєте аккаунту? <Link to="/register" className="text-gray-500 hover:text-[#4B32B1] underline font-medium">Зареєструватися.</Link>
          </p>
        </div>

        <div className="hidden lg:block flex-1 relative">
          <img src={myPicture} alt="Side visual" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4B32B1]/40 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;