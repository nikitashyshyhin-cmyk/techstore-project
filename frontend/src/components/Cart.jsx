import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/cart');
      const items = response.data?.items || response.data || [];
      setCartItems(Array.isArray(items) ? items : []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Будь ласка, увійдіть в акаунт, щоб переглянути кошик.");
      } else if (err.response?.status === 404) {
        setCartItems([]);
      } else {
        setError("Виникла помилка при завантаженні кошика.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1000px] mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Кошик</h1>
          <p className="text-gray-500 text-sm">Перелік товарів, які ви обрали</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-6 animate-pulse">
                <div className="w-24 h-24 bg-gray-100 rounded-md"></div>
                <div className="flex-1 space-y-3 py-2"><div className="h-4 bg-gray-100 rounded w-1/2"></div></div>
                <div className="w-20 h-10 bg-gray-100 rounded"></div>
                <div className="w-24 h-10 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white p-10 rounded-md text-center shadow-sm border border-gray-200">
            <p className="text-red-500 font-medium mb-6">{error}</p>
            <button onClick={fetchCart} className="bg-[#4B32B1] text-white px-8 py-2.5 rounded-md hover:bg-[#3b2888] transition-colors">
              Спробувати знову
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white p-20 rounded-md text-center border border-gray-100 mt-4">
            <div className="text-6xl mb-4 opacity-20">🛒</div>
            <p className="text-gray-400 text-lg italic mb-6">Ваш кошик поки що порожній...</p>
            <Link to="/products" className="bg-gray-100 text-gray-500 px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors inline-block">
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId || item.id}
                  className="bg-white p-5 rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-all"
                >
                  {/* Зображення товару */}
                  <div className="w-20 h-20 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden text-gray-300">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    )}
                  </div>

                  {/* Назва */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-semibold text-gray-700 text-lg hover:text-[#4B32B1] transition-colors line-clamp-2"
                    >
                      {item.name || 'Невідомий товар'}
                    </Link>
                  </div>

                  {/* Кількість */}
                  <div className="flex flex-col items-center sm:items-start w-full sm:w-auto min-w-[100px] sm:border-l sm:border-gray-100 sm:pl-6">
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold mb-1">Кількість</span>
                    <div className="text-gray-700 font-medium">{item.quantity} шт.</div>
                  </div>

                  {/* Сума */}
                  <div className="flex flex-col items-center sm:items-end w-full sm:w-auto min-w-[140px] sm:border-l sm:border-gray-100 sm:pl-6">
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold mb-1">Сума</span>
                    <div className="text-xl font-bold text-[#4B32B1]">
                      {item.subtotal ? `${item.subtotal.toLocaleString('uk-UA')} ₴` : '—'}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Блок із кнопкою переходу до Checkout */}
            <div className="mt-8 bg-white p-6 rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link 
                to="/products"
                className="px-6 py-2.5 rounded-md font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                ← Продовжити покупки
              </Link>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="px-10 py-3 rounded-md font-semibold text-white bg-[#4B32B1] hover:bg-[#3b2888] transition-colors shadow-md w-full sm:w-auto"
              >
                Оформити замовлення
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Cart;