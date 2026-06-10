import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [actionError, setActionError] = useState(null);

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

  // ФУНКЦІЯ ВИДАЛЕННЯ ТОВАРУ
  const handleRemoveItem = async (cartItemId) => {
    setDeletingItemId(cartItemId);
    setActionError(null);
    try {
      await axiosInstance.delete(`/api/cart/items/${cartItemId}`);
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (err) {
      console.error("Помилка при видаленні товару:", err);
      setActionError("Не вдалося видалити товар. Перевірте з'єднання або спробуйте пізніше.");
    } finally {
      setDeletingItemId(null);
    }
  };

  // ФУНКЦІЯ ОНОВЛЕННЯ КІЛЬКОСТІ
  const handleUpdateQuantity = async (cartItemId, currentQuantity, newQuantity) => {
    if (newQuantity < 1 || newQuantity === currentQuantity) return;

    setUpdatingItemId(cartItemId);
    setActionError(null);

    // Зберігаємо оригінальний стан на випадок помилки
    const originalItems = [...cartItems];

    setCartItems(prev => prev.map(item => {
      if (item.id === cartItemId) {
        // Вираховуємо ціну за 1 шт. і множимо на нову кількість для миттєвого оновлення суми
        const unitPrice = (item.subtotal && item.quantity) ? (item.subtotal / item.quantity) : 0;
        return { ...item, quantity: newQuantity, subtotal: unitPrice * newQuantity };
      }
      return item;
    }));

    // 2. Відправка запиту у фоні
    try {
      await axiosInstance.patch(`/api/cart/items/${cartItemId}`, { quantity: newQuantity });
    } catch (err) {
      console.error("Помилка при оновленні кількості:", err);
      setActionError("Не вдалося оновити кількість. Спробуйте пізніше.");
      // Відкочуємо зміни, якщо сервер відповів помилкою
      setCartItems(originalItems);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1000px] mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Кошик</h1>
          <p className="text-gray-500 text-sm">Перелік товарів, які ви обрали</p>
        </div>

        {actionError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm font-medium flex items-center justify-between">
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

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
              {cartItems.map((item) => {
                const currentId = item.productId || item.id;
                const isDeleting = deletingItemId === item.id;
                const isUpdating = updatingItemId === item.id;
                const isDisabled = isDeleting || isUpdating;

                return (
                  <div
                    key={item.id}
                    className={`bg-white p-5 rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-6 transition-all ${isDeleting ? 'opacity-50 pointer-events-none' : 'hover:shadow-md'}`}
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden text-gray-300">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      )}
                    </div>

                    <div className="flex-1 w-full text-center sm:text-left">
                      <Link to={`/products/${item.productId || item.product?.id}`} className="font-semibold text-gray-700 text-lg hover:text-[#4B32B1] transition-colors line-clamp-2">
                        {item.name || item.product?.name || 'Невідомий товар'}
                      </Link>
                    </div>

                    {/* КІЛЬКІСТЬ */}
                    <div className="flex flex-col items-center sm:items-center w-full sm:w-auto min-w-[120px] sm:border-l sm:border-gray-100 sm:px-6">
                      <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold mb-2">Кількість</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isDisabled}
                          className="w-8 h-8 flex items-center justify-center text-[#4B32B1] hover:bg-[#E5E0FF] rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/></svg>
                        </button>
                        
                        <div className="w-10 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-800 font-medium text-sm">
                          {isUpdating ? (
                            <svg className="animate-spin h-4 w-4 text-[#4B32B1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            item.quantity
                          )}
                        </div>

                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, item.quantity + 1)}
                          disabled={isDisabled}
                          className="w-8 h-8 flex items-center justify-center text-[#4B32B1] hover:bg-[#E5E0FF] rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </div>
                    </div>

                    {/* СУМА */}
                    <div className="flex flex-col items-center sm:items-end w-full sm:w-auto min-w-[120px] sm:border-l sm:border-gray-100 sm:pl-6">
                      <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold mb-1">Сума</span>
                      <div className="text-xl font-bold text-[#4B32B1] transition-all">
                        {item.subtotal ? `${item.subtotal.toLocaleString('uk-UA')} ₴` : '—'}
                      </div>
                    </div>

                    {/* КНОПКА ВИДАЛЕННЯ */}
                    <div className="flex items-center justify-center sm:border-l sm:border-gray-100 sm:pl-4 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-100 sm:border-t-0">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isDisabled}
                        title="Видалити товар"
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isDeleting ? (
                          <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        )}
                        <span className="sm:hidden text-sm font-medium">Видалити</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* ПІДСУМОК */}
            <div className="mt-8 bg-white p-6 rounded-md shadow-sm border border-gray-200 flex flex-col lg:flex-row justify-between items-center gap-6">
              <Link to="/products" className="px-6 py-2.5 rounded-md font-semibold text-gray-500 hover:text-gray-800 transition-colors w-full lg:w-auto text-center order-3 lg:order-1">
                ← До каталогу
              </Link>
              <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8 w-full lg:w-auto order-1 lg:order-2 text-center sm:text-left bg-gray-50 lg:bg-transparent p-4 lg:p-0 rounded-md">
                <div>
                  <span className="text-sm text-gray-500 mr-2">Всього товарів:</span>
                  <span className="font-bold text-gray-800 transition-all">{totalQuantity} шт.</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
                <div>
                  <span className="text-sm text-gray-500 mr-2">До сплати:</span>
                  <span className="text-2xl font-black text-[#4B32B1] transition-all">{totalPrice.toLocaleString('uk-UA')} ₴</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="px-10 py-3.5 rounded-md font-semibold text-white bg-[#4B32B1] hover:bg-[#3b2888] transition-colors shadow-md w-full lg:w-auto order-2 lg:order-3">
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