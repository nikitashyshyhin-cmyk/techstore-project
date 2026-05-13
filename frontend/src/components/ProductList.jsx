import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/api/products`);

      // Просте отримання списку товарів (без pagination)
      setProducts(response.data || []);
    } catch (err) {
      console.error("API Error:", err);
      setError("Не вдалося завантажити товари. Перевірте з'єднання з сервером.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#E5E0FF] to-white p-8">
      <div className="max-w-[1200px] mx-auto">

        <div className="mb-10 px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Каталог товарів
          </h1>
          <p className="text-gray-400">
            Знайдіть найкращу техніку для ваших потреб
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl h-[380px] animate-pulse border border-gray-50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-gray-50 max-w-md mx-auto">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <p className="text-gray-600 font-medium mb-6">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-[#4B32B1] text-white px-10 py-3 rounded-lg hover:bg-[#3b2888] transition-all shadow-lg shadow-[#4B32B1]/20"
            >
              Спробувати знову
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-20 rounded-xl text-center border border-gray-50">
            <div className="text-6xl mb-4 opacity-20">📦</div>
            <p className="text-gray-400 text-lg italic">
              На жаль, товарів поки що немає...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductList;