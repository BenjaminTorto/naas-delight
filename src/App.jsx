import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import AnimatedPage from './components/layout/AnimatedPage';
import ProtectedRoute from './components/ProtectedRoute';

// Page Imports
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/portal-login'; // Fixed to match your actual filename!

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        <Route path="/menu" element={<AnimatedPage><Menu /></AnimatedPage>} />
        <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
        <Route path="/team" element={<AnimatedPage><Team /></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
        <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
        <Route path="/track" element={<AnimatedPage><TrackOrder /></AnimatedPage>} />
        <Route path="/order-confirmation/:orderId" element={<AnimatedPage><OrderConfirmation /></AnimatedPage>} />
        <Route path="/admin-login" element={<AnimatedPage><AdminLogin /></AnimatedPage>} />
        
        {/* Secured Admin Route Dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AnimatedPage>
              <AdminDashboard />
            </AnimatedPage>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <CartDrawer /> 
        <AnimatedRoutes />
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
