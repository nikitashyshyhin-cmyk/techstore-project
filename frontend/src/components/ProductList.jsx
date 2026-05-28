import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import ProductCard from './ProductCard';

// 1. Імпорт усіх іконок з папки assets
import allIcon from '../assets/all.svg';
import cpuIcon from '../assets/cpu.svg';
import desktopIcon from '../assets/desktop.svg';
import fanIcon from '../assets/fan.svg';
import gameControllerIcon from '../assets/game-controller.svg';
import graphicCardIcon from '../assets/graphic-card.svg';
import hardDiskIcon from '../assets/hard-disk.svg';
import headphonesIcon from '../assets/headphones.svg';
import keyboardIcon from '../assets/keyboard.svg';
import laptopIcon from '../assets/laptop.svg';
import microphoneIcon from '../assets/microphone.svg';
import monitorIcon from '../assets/monitor.svg';
import motherboardIcon from '../assets/motherboard.svg';
import mouseIcon from '../assets/mouse.svg';
import otherIcon from '../assets/other.svg';
import powerSupplyIcon from '../assets/power-supply.svg';
import ramIcon from '../assets/ram.svg';
import smartphoneIcon from '../assets/smartphone.svg';
import speakerIcon from '../assets/speaker.svg';
import ssdIcon from '../assets/ssd.svg';
import tabletIcon from '../assets/tablet.svg';
import tvIcon from '../assets/tv.svg';
import wifiIcon from '../assets/wifi.svg';

// 2. Словник мапінгу НАЗВ категорій на іконки
const categoryIcons = {
  'Ноутбуки': laptopIcon,
  'Смартфони': smartphoneIcon,
  'ПК': desktopIcon,
  'Планшети': tabletIcon,
  'Навушники': headphonesIcon,
  'Геймпади': gameControllerIcon,
  'Телевізори': tvIcon,
  'Мережеве обладнання': wifiIcon,
  'Процесори': cpuIcon,
  'Охолодження': fanIcon,
  'Відеокарти': graphicCardIcon,
  'Жорсткі диски': hardDiskIcon,
  'Клавіатури': keyboardIcon,
  'Мікрофони': microphoneIcon,
  'Монітори': monitorIcon,
  'Материнські плати': motherboardIcon,
  'Мишки': mouseIcon,
  'Блоки живлення': powerSupplyIcon,
  'Оперативна памʼять': ramIcon,
  'Колонки': speakerIcon,
  'SSD': ssdIcon,
  'Комплектуючі': motherboardIcon,
  'Периферія': keyboardIcon
};

// 3. Компонент CSS-маски для динамічного перефарбовування іконок
const IconMask = ({ src, isActive }) => (
  <div
    className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
      isActive ? 'bg-[#4B32B1]' : 'bg-gray-400 group-hover:bg-[#4B32B1]'
    }`}
    style={{
      WebkitMaskImage: `url(${src})`,
      WebkitMaskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskImage: `url(${src})`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center'
    }}
  />
);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Категорії
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(0); 
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Завантаження категорій
  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const response = await axiosInstance.get('/api/categories');
        setCategories(response.data || []);
      } catch (err) {
        console.error("API Error for categories:", err);
        setCategoriesError("Не вдалося завантажити категорії");
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/api/products`, {
        params: {
          page: currentPage,
          size: 16,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(selectedCategory && { categoryId: selectedCategory })
        }
      });
      
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("API Error:", err);
      setError("Не вдалося завантажити товари. Перевірте з'єднання з сервером.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Хедер каталогу */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 px-2 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Каталог товарів</h1>
            <p className="text-gray-500 text-sm">Знайдіть найкращу техніку для ваших потреб</p>
          </div>
          <div className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200">
            Сторінка {totalPages > 0 ? currentPage + 1 : 0} з {totalPages}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* SIDEBAR (Категорії) */}
          <div className="w-full md:w-[260px] flex-shrink-0">
            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar">
              <h2 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3 text-center border-b border-gray-100 pb-2">Категорії</h2>
              
              {isCategoriesLoading ? (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
                  ))}
                </div>
              ) : categoriesError ? (
                <div className="p-3 text-xs text-red-500 italic text-center bg-red-50 rounded-md border border-red-100">
                  {categoriesError}
                </div>
              ) : (
                <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible hide-scrollbar">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedCategory === null
                      ? 'bg-[#E5E0FF] text-[#4B32B1]'
                      : 'text-gray-700 hover:bg-[#E5E0FF] hover:text-[#4B32B1]'
                    }`}
                  >
                    <IconMask src={allIcon} isActive={selectedCategory === null} />
                    Всі товари
                  </button>
                  
                  {categories.map((category) => {
                    const isActive = selectedCategory === category.id;
                    const iconSrc = categoryIcons[category.name] || otherIcon;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                          isActive
                          ? 'bg-[#E5E0FF] text-[#4B32B1] font-semibold'
                          : 'text-gray-700 hover:bg-[#E5E0FF] hover:text-[#4B32B1] font-medium'
                        }`}
                      >
                        <IconMask src={iconSrc} isActive={isActive} />
                        <span className="truncate">{category.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* КОНТЕНТ (Товари в 4 рядка) */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-md h-[360px] animate-pulse border border-gray-200"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white p-10 rounded-md text-center shadow-sm border border-gray-200 max-w-md mx-auto mt-10">
                <div className="text-red-400 text-5xl mb-4">⚠️</div>
                <p className="text-gray-700 font-medium mb-6">{error}</p>
                <button 
                  onClick={fetchProducts} 
                  className="bg-[#4B32B1] text-white px-8 py-2.5 rounded-md hover:bg-[#3b2888] transition-colors"
                >
                  Спробувати знову
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-16 rounded-md text-center border border-gray-200 mt-4">
                <div className="text-5xl mb-4 opacity-20">📦</div>
                <p className="text-gray-500 text-lg">
                  {debouncedSearch 
                    ? `На жаль, за запитом "${debouncedSearch}" нічого не знайдено.` 
                    : 'У цій категорії поки що немає товарів...'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button 
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="w-10 h-10 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[#4B32B1] hover:border-[#4B32B1] disabled:opacity-40 transition-colors"
                    >
                      ←
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-10 h-10 rounded-md font-medium transition-colors ${
                          currentPage === i 
                          ? 'bg-[#4B32B1] text-white' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      disabled={currentPage === totalPages - 1}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="w-10 h-10 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[#4B32B1] hover:border-[#4B32B1] disabled:opacity-40 transition-colors"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductList;