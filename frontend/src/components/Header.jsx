import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  // Визначаємо, чи авторизований користувач, перевіряючи наявність токена
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    // 2. Реалізувати логіку: видалення токена 
    localStorage.removeItem("token");
    
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center border-b border-gray-100">
      <Link to="/" className="text-xl font-bold text-[#4B32B1]">TechStore</Link>
      
      <nav className="flex items-center gap-6">
        {/* Показуємо кнопку виходу тільки якщо користувач увійшов (токен існує) */}
        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            Вийти
          </button>
        ) : (
          /* Якщо токена немає — показуємо посилання на вхід */
          <Link 
            to="/login" 
            className="text-sm font-medium text-gray-600 hover:text-[#4B32B1] transition-colors"
          >
            Увійти
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;