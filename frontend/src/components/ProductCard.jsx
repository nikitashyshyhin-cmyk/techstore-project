import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import CartModal from './CartModal';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      await axiosInstance.post('/api/cart/items', {
        productId: product.id,
        quantity: 1
      });

      setIsModalOpen(true);

    } catch (error) {

      if (error.response?.status === 401) {
        alert('Увійдіть в акаунт для додавання товарів у кошик');
        return;
      }

      alert('Виникла помилка при додаванні товару в кошик');
    }
  };
  


  return (
    <>
      <div 
        onClick={() => navigate(`/products/${product.id}`)}
        className="bg-white rounded-xl p-5 shadow-sm border border-gray-50 hover:shadow-lg hover:shadow-[#4B32B1]/5 transition-all duration-300 cursor-pointer group flex flex-col h-full"
      >
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/300'} 
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex flex-col flex-1">
          <h3 className="text-gray-700 font-semibold mb-2 group-hover:text-[#4B32B1] transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
            {product.shortDescription || "Опис відсутній"}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="text-[#4B32B1] font-bold text-lg">
              {product.price} ₴
            </span>
              <button 
                onClick={handleAddToCart}
                title="Додати в кошик"
                className="text-[#4B32B1] p-2 rounded-md transition-colors hover:bg-[#E5E0FF]"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
          </div>
        </div>
      </div>

      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ProductCard;