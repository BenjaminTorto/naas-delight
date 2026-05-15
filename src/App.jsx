import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import AnimatedPage from './components/layout/AnimatedPage'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Team from './pages/Team'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminDashboard from './pages/AdminDashboard'

// This component handles the smooth page transitions and uses location tracking
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
        <Route path="/admin" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        {/* Forces the window to scroll to the top on page changes */}
        <ScrollToTop />
        
        <Navbar />
        <CartDrawer /> 
        
        {/* Renders our animated page views dynamically */}
        <AnimatedRoutes />
        
        <Footer />
      </Router>
    </CartProvider>
  )
}

export default App
