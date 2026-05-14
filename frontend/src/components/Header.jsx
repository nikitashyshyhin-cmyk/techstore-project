import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) return null;

  return (
    <header className="bg-white shadow-sm py-4 px-12 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-[#4B32B1] tracking-tight">TechStore</Link>
      
      <nav className="flex items-center gap-8">
        <Link 
          to="/products" 
          className={`text-sm font-semibold transition-colors ${
            location.pathname === '/products' ? 'text-[#4B32B1]' : 'text-gray-500 hover:text-[#4B32B1]'
          }`}
        >
          Каталог
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4 border-l pl-8 border-gray-100">
            <Link 
              to="/profile" 
              className={`p-2 rounded-full transition-all ${
                location.pathname === '/profile' ? 'bg-[#4B32B1] text-white' : 'text-gray-400 hover:bg-gray-50 hover:text-[#4B32B1]'
              }`}
              title="Мій профіль"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-[#4B32B1] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#3b2888] transition-all shadow-md shadow-[#4B32B1]/10"
          >
            Увійти
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;