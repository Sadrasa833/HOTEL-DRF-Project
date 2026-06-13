import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import BookingPage from './BookingPage';
import Invoices from './Invoices';
import Restaurant from './Restaurant';
import About from './About';
import Footer from './Footer'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Vazirmatn, Tahoma, sans-serif', minHeight: '100vh', backgroundColor: '#111' }}>
      
      <nav className="east-navbar">
        <div className="east-logo" onClick={() => navigate('/')}>
          SADRA<span style={{ color: '#fff', fontWeight: 300 }}>HOTEL</span>
        </div>

        <div className="east-nav-links">
          <button onClick={() => navigate('/')}>هتل</button>
          <button onClick={() => navigate('/about')}>درباره ما</button>
          <button onClick={() => navigate('/restaurant')}>رستوران</button>
          
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/invoices')} style={{ color: '#cda46f' }}>فاکتورهای من</button>
              <button onClick={handleLogout} style={{ color: '#e53e3e' }}>خروج</button>
            </>
          ) : (
            <button onClick={() => navigate('/login')}>ورود</button>
          )}
        </div>

        {/* دکمه‌های رزرو کج */}
        <div className="east-book-container">
          <button className="east-book-btn east-btn-white" onClick={() => navigate('/restaurant')}>
            <div className="east-book-content">
              <span> غذا</span>
              <span className="east-icon">🍴</span>
            </div>
          </button>
          <button className="east-book-btn east-btn-gold" onClick={() => navigate('/')}>
            <div className="east-book-content">
              <span>رزرو</span>
              <span className="east-icon">🛏️</span>
            </div>
          </button>
        </div>
      </nav>

      <div style={{ direction: 'rtl' }}>
        <Routes>
          <Route path="/login" element={ !isAuthenticated ? <Login onLoginSuccess={() => setIsAuthenticated(true)} /> : <Navigate to="/" replace /> } />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/invoices" element={ isAuthenticated ? <Invoices /> : <Navigate to="/login" replace /> } />
          <Route path="/restaurant" element={<Restaurant />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
      {/* 🌟 فوتر اختصاصی در تمام صفحات */}
      <Footer />
      
    </div>
  );
}

export default App;