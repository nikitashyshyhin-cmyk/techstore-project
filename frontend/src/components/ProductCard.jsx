import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-50 hover:shadow-lg hover:shadow-[#4B32B1]/5 transition-all duration-300 cursor-pointer group flex flex-col h-full"
    >
      {/* Зображення товару */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300'} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Інформація */}
      <div className="flex flex-col flex-1">
        <h3 className="text-gray-700 font-semibold mb-2 group-hover:text-[#4B32B1] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
          {product.shortDescription || product.description || "Опис відсутній"}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[#4B32B1] font-bold text-lg">
            {product.price} ₴
          </span>
          <button className="bg-[#4B32B1] text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg shadow-[#4B32B1]/10">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;