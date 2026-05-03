import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Захищений маршрут: доступний тільки після логіну */}
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <div className="p-10 text-center">
                  <h1 className="text-2xl font-bold">Панель товарів TechStore</h1>
                  <p className="text-gray-500">Ви увійшли як авторизований користувач.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<div className="p-10 text-center">Головна сторінка</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;