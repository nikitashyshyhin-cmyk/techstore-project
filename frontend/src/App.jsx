import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Додано Link
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import ProductList from './components/ProductList';
import ProductPage from './components/ProductPage';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />




        <main className="flex-1">
          <Routes>
            {/* Головна сторінка */}
            <Route path="/" element={
              <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-6xl font-bold text-[#4B32B1] mb-6">TechStore</h1>
                <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
                  Ласкаво просимо до майбутнього технологій. Найкращі гаджети, 
                  відібрані нашими експертами, вже чекають на вас.
                </p>
                <Link 
                  to="/products" 
                  className="mt-10 bg-[#4B32B1] text-white px-12 py-4 rounded-lg font-bold hover:shadow-2xl hover:shadow-[#4B32B1]/30 transition-all active:scale-95"
                >
                  Відкрити каталог
                </Link>
              </div>
            } />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              } 
            />

            <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <ProductPage />
                  </ProtectedRoute>
                }
            />
            
            <Route path="*" element={<div className="p-20 text-center">Сторінку не знайдено</div>} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:id/confirmation" element={<OrderConfirmation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;