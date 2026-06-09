import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/orders');
      const data = response.data?.content || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Помилка завантаження історії замовлень:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Помилка доступу. Будь ласка, авторизуйтесь знову.");
      } else {
        setError("Не вдалося завантажити історію замовлень. Спробуйте пізніше.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CREATED': return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">Нове</span>;
      case 'PROCESSING': return <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">В обробці</span>;
      case 'SHIPPED': return <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">Відправлено</span>;
      case 'COMPLETED': return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">Виконано</span>;
      case 'CANCELLED': return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">Скасовано</span>;
      default: return <span className="bg-gray-100 text-gray-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider" title="Бекенд ще не передає статус">{status || 'Статус не вказано'}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-md border border-gray-100 shadow-sm animate-pulse">
            <div className="flex justify-between mb-4"><div className="w-32 h-5 bg-gray-100 rounded"></div><div className="w-24 h-5 bg-gray-100 rounded"></div></div>
            <div className="space-y-3"><div className="w-full h-12 bg-gray-50 rounded"></div><div className="w-full h-12 bg-gray-50 rounded"></div></div>
            <div className="flex justify-end mt-4"><div className="w-32 h-6 bg-gray-100 rounded"></div></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-md border border-red-100 text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button onClick={fetchOrders} className="bg-red-100 text-red-700 px-6 py-2 rounded-md hover:bg-red-200 transition-colors text-sm font-semibold">
          Спробувати знову
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 rounded-md border border-gray-100 text-center shadow-sm">
        <div className="text-5xl mb-4 opacity-20">🛍️</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Ви ще нічого не замовляли</h3>
        <p className="text-gray-500 mb-6">Ваша історія покупок порожня. Час це виправити!</p>
        <Link to="/products" className="bg-[#4B32B1] text-white px-8 py-2.5 rounded-md font-semibold hover:bg-[#3b2888] transition-colors inline-block">
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Шапка замовлення */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-gray-800 text-lg">Замовлення #{order.orderId}</span>
                {getStatusBadge(order.status)}
              </div>
              <span className="text-sm text-gray-500">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA', { 
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                }) : 'Дата невідома'}
              </span>
            </div>
            
            <Link 
              to={`/orders/${order.orderId}/confirmation`}
              className="text-[#4B32B1] text-sm font-semibold hover:underline underline-offset-2 bg-[#E5E0FF]/50 px-4 py-2 rounded-md transition-colors"
              style={{ textDecorationSkipInk: 'none' }}
            >
              Деталі замовлення
            </Link>
          </div>

          {/* Список товарів у замовленні */}
          <div className="p-6">
            <div className="space-y-4">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center flex-1 pr-4">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm line-clamp-1">{item.productName || 'Невідомий товар'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Кількість: {item.quantity} шт.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Підсумок замовлення */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Загальна сума</span>
              {order.totalItems && <span className="text-xs text-gray-400 font-medium">({order.totalItems} товарів)</span>}
            </div>
            <span className="text-xl font-black text-[#4B32B1]">
              {order.total ? `${order.total.toLocaleString('uk-UA')} ₴` : '—'}
            </span>
          </div>

        </div>
      ))}
    </div>
  );
};

export default OrderHistory;