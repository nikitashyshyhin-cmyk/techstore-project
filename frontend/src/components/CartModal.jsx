import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    setActionError(null);
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
        setError("Помилка завантаження кошика.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    setDeletingItemId(cartItemId);
    setActionError(null);
    try {
      await axiosInstance.delete(`/api/cart/items/${cartItemId}`);
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (err) {
      console.error("Помилка при видаленні товару:", err);
      setActionError("Не вдалося видалити товар. Спробуйте пізніше.");
    } finally {
      setDeletingItemId(null);
    }
  };

  // ФУНКЦІЯ ОНОВЛЕННЯ КІЛЬКОСТІ 
  const handleUpdateQuantity = async (cartItemId, currentQuantity, newQuantity) => {
    if (newQuantity < 1 || newQuantity === currentQuantity) return;

    setUpdatingItemId(cartItemId);
    setActionError(null);

    const originalItems = [...cartItems];

    setCartItems(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const unitPrice = (item.subtotal && item.quantity) ? (item.subtotal / item.quantity) : 0;
        return { ...item, quantity: newQuantity, subtotal: unitPrice * newQuantity };
      }
      return item;
    }));

    try {
      await axiosInstance.patch(`/api/cart/items/${cartItemId}`, { quantity: newQuantity });
    } catch (err) {
      console.error("Помилка при оновленні кількості:", err);
      setActionError("Не вдалося оновити кількість. Спробуйте пізніше.");
      setCartItems(originalItems);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity" onClick={onClose}>
      <div className="bg-gray-50 w-full max-w-[900px] max-h-[90vh] rounded-md shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Кошик</h2>
            <p className="text-xs text-gray-400 mt-0.5">Щойно додані товари</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 hide-scrollbar">
          
          {actionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm font-medium flex justify-between items-center">
              <span>{actionError}</span>
              <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-600">✕</button>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-md shadow-sm border border-gray-100 flex gap-4 animate-pulse">
                  <div className="w-16 h-16 bg-gray-100 rounded-md"></div>
                  <div className="flex-1 space-y-2 py-1"><div className="h-4 bg-gray-100 rounded w-2/3"></div></div>
                  <div className="w-16 h-8 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-white rounded-md border border-gray-100 shadow-sm">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button onClick={fetchCart} className="text-[#4B32B1] font-semibold hover:underline">Спробувати знову</button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-md border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4 opacity-20">🛒</div>
              <p className="text-gray-400 text-lg mb-6">Ваш кошик порожній</p>
              <button onClick={onClose} className="bg-[#4B32B1] text-white px-6 py-2.5 rounded-md font-semibold hover:bg-[#3b2888] transition-colors">Повернутися до покупок</button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const isDeleting = deletingItemId === item.id;
                const isUpdating = updatingItemId === item.id;
                const isDisabled = isDeleting || isUpdating;

                return (
                  <div key={item.id} className={`bg-white p-4 rounded-md shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 transition-all ${isDeleting ? 'opacity-50 pointer-events-none' : 'hover:shadow-md'}`}>
                    
                    <div className="w-16 h-16 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden text-gray-300">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>}
                    </div>

                    <div className="flex-1 w-full text-center sm:text-left">
                      <Link to={`/products/${item.productId || item.product?.id}`} onClick={onClose} className="font-semibold text-gray-700 text-sm hover:text-[#4B32B1] transition-colors line-clamp-2">
                        {item.name || item.product?.name || 'Невідомий товар'}
                      </Link>
                    </div>

                    {/* БЛОК КІЛЬКОСТІ (Компактний варіант) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isDisabled}
                        className="w-7 h-7 flex items-center justify-center text-[#4B32B1] hover:bg-[#E5E0FF] rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/></svg>
                      </button>
                      
                      <div className="w-8 h-7 flex items-center justify-center border border-gray-300 rounded-md text-gray-800 font-medium text-sm">
                        {isUpdating ? (
                          <svg className="animate-spin h-3 w-3 text-[#4B32B1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          item.quantity
                        )}
                      </div>

                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, item.quantity + 1)}
                        disabled={isDisabled}
                        className="w-7 h-7 flex items-center justify-center text-[#4B32B1] hover:bg-[#E5E0FF] rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>

                    <div className="font-bold text-[#4B32B1] whitespace-nowrap sm:w-28 text-right transition-all">
                      {item.subtotal ? `${item.subtotal.toLocaleString('uk-UA')} ₴` : '—'}
                    </div>

                    <button onClick={() => handleRemoveItem(item.id)} disabled={isDisabled} title="Видалити товар" className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 flex-shrink-0">
                      {isDeleting ? <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                    </button>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {cartItems.length > 0 && !isLoading && !error && (
          <div className="bg-white p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Кількість</span>
                <span className="font-bold text-gray-700 transition-all">{totalQuantity} шт.</span>
              </div>
              <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">До сплати</span>
                <span className="text-xl font-black text-[#4B32B1] transition-all">{totalPrice.toLocaleString('uk-UA')} ₴</span>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={onClose} className="px-6 py-2.5 rounded-md font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors flex-1 sm:flex-none text-sm">
                Продовжити
              </button>
              <button onClick={() => { onClose(); navigate('/cart'); }} className="px-8 py-2.5 rounded-md font-semibold text-white bg-[#4B32B1] hover:bg-[#3b2888] transition-colors shadow-sm flex-1 sm:flex-none text-sm">
                В кошик
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartModal;