import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import KitchenStatusBadge from '../ui/KitchenStatusBadge'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  
  // Connect to our global Cart Context
  const { toggleCart, cart } = useCart()
  const { theme, toggleTheme } = useTheme()
  
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
    { to: '/events', label: 'Book an Event' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--nav-bg-95)] backdrop-blur-md border-b border-gold/15' : 'bg-[var(--nav-bg-90)] backdrop-blur-md border-b border-gold/10'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

        <Link to="/" className="font-serif text-xl font-semibold text-gold tracking-widest uppercase">
          Naa's Delight
        </Link>

        {/* Nav links now live exclusively behind the menu button below */}

        {/* Header icon buttons: kitchen status, circular bag button with count badge, circular menu button */}
        <div className="flex items-center gap-4">
          <KitchenStatusBadge className="hidden sm:inline-flex" />

          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-11 h-11 rounded-full bg-black-2 border border-gold/15 flex items-center justify-center text-cream hover:border-gold/40 transition-all duration-200"
          >
            {theme === 'dark' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleCart}
            aria-label="View bag"
            className="relative w-11 h-11 rounded-full bg-black-2 border border-gold/15 flex items-center justify-center text-cream hover:border-gold/40 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gold text-black text-[11px] font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Menu Toggle - visible at every screen size */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
            className="w-11 h-11 rounded-full bg-black-2 border border-gold/15 flex flex-col items-center justify-center gap-1.5 hover:border-gold/40 transition-all duration-200"
          >
            <span className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Menu Overlay - shows the six pages when the icon is tapped, at every screen size */}
      <div className={`transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[var(--bg-page)] border-t border-gold/10 px-6 lg:px-12 py-6 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-5 sm:gap-10">
          <KitchenStatusBadge className="sm:hidden" />
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
