import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-10 rounded-md shadow-sm border border-gray-200 max-w-md w-full text-center">
        
        {/* Іконка успіху */}
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Замовлення успішно оформлено!</h1>
        <p className="text-gray-500 mb-8">
          Дякуємо за покупку. Ваше замовлення <span className="font-bold text-[#4B32B1]">#{id}</span> прийнято в обробку. 
          Ми зв'яжемося з вами найближчим часом.
        </p>
        
        <Link 
          to="/products"
          className="bg-[#4B32B1] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#3b2888] transition-colors inline-block w-full"
        >
          Повернутися до каталогу
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;