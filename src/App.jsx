import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import CartDrawer from './components/CartDrawer'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Team from './pages/Team'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        {/* The CartDrawer sits here so it can overlay any page when opened */}
        <CartDrawer /> 
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        
        <Footer />
      </Router>
    </CartProvider>
  )
}

export default App
