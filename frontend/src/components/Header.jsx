import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  // Визначаємо сторінки, на яких Header не повинен відображатися
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Якщо ми на сторінці авторизації або реєстрації — приховуємо весь Header
  if (isAuthPage) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login'); // 4. Redirect 
  };

  return (
    <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center border-b border-gray-100">
      <Link to="/" className="text-xl font-bold text-[#4B32B1]">TechStore</Link>
      
      <nav>
        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            Вийти
          </button>
        ) : (
          /* На інших сторінках (наприклад, головній) показуємо вхід, якщо не авторизовані */
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#4B32B1]">
            Увійти
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;