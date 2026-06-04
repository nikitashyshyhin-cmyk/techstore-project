import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/api/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error("API Error (Order Confirmation):", err);
        if (err.response?.status === 404) {
          setError('order_not_found');
        } else {
          setError('general_error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-xl text-[#4B32B1] font-semibold animate-pulse">Отримання даних замовлення...</div>
      </div>
    );
  }

  if (error === 'order_not_found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-md shadow-sm border border-gray-200 text-center max-w-md w-full">
          <div className="text-6xl mb-4 opacity-20">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Замовлення не знайдено</h2>
          <p className="text-gray-500 mb-8">Можливо, воно було видалено або ви перейшли за недійсним посиланням.</p>
          <Link to="/products" className="bg-[#4B32B1] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#3b2888] transition-colors inline-block w-full">
            До каталогу
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-md text-center shadow-sm border border-gray-200">
          <p className="text-red-500 font-medium mb-6">Виникла помилка при завантаженні інформації про замовлення.</p>
          <Link to="/products" className="bg-[#4B32B1] text-white px-8 py-2.5 rounded-md font-semibold hover:bg-[#3b2888] transition-colors">
            Повернутися на головну
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Шапка з підтвердженням */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Замовлення успішно оформлено!</h1>
          <p className="text-gray-500">Дякуємо за покупку. Ми вже почали обробку вашого замовлення.</p>
        </div>

        {/* Картка з деталями замовлення */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-8">
          
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 text-center sm:text-left">
            <p className="text-sm text-gray-500 font-medium mb-1">Номер замовлення</p>
            <p className="text-xl font-bold text-gray-800">#{order.id}</p>
          </div>

          <div className="p-6">
            
            {/* БЛОК 1: Загальна інформація */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-100 pb-4 gap-2">
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Дата створення</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('uk-UA', { 
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-sm text-gray-400 font-medium mb-1">Спосіб оплати</p>
                  <p className="text-gray-800 font-medium">
                    {order.paymentMethod === 'card' ? 'Карткою онлайн' : order.paymentMethod === 'cash' ? 'При отриманні' : order.paymentMethod || 'Не вказано'}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-400 font-medium mb-1">Адреса доставки</p>
                <p className="text-gray-800 font-medium">{order.deliveryAddress || 'Не вказано'}</p>
              </div>

              {order.comment && (
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-md border border-gray-100">
                  <p className="text-sm text-gray-400 font-medium mb-1">Коментар до замовлення</p>
                  <p className="text-gray-700 italic text-sm">{order.comment}</p>
                </div>
              )}
            </div>

            {/* БЛОК 2: Список товарів */}
            {order.items && order.items.length > 0 && (
              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Куплені товари</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div className="flex-1 pr-4">
                        <p className="font-semibold text-gray-700 text-sm line-clamp-1">
                          {item.name || item.product?.name || 'Невідомий товар'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Кількість: {item.quantity} шт.</p>
                      </div>
                      <div className="font-bold text-gray-800 whitespace-nowrap text-right">
                        {item.subtotal ? `${item.subtotal.toLocaleString('uk-UA')} ₴` : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* БЛОК 3: Підсумкова сума */}
            <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-lg font-bold text-gray-800">Загальна сума:</span>
              <span className="text-3xl font-black text-[#4B32B1]">
                {order.total ? `${order.total.toLocaleString('uk-UA')} ₴` : '—'}
              </span>
            </div>

          </div>
        </div>

        {/* Кнопка повернення */}
        <div className="text-center">
          <Link 
            to="/products"
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors inline-block"
          >
            ← Повернутися до каталогу
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;