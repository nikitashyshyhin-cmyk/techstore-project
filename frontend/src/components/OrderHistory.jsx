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
        <div key={order.id} className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Шапка замовлення */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="mb-1">
                <span className="font-bold text-gray-800 text-lg">Замовлення #{order.orderId}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('uk-UA', { 
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </span>
            </div>

            <Link
                to={`/orders/${order.orderId}/confirmation`}
                className="text-[#4B32B1] text-sm font-semibold hover:underline underline-offset-3 bg-[#E5E0FF]/50 px-4 py-2 rounded-md transition-colors"
                style={{ textDecorationSkipInk: 'none' }}
            >
              Деталі замовлення
            </Link>
          </div>

          {/* Список товарів у замовленні */}
          <div className="p-6">
            <div className="space-y-4">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4 flex-1 pr-4">
                    
                    <div className="w-12 h-12 bg-gray-50 rounded border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden text-gray-300">
                      {item.imageUrl || item.product?.imageUrl ? (
                        <img src={item.imageUrl || item.product?.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-semibold text-gray-700 text-sm line-clamp-1">{item.name || item.product?.name || 'Невідомий товар'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.quantity} шт. × {item.price ? `${item.price.toLocaleString('uk-UA')} ₴` : '—'}</p>
                    </div>
                  </div>
                  
                  <div className="font-bold text-gray-800 whitespace-nowrap text-right">
                    {item.subtotal ? `${item.subtotal.toLocaleString('uk-UA')} ₴` : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Підсумок замовлення */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Загальна сума</span>
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