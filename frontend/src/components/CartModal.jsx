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
  }, [isOpen]);

  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/cart');
      const items = response.data?.items || response.data || [];
      setCartItems(Array.isArray(items) ? items : []);
    } catch (err) {
      setError("Помилка завантаження кошика.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4">
      <div className="bg-gray-50 w-full max-w-[900px] max-h-[90vh] rounded-md shadow-2xl flex flex-col">

        <button onClick={onClose} className="absolute top-4 right-4">
          ✕
        </button>

        <div className="p-6 bg-white border-b">
          <h2 className="text-xl font-bold">Кошик</h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">

          {cartItems.map((item) => (
            <div key={item.productId} className="bg-white p-4 rounded-md flex items-center gap-4">

              {/* IMAGE FIX */}
              <div className="w-16 h-16 bg-gray-50 rounded-md border overflow-hidden flex-shrink-0">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/64'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                {item.name}
              </div>

              <div>{item.quantity} шт.</div>

              <div className="font-bold text-[#4B32B1]">
                {item.subtotal ? `${item.subtotal.toLocaleString('uk-UA')} ₴` : '—'}
              </div>

            </div>
          ))}

        </div>

        <div className="p-6 border-t bg-white flex justify-between">
          <button onClick={onClose}>Закрити</button>
          <Link to="/cart" onClick={onClose} className="bg-[#4B32B1] text-white px-6 py-2 rounded-md">
            Перейти до кошика
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CartModal;