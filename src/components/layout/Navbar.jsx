import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  
  // Connect to our global Cart Context
  const { toggleCart, cart } = useCart()
  
  // Calculate total items in the bag (e.g., 2 Jollof + 1 Drink = 3 items)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'About' },
    { to: '/team', label: 'Team' },
    { to: '/contact', label: 'Contact' },
    { to: '/track', label: 'Track Order' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md border-b border-gold/15' : 'bg-black/90 backdrop-blur-md border-b border-gold/10'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

        <Link to="/" className="font-serif text-xl font-semibold text-gold tracking-widest uppercase">
          Naa's Delight
        </Link>

        {/* Nav links now live exclusively behind the menu button below */}

        {/* The Cart/Bag Button - Triggers Drawer */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleCart}
            className="flex items-center gap-2 text-gold group transition-all duration-200"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold opacity-80 group-hover:opacity-100">
              Bag
            </span>
            <div className="flex items-center justify-center bg-gold/10 border border-gold/30 px-2 py-0.5 rounded-sm min-w-[28px] group-hover:bg-gold group-hover:text-black transition-all">
              <span className="text-[11px] font-bold">{cartCount}</span>
            </div>
          </button>

          {/* Menu Toggle - visible at every screen size */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
            className="flex flex-col gap-1.5 p-1"
          >
            <span className={`block w-6 h-px bg-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-px bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Menu Overlay - shows the six pages when the icon is tapped, at every screen size */}
      <div className={`transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#0C0C0C] border-t border-gold/10 px-6 lg:px-12 py-6 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-5 sm:gap-10">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-widest uppercase font-normal transition-colors duration-200 ${isActive(link.to) ? 'text-gold' : 'text-muted hover:text-gold'}`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              toggleCart();
            }}
            className="border border-gold text-gold px-5 py-3 text-xs tracking-widest uppercase font-medium text-center sm:ml-auto hover:bg-gold hover:text-black transition-all duration-200"
          >
            View Basket ({cartCount})
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
