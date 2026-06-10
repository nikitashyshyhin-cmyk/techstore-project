import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [deliveryMethod, setDeliveryMethod] = useState('novaposhta'); // За замовчуванням Нова Пошта
  // Стани для міст
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [selectedCityRef, setSelectedCityRef] = useState('');

  // Стани для відділень
  const [warehouses, setWarehouses] = useState([]);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [warehouseError, setWarehouseError] = useState(null);
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [comment, setComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchCheckoutData();
  }, [navigate]);

  // Ефект пошуку міст (запускається, коли введено 2+ букви)
  useEffect(() => {
    if (citySearch.length >= 2 && !selectedCityRef) {
      const delayDebounceFn = setTimeout(() => {
        fetchCities(citySearch);
      }, 500); // Затримка, щоб не спамити API при кожному натисканні
      return () => clearTimeout(delayDebounceFn);
    } else if (citySearch.length < 2) {
      setCities([]);
    }
  }, [citySearch, selectedCityRef]);

  // Ефект завантаження відділень при виборі міста
  useEffect(() => {
    if (selectedCityRef) {
      fetchWarehouses(selectedCityRef);
    } else {
      setWarehouses([]);
    }
  }, [selectedCityRef]);

  const fetchCheckoutData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/checkout');
      setCheckoutData({
        items: response.data?.items || [],
        total: response.data?.total || 0
      });
    } catch (err) {
      console.error("API Error (Checkout):", err);
      if (err.response?.status === 404) {
        setCheckoutData({ items: [], total: 0 });
      } else if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Виникла помилка при завантаженні даних замовлення. Спробуйте пізніше.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCities = async (query) => {
    setIsLoadingCities(true);
    try {
      const response = await axiosInstance.get(`/api/delivery/cities?cityName=${encodeURIComponent(query)}`);
      setCities(response.data || []);
    } catch (err) {
      console.error("Помилка завантаження міст:", err);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const fetchWarehouses = async (cityRef) => {
    setIsLoadingWarehouses(true);
    setWarehouseError(null);
    try {
      const response = await axiosInstance.get(`/api/delivery/warehouses?cityRef=${cityRef}`);
      setWarehouses(response.data || []);
    } catch (err) {
      console.error("Помилка завантаження відділень:", err);
      setWarehouseError("Не вдалося завантажити список відділень.");
    } finally {
      setIsLoadingWarehouses(false);
    }
  };

  const handleSubmitOrder = async () => {
    // Визначаємо фінальну адресу залежно від обраного способу
    const finalAddress = deliveryMethod === 'novaposhta' ? selectedWarehouse : manualAddress;

    // Базова валідація
    if (!finalAddress.trim()) {
      setSubmitError(deliveryMethod === 'novaposhta' 
        ? "Будь ласка, оберіть відділення Нової Пошти зі списку." 
        : "Будь ласка, вкажіть адресу доставки."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Відправляємо запит з фінальною адресою
      const response = await axiosInstance.post('/api/orders', {
        deliveryAddress: finalAddress,
        paymentMethod,
        comment
      });

      const { orderId, status } = response.data;
      const finalOrderId = orderId || response.data.id || 'new';
      navigate(`/orders/${finalOrderId}/confirmation`);
      
    } catch (err) {
      console.error("Помилка створення замовлення:", err);
      setSubmitError("Виникла помилка при оформленні замовлення. Перевірте з'єднання або спробуйте пізніше.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8 flex justify-center">
        <div className="text-xl text-[#4B32B1] font-semibold animate-pulse mt-20">Підготовка замовлення...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-xl mx-auto bg-white p-10 rounded-md text-center shadow-sm border border-gray-200 mt-10">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium mb-6">{error}</p>
          <button onClick={fetchCheckoutData} className="bg-[#4B32B1] text-white px-8 py-2.5 rounded-md hover:bg-[#3b2888] transition-colors font-semibold">Спробувати знову</button>
        </div>
      </div>
    );
  }

  if (checkoutData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-2xl mx-auto bg-white p-20 rounded-md text-center border border-gray-100 mt-10 shadow-sm">
          <div className="text-6xl mb-4 opacity-20">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Немає товарів для оформлення</h2>
          <p className="text-gray-400 text-lg mb-8">Ваш кошик порожній, тому замовлення неможливе.</p>
          <Link to="/products" className="bg-[#4B32B1] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#3b2888] transition-colors inline-block">Перейти до каталогу</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Оформлення замовлення</h1>
          <p className="text-gray-500 text-sm">Вкажіть деталі доставки та оплати</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ЛІВА КОЛОНКА */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-4">Ваше замовлення</h2>
              <div className="space-y-4">
                {checkoutData.items.map((item) => (
                  <div key={item.productId || item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden text-gray-300">
                      {item.imageUrl || item.product?.imageUrl ? (
                        <img src={item.imageUrl || item.product?.imageUrl} alt={item.name || item.product?.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                      )}
                    </div>
                    <div className="flex-1 pr-4">
                      <h3 className="font-semibold text-gray-700 text-sm line-clamp-2">{item.name || item.product?.name || 'Невідомий товар'}</h3>
                      <span className="text-xs text-gray-400 mt-1 inline-block">Кількість: {item.quantity} шт.</span>
                    </div>
                    <div className="font-bold text-gray-800 whitespace-nowrap text-right">
                      {item.subtotal ? `${item.subtotal.toLocaleString('uk-UA')} ₴` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ОНОВЛЕНИЙ БЛОК ДОСТАВКИ */}
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Доставка</h2>
              
              {/* Перемикач способу доставки */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <label className={`flex-1 flex items-center p-4 border rounded-md cursor-pointer transition-all ${deliveryMethod === 'novaposhta' ? 'border-[#4B32B1] bg-[#E5E0FF]/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" value="novaposhta" checked={deliveryMethod === 'novaposhta'} onChange={() => { setDeliveryMethod('novaposhta'); setSubmitError(null); }} className="w-4 h-4 text-[#4B32B1] focus:ring-[#4B32B1] border-gray-300" />
                  <div className="ml-3">
                    <span className={`block text-sm font-semibold ${deliveryMethod === 'novaposhta' ? 'text-[#4B32B1]' : 'text-gray-700'}`}>Нова Пошта</span>
                    <span className="block text-xs text-gray-400 mt-0.5">До відділення або поштомату</span>
                  </div>
                </label>

                <label className={`flex-1 flex items-center p-4 border rounded-md cursor-pointer transition-all ${deliveryMethod === 'manual' ? 'border-[#4B32B1] bg-[#E5E0FF]/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" value="manual" checked={deliveryMethod === 'manual'} onChange={() => { setDeliveryMethod('manual'); setSubmitError(null); }} className="w-4 h-4 text-[#4B32B1] focus:ring-[#4B32B1] border-gray-300" />
                  <div className="ml-3">
                    <span className={`block text-sm font-semibold ${deliveryMethod === 'manual' ? 'text-[#4B32B1]' : 'text-gray-700'}`}>Адресна доставка / Інше</span>
                    <span className="block text-xs text-gray-400 mt-0.5">Кур'єром до дверей</span>
                  </div>
                </label>
              </div>

              {/* Поля вводу залежно від обраного способу */}
              <div className="animate-fade-in">
                {deliveryMethod === 'novaposhta' ? (
                    <div className="space-y-5">
                      {/* Вибір міста */}
                      <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Місто <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={citySearch}
                            onChange={(e) => {
                              setCitySearch(e.target.value);
                              setSelectedCityRef('');
                              setWarehouseSearch('');
                              setSelectedWarehouse('');
                              if (submitError) setSubmitError(null);
                            }}
                            placeholder="Почніть вводити назву міста (від 2 букв)..."
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#4B32B1] focus:ring-1 focus:ring-[#4B32B1]/20 text-sm text-gray-700"
                        />
                        {isLoadingCities && (
                            <div className="absolute right-3 top-10">
                              <svg className="animate-spin h-5 w-5 text-[#4B32B1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            </div>
                        )}

                        {/* Випадаючий список міст */}
                        {cities.length > 0 && !selectedCityRef && (
                            <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {cities.map(city => (
                                  <li
                                      key={city.ref}
                                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0"
                                      onClick={() => {
                                        setCitySearch(city.description);
                                        setSelectedCityRef(city.ref);
                                        setCities([]);
                                      }}
                                  >
                                    {city.description}
                                  </li>
                              ))}
                            </ul>
                        )}
                      </div>

                      {/* Вибір відділення */}
                      <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Відділення або поштомат <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={warehouseSearch}
                            onChange={(e) => {
                              setWarehouseSearch(e.target.value);
                              setSelectedWarehouse('');
                              setShowWarehouseDropdown(true);
                              if (submitError) setSubmitError(null);
                            }}
                            onFocus={() => setShowWarehouseDropdown(true)}
                            onBlur={() => setTimeout(() => setShowWarehouseDropdown(false), 200)} // Затримка, щоб клік по елементу списку встиг спрацювати
                            disabled={!selectedCityRef}
                            placeholder={selectedCityRef ? "Введіть номер або адресу (наприклад, '12' або 'Науки')... " : "Спочатку оберіть місто"}
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#4B32B1] focus:ring-1 focus:ring-[#4B32B1]/20 text-sm text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
                        />

                        {isLoadingWarehouses ? (
                            <div className="mt-2 text-xs text-gray-500">Завантаження відділень...</div>
                        ) : (
                            /* Випадаючий список відділень показується, коли активовано фокус, є дані й не обрано кінцевий варіант */
                            selectedCityRef && warehouses.length > 0 && showWarehouseDropdown && !selectedWarehouse && (
                                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                  {warehouses
                                      .filter(wh => {
                                        const desc = wh?.description || wh?.name || '';
                                        return desc.toLowerCase().includes(warehouseSearch.toLowerCase());
                                      })
                                      .map(wh => {
                                        const warehouseName = wh.description || wh.name || 'Без назви';
                                        return (
                                            <li
                                                key={wh.ref || wh.id || warehouseName}
                                                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0"
                                                onClick={() => {
                                                  setWarehouseSearch(warehouseName);
                                                  setSelectedWarehouse(warehouseName);
                                                  setShowWarehouseDropdown(false);
                                                }}
                                            >
                                              {warehouseName}
                                            </li>
                                        );
                                      })}
                                  {warehouses.filter(wh => {
                                    const desc = wh?.description || wh?.name || '';
                                    return desc.toLowerCase().includes(warehouseSearch.toLowerCase());
                                  }).length === 0 && (
                                      <li className="px-4 py-2.5 text-sm text-gray-400 italic">Нічого не знайдено</li>
                                  )}
                                </ul>
                            )
                        )}
                        {warehouseError && <div className="mt-2 text-xs text-red-500">{warehouseError}</div>}
                      </div>
                    </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Адреса доставки <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={(e) => {
                        setManualAddress(e.target.value);
                        if (submitError) setSubmitError(null);
                      }}
                      placeholder="Місто, вулиця, номер будинку/квартири"
                      className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#4B32B1] focus:ring-1 focus:ring-[#4B32B1]/20 text-sm text-gray-700"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Спосіб оплати</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-start p-4 border rounded-md cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#4B32B1] bg-[#E5E0FF]/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center h-5">
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-[#4B32B1] focus:ring-[#4B32B1] border-gray-300" />
                  </div>
                  <div className="ml-3">
                    <span className={`block text-sm font-semibold ${paymentMethod === 'card' ? 'text-[#4B32B1]' : 'text-gray-700'}`}>Оплата карткою онлайн</span>
                    <span className="block text-xs text-gray-400 mt-1">Apple Pay, Google Pay, Visa, Mastercard</span>
                  </div>
                </label>
                <label className={`flex items-start p-4 border rounded-md cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-[#4B32B1] bg-[#E5E0FF]/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center h-5">
                    <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-4 h-4 text-[#4B32B1] focus:ring-[#4B32B1] border-gray-300" />
                  </div>
                  <div className="ml-3">
                    <span className={`block text-sm font-semibold ${paymentMethod === 'cash' ? 'text-[#4B32B1]' : 'text-gray-700'}`}>Оплата при отриманні</span>
                    <span className="block text-xs text-gray-400 mt-1">Готівкою або карткою у відділенні пошти</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Коментар до замовлення</h2>
              <p className="text-sm text-gray-400 mb-4">Додайте побажання (необов'язково)</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Наприклад: Зателефонуйте мені перед відправкою..."
                className="w-full h-24 p-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#4B32B1] focus:ring-1 focus:ring-[#4B32B1]/20 resize-none text-sm text-gray-700"
              />
            </div>

          </div>

          {/* ПРАВА КОЛОНКА */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Разом</h2>
              
              <div className="space-y-4 mb-6 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Товари ({checkoutData.items.reduce((acc, item) => acc + item.quantity, 0)} шт.)</span>
                  <span className="font-semibold text-gray-800">{checkoutData.total ? `${checkoutData.total.toLocaleString('uk-UA')} ₴` : '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Вартість доставки</span>
                  <span className="font-semibold text-gray-800">За тарифами перевізника</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <span>Оплата</span>
                  <span className="font-semibold text-[#4B32B1] text-right">{paymentMethod === 'card' ? 'Карткою онлайн' : 'При отриманні'}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">До сплати:</span>
                  <span className="text-2xl font-black text-[#4B32B1]">{checkoutData.total ? `${checkoutData.total.toLocaleString('uk-UA')} ₴` : '—'}</span>
                </div>
              </div>

              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-500 text-sm rounded-md text-center font-medium">
                  {submitError}
                </div>
              )}

              <button 
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full bg-[#4B32B1] text-white py-3.5 rounded-md font-semibold hover:bg-[#3b2888] transition-colors shadow-lg shadow-[#4B32B1]/20 text-lg flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Оформлюється...
                  </>
                ) : (
                  'Підтвердити замовлення'
                )}
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                Підтверджуючи замовлення, я приймаю умови<br/>угоди користувача
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Checkout;