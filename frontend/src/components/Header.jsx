import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  // Перевіряємо наявність токена для динамічного відображення
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center border-b border-gray-100">
      <Link to="/" className="text-xl font-bold text-[#4B32B1]">TechStore</Link>
      <nav>
        {isAuthenticated ? (
          <button className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
            Вийти
          </button>
        ) : (
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#4B32B1]">Увійти</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;