import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import CartModal from './CartModal';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/api/products/${id}`);
                setProduct(response.data);
                setError('');
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('Товар не знайдено');
                } else {
                    setError('Помилка завантаження детальної інформації');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        try {
            await axiosInstance.post('/api/cart/items', { productId: product.id });
            setIsModalOpen(true);
        } catch (err) {
            alert('Виникла помилка при додаванні товару в кошик');
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-xl text-[#4B32B1]">Завантаження...</div>;
    if (error) return <div className="p-20 text-center text-red-500 text-2xl font-bold">{error}</div>;
    if (!product) return null;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
            <div className="md:w-1/2 flex justify-center items-center bg-gray-50 rounded-xl p-6">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/500'}
                    alt={product.name}
                    className="max-w-full h-auto object-contain rounded-lg"
                />
            </div>

            <div className="md:w-1/2 flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                <p className="text-3xl font-black text-[#4B32B1] mb-6">{product.price} ₴</p>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">Опис товару:</h3>
                <div className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
                    {product.description}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="bg-[#4B32B1] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3b2888] transition-colors flex justify-center items-center gap-2 disabled:opacity-70 flex-1 sm:flex-none"
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {isAddingToCart ? 'Додавання...' : 'Додати в кошик'}
                    </button>
                    
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex-1 sm:flex-none"
                    >
                        ← Назад
                    </button>
                </div>
            </div>

            <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ProductPage;