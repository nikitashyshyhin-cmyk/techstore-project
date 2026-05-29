import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const Cart = () => {
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
              <div key={i} className="bg-white p-5 rounded-md shadow-sm border border-gray-200 flex gap-6 animate-pulse">
                <div className="w-20 h-20 bg-gray-100 rounded-md"></div>
                <div className="flex-1 h-4 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white p-10 rounded-md text-center shadow-sm border border-gray-200">
            <p className="text-red-500 font-medium mb-6">{error}</p>
            <button onClick={fetchCart} className="bg-[#4B32B1] text-white px-8 py-2.5 rounded-md">
              Спробувати знову
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white p-20 rounded-md text-center border border-gray-100 mt-4">
            <div className="text-6xl mb-4 opacity-20">🛒</div>
            <p className="text-gray-400 text-lg italic mb-6">Ваш кошик поки що порожній...</p>
            <Link to="/products" className="bg-gray-100 px-8 py-3 rounded-md text-gray-500">
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white p-5 rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md"
              >

                {/* IMAGE FIX */}
                <div className="w-20 h-20 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-semibold text-gray-700 hover:text-[#4B32B1]"
                  >
                    {item.name}
                  </Link>
                </div>

                <div className="text-gray-700">{item.quantity} шт.</div>

                <div className="text-xl font-bold text-[#4B32B1]">
                  {item.subtotal ? `${item.subtotal.toLocaleString('uk-UA')} ₴` : '—'}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;