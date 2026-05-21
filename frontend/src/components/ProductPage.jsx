import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const ProductPage = () => {
    const { id } = useParams(); // Отримуємо ID з URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Звертаємось до твого готового ендпоінту
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data);
                setError('');
            } catch (err) {
                // Обробка помилки 404
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

    if (loading) return <div className="p-20 text-center text-xl text-[#4B32B1]">Завантаження...</div>;
    if (error) return <div className="p-20 text-center text-red-500 text-2xl font-bold">{error}</div>;
    if (!product) return null;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
            {/* Зображення */}
            <div className="md:w-1/2 flex justify-center items-center bg-gray-50 rounded-xl p-6">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/500'}
                    alt={product.name}
                    className="max-w-full h-auto object-contain rounded-lg"
                />
            </div>

            {/* Інформація про товар */}
            <div className="md:w-1/2 flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                <p className="text-3xl font-black text-[#4B32B1] mb-6">{product.price} ₴</p>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">Опис товару:</h3>
                <div className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
                    {product.description}
                </div>

                <button
                    onClick={() => navigate('/products')}
                    className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors w-max"
                >
                    ← Назад до каталогу
                </button>
            </div>
        </div>
    );
};

export default ProductPage;