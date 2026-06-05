import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(initialSearch);

  const isAuthenticated = !!localStorage.getItem('token');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  if (isAuthPage) return null;

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    
    if (val.trim()) {
      navigate(`/products?search=${encodeURIComponent(val)}`, { replace: true });
    } else {
      if (location.pathname === '/products') {
        navigate(`/products`, { replace: true });
      }
    }
  };

  return (
    <header className="bg-white shadow-sm py-4 px-12 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-[#4B32B1] tracking-tight">TechStore</Link>
      
      {/* ПОЛЕ ПОШУКУ */}
      <div className="flex-1 max-w-2xl mx-8 hidden md:block relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Пошук за назвою чи описом..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#4B32B1] focus:ring-1 focus:ring-[#4B32B1]/20 transition-all shadow-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      <nav className="flex items-center gap-6">
        {/* КАТАЛОГ */}
        <Link 
          to="/products" 
          className={`text-sm font-semibold transition-colors ${
            location.pathname === '/products' ? 'text-[#4B32B1]' : 'text-gray-500 hover:text-[#4B32B1]'
          }`}
        >
          Каталог
        </Link>

        {/* ВІДОКРЕМЛЕНИЙ КОШИК */}
        <div className="border-l border-gray-100 pl-6 flex items-center">
          <Link 
            to="/cart" 
            className={`p-2 rounded-full transition-all ${
              location.pathname === '/cart' ? 'bg-[#4B32B1] text-white' : 'text-gray-400 hover:bg-gray-50 hover:text-[#4B32B1]'
            }`}
            title="Кошик"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
        </div>

        {/* ВІДОКРЕМЛЕНА АВТОРИЗАЦІЯ / ПРОФІЛЬ */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
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
          <div className="border-l border-gray-100 pl-6">
            <Link 
              to="/login" 
              className="bg-[#4B32B1] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#3b2888] transition-all shadow-md shadow-[#4B32B1]/10"
            >
              Увійти
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;