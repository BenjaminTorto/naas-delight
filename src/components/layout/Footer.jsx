import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black-2 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gold/10">
          <div>
            <span className="font-serif text-2xl font-semibold text-gold tracking-widest uppercase block mb-3">
              Naas Delight
            </span>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Authentic Ghanaian cuisine, made fresh daily. Order online, pick up with pride.
            </p>
          </div>
          <div>
            <h5 className="text-xs tracking-widest uppercase text-gold font-medium mb-5">Navigate</h5>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Menu' },
                { to: '/about', label: 'About Us' },
                { to: '/team', label: 'Our Team' },
                { to: '/contact', label: 'Contact' },
                { to: '/track', label: 'Track Order' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted hover:text-gold transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-widest uppercase text-gold font-medium mb-5">Order</h5>
            <ul className="space-y-3">
              {[
                { to: '/menu', label: 'Browse Menu' },
                { to: '/track', label: 'Track My Order' },
                { to: '/', label: 'How It Works' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted hover:text-gold transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-widest uppercase text-gold font-medium mb-5">Contact</h5>
            <ul className="space-y-3">
              <li>
                <a href="tel:+447833698693" className="text-sm text-muted hover:text-gold transition-colors duration-200">
                  +44 7833 698693
                </a>
              </li>
              <li>
                <a href="mailto:Naasdelights@gmail.com" className="text-sm text-muted hover:text-gold transition-colors duration-200">
                  Naasdelights@gmail.com
                </a>
              </li>
              <li className="text-sm text-muted leading-relaxed">
                 London SE25 4RF
              </li>
              <li>
                <a href="https://wa.me/447833698693" target="_blank" rel="noreferrer" className="text-sm text-green-400 hover:text-green-300 transition-colors duration-200">
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-between pt-6">
          <span className="text-xs text-muted/40">
            2026 Naas Delight. All rights reserved.
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
