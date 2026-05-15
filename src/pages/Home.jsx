import { useState } from 'react'
import { Link } from 'react-router-dom'
import { menuItems, categories, testimonials } from '../lib/data'
import OrderModal from '../components/ui/OrderModal'

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredItems = activeCategory === 'All'
    ? menuItems.slice(0, 6)
    : menuItems.filter(i => i.category === activeCategory).slice(0, 6)

  const openModal = (item) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  return (
    <div style={{backgroundColor: '#0C0C0C', color: '#F0EAD6'}}>

      {/* HERO */}
      <section style={{minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '64px', backgroundColor: '#0C0C0C'}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.025}} />
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '5rem 3rem', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'}}>
              <div style={{width: '32px', height: '1px', backgroundColor: '#C9A84C'}} />
              <span style={{fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C'}}>Authentic Ghanaian Cuisine · Take-Out Only</span>
            </div>
            <h1 style={{fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(3rem, 5.5vw, 5.8rem)', fontWeight: 300, lineHeight: 1, color: '#F0EAD6'}}>
              <em style={{fontStyle: 'italic', color: '#C9A84C'}}>The Soul of</em>
              <strong style={{fontWeight: 600, display: 'block'}}>Ghana on<br/>Your Plate</strong>
            </h1>
            <p style={{fontSize: '0.88rem', color: '#8A7E6A', lineHeight: 1.8, margin: '1.5rem 0 2.5rem', maxWidth: '400px'}}>
              Handcrafted with tradition. Every dish made fresh from authentic recipes — spices sourced directly from Ghana.
            </p>
            <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap'}}>
              <Link to="/menu" style={{backgroundColor: '#C9A84C', color: '#0C0C0C', padding: '0.8rem 2rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', display: 'inline-block'}}>Browse Menu</Link>
              <button onClick={() => openModal(menuItems[0])} style={{background: 'transparent', border: '1px solid rgba(201,168,76,0.35)', color: '#8A7E6A', padding: '0.8rem 1.8rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer'}}>Order Now</button>
            </div>
            <div style={{display: 'flex', gap: '2.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(201,168,76,0.12)'}}>
              {[{num: '17+', label: 'Signature Dishes'}, {num: '100%', label: 'Authentic Recipes'}, {num: '5★', label: 'Customer Rating'}].map(s => (
                <div key={s.label}>
                  <p style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 300, color: '#C9A84C', lineHeight: 1}}>{s.num}</p>
                  <p style={{fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7E6A', marginTop: '0.3rem'}}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div onClick={() => openModal(menuItems[0])} style={{width: '100%', aspectRatio: '1', border: '1px solid rgba(201,168,76,0.2)', position: 'relative', overflow: 'hidden', cursor: 'pointer'}}>
              <img src={menuItems[0].image} alt={menuItems[0].name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,12,0.75), transparent 55%)'}} />
              <span style={{position: 'absolute', top: '1.2rem', left: '1.2rem', backgroundColor: '#C9A84C', color: '#0C0C0C', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, padding: '0.35rem 0.9rem'}}>Chef's Pick</span>
              <span style={{position: 'absolute', bottom: '1.2rem', left: '1.2rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: '#F0EAD6'}}>{menuItems[0].name}</span>
              <span style={{position: 'absolute', bottom: '1.2rem', right: '1.2rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#C9A84C'}}>£{menuItems[0].price.toFixed(2)}</span>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px'}}>
              {menuItems.slice(1, 4).map(item => (
                <div key={item.id} onClick={() => openModal(item)} style={{aspectRatio: '1', border: '1px solid rgba(201,168,76,0.12)', position: 'relative', overflow: 'hidden', cursor: 'pointer'}}>
                  <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  <div style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)'}} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{backgroundColor: '#C9A84C', padding: '0.7rem 0', overflow: 'hidden', whiteSpace: 'nowrap'}}>
        <div className="animate-ticker" style={{display: 'inline-flex'}}>
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{display: 'inline-flex'}}>
              {['✦ Fresh Daily', 'Authentic Ghanaian', '17+ Dishes', 'Cash on Pickup', 'Track Your Order', 'WhatsApp Notifications', "Naa's Delight"].map(t => (
                <span key={t} style={{display: 'inline-flex', alignItems: 'center', gap: '1.5rem', padding: '0 2rem', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#0C0C0C'}}>
                  {t} <span style={{opacity: 0.4}}>◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED DISHES */}
      <section style={{backgroundColor: '#111111', padding: '6rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 3rem'}}>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.75rem'}}>
                <div style={{width: '28px', height: '1px', backgroundColor: '#C9A84C'}} />
                <span style={{fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C'}}>Our Menu</span>
              </div>
              <h2 style={{fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 300, color: '#F0EAD6'}}>
                Dishes crafted with <em style={{fontStyle: 'italic', color: '#C9A84C'}}>love & tradition</em>
              </h2>
            </div>
            <Link to="/menu" style={{border: '1px solid rgba(201,168,76,0.35)', color: '#8A7E6A', padding: '0.8rem 1.5rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none'}}>View Full Menu</Link>
          </div>

          {/* Category Tabs */}
          <div style={{display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.12)', marginBottom: '2rem', overflowX: 'auto'}}>
            {categories.map(cat => (
              <button key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{padding: '0.75rem 1.4rem', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeCategory === cat.name ? '2px solid #C9A84C' : '2px solid transparent', color: activeCategory === cat.name ? '#C9A84C' : '#8A7E6A', marginBottom: '-1px', whiteSpace: 'nowrap'}}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured Hero */}
          <div style={{gridTemplateColumns: '1fr 1fr', display: 'grid', marginBottom: '1px'}}>
            <div style={{backgroundColor: '#171717', aspectRatio: '16/10', position: 'relative', overflow: 'hidden'}}>
              <img src={menuItems[0].image} alt={menuItems[0].name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
            <div style={{backgroundColor: '#171717', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <span style={{display: 'inline-block', border: '1px solid #C9A84C', color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.3rem 0.9rem', marginBottom: '1.5rem', width: 'fit-content'}}>Featured Dish</span>
              <h3 style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 300, color: '#F0EAD6', lineHeight: 1.1, marginBottom: '0.75rem'}}>Signature<br/>Jollof Rice</h3>
              <p style={{fontSize: '0.83rem', color: '#8A7E6A', lineHeight: 1.8, marginBottom: '1.5rem'}}>Slow-cooked in a rich tomato base infused with scotch bonnet peppers and a secret blend of West African spices.</p>
              <p style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#C9A84C', fontWeight: 300, marginBottom: '1.5rem'}}>£12.00</p>
              <button onClick={() => openModal(menuItems[0])} style={{backgroundColor: '#C9A84C', color: '#0C0C0C', padding: '0.75rem 1.8rem', fontSize: '0.70rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, border: 'none', cursor: 'pointer', width: 'fit-content'}}>Add to Order</button>
            </div>
          </div>

          {/* Dish Grid */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'rgba(201,168,76,0.06)'}}>
            {filteredItems.map(item => (
              <div key={item.id} onClick={() => openModal(item)} style={{backgroundColor: '#171717', cursor: 'pointer', position: 'relative', overflow: 'hidden'}}>
                <div style={{width: '100%', aspectRatio: '4/3', position: 'relative', overflow: 'hidden'}}>
                  <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,12,0.6), transparent 55%)'}} />
                  {item.tag && <span style={{position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#C9A84C', color: '#0C0C0C', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, padding: '0.3rem 0.7rem'}}>{item.tag}</span>}
                </div>
                <div style={{padding: '1.1rem 1.2rem 1.3rem'}}>
                  <p style={{fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.4rem'}}>{item.category}</p>
                  <p style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#F0EAD6', marginBottom: '0.3rem'}}>{item.name}</p>
                  <p style={{fontSize: '0.75rem', color: '#8A7E6A', lineHeight: 1.6, marginBottom: '0.85rem'}}>{item.description.substring(0, 80)}...</p>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', color: '#C9A84C'}}>£{item.price.toFixed(2)}</span>
                    <button style={{width: '30px', height: '30px', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: '#C9A84C', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign: 'center', marginTop: '2.5rem'}}>
            <Link to="/menu" style={{backgroundColor: '#C9A84C', color: '#0C0C0C', padding: '0.8rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', display: 'inline-block'}}>View All 17+ Dishes</Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
