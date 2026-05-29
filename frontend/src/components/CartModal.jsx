import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const CartModal = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/cart');
      const items = response.data?.items || response.data || [];
      setCartItems(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Модалка кошика API Error:", err);
      if (err.response?.status === 404) {
        setCartItems([]);
      } else {
        setError("Помилка завантаження кошика.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4">
      <div 
        className="bg-gray-50 w-full max-w-[900px] max-h-[90vh] rounded-md shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-white rounded-md border border-gray-100 hover:bg-gray-100 transition-colors z-10">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="p-6 md:p-8 bg-white border-b border-gray-200 rounded-t-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Товар додано до кошика!</h2>
          <p className="text-gray-500 text-sm">Поточний стан вашого замовлення</p>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-gray-100 rounded-md"></div>
                  <div className="flex-1 py-2"><div className="h-4 bg-gray-100 rounded w-1/2"></div></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-white rounded-md border border-gray-200">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white p-16 rounded-md text-center border border-gray-100">
              <div className="text-6xl mb-4 opacity-20">🛒</div>
              <p className="text-gray-400 text-lg italic">Ваш кошик поки що порожній...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemSubtotal = item.subtotal !== undefined ? item.subtotal : (item.product?.price ? item.product.price * item.quantity : null);
                return (
                  <div key={item.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center flex-shrink-0 text-gray-300">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                    </div>
                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="font-semibold text-gray-700 hover:text-[#4B32B1] transition-colors line-clamp-1">{item.product?.name || 'Невідомий товар'}</h3>
                    </div>
                    <div className="flex flex-col items-center sm:items-start min-w-[80px]">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Кількість</span>
                      <div className="text-gray-700 font-medium">{item.quantity} шт.</div>
                    </div>
                    <div className="flex flex-col items-center sm:items-end min-w-[120px]">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Сума</span>
                      <div className="text-lg font-bold text-[#4B32B1]">{itemSubtotal ? `${itemSubtotal.toLocaleString('uk-UA')} ₴` : '—'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-200 rounded-b-md flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button onClick={onClose} className="px-6 py-3 rounded-md font-medium text-gray-500 hover:text-gray-800 transition-colors">
            ← Продовжити покупки
          </button>
          <Link to="/cart" onClick={onClose} className="px-8 py-3 rounded-md font-medium text-white bg-[#4B32B1] hover:bg-[#3b2888] transition-colors shadow-md text-center w-full sm:w-auto">
            Перейти до кошика
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CartModal;