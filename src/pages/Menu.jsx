import { useState, useEffect } from 'react'
import { categories } from '../lib/data' 
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

// Asset imports for the mapping
import jollofRice from '../assets/food/jollof-rice.jpg'
import assortedJollof from '../assets/food/assorted-jollof.png'
import assortedFriedRice from '../assets/food/assorted-fried-rice.jpg'
import checkCheckRice from '../assets/food/check-check-rice.jpg'
import waakye from '../assets/food/waakye.jpg'
import riceTilapia from '../assets/food/rice-tilapia.jpg'
import yamFish from '../assets/food/yam-fish.png'
import friesChicken from '../assets/food/fries-chicken.png'
import chickenWings from '../assets/food/chicken-wings.jpg'
import kelewele from '../assets/food/kelewele.png'
import beansPlantain from '../assets/food/beans-plantain.png'
import sobolo from '../assets/food/sobolo.png'
import friedTilapia from '../assets/food/fried-tilapia.jpg'
import friedChicken from '../assets/food/fried-chicken.jpg..jpg'

const assetMap = {
  'jollof-rice.jpg': jollofRice,
  'assorted-jollof.png': assortedJollof,
  'assorted-fried-rice.jpg': assortedFriedRice,
  'check-check-rice.jpg': checkCheckRice,
  'waakye.jpg': waakye,
  'rice-tilapia.jpg': riceTilapia,
  'yam-fish.png': yamFish,
  'fries-chicken.png': friesChicken,
  'chicken-wings.jpg': chickenWings,
  'kelewele.png': kelewele,
  'beans-plantain.png': beansPlantain,
  'sobolo.png': sobolo,
  'fried-tilapia.jpg': friedTilapia,
  'fried-chicken.jpg..jpg': friedChicken
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu')
        .select('*')
        .order('id', { ascending: true });
      
      if (!error) setMenuItems(data);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const filtered = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory)

  if (loading) {
    return (
      <div style={{backgroundColor: '#0C0C0C', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C9A84C'}}>
        <span style={{letterSpacing: '0.3em', fontSize: '0.8rem'}}>PREPARING MENU...</span>
      </div>
    );
  }

  return (
    <div style={{backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh'}}>
      
      {/* Header Section */}
      <section style={{padding: '10rem 3rem 4rem', backgroundColor: '#0C0C0C'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem'}}>
            <div style={{width: '28px', height: '1px', backgroundColor: '#C9A84C'}} />
            <span style={{fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C'}}>Authentic Cuisine</span>
          </div>
          <h1 style={{fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', fontWeight: 300, lineHeight: 0.9, marginBottom: '2rem'}}>
            The <em style={{fontStyle: 'italic', color: '#C9A84C'}}>Menu</em>
          </h1>
          <p style={{fontSize: '0.9rem', color: '#8A7E6A', maxWidth: '480px', lineHeight: 1.8, letterSpacing: '0.02em'}}>
            Experience the vibrant soul of Ghana. Every dish is crafted with traditional spices sourced directly from the Motherland and prepared fresh in our UK kitchen.
          </p>
        </div>
      </section>

      {/* Categories & Grid */}
      <div style={{backgroundColor: '#0C0C0C', padding: '0 3rem 8rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          
          {/* Category Tabs */}
          <div style={{display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.1)', marginBottom: '4rem', overflowX: 'auto', scrollbarWidth: 'none'}}>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  padding: '1.5rem 2rem',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderBottom: activeCategory === cat.name ? '1px solid #C9A84C' : '1px solid transparent',
                  color: activeCategory === cat.name ? '#C9A84C' : '#555',
                  marginBottom: '-1px',
                  whiteSpace: 'nowrap',
                  transition: '0.4s'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Luxury Grid */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem', alignItems: 'stretch'}}>
            {filtered.map(item => (
              <div
                key={item.id || item.name}
                style={{
                  backgroundColor: '#111', 
                  border: '1px solid rgba(255,255,255,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <div style={{width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative'}}>
                  <img
                    src={assetMap[item.image_url] || item.image_url}
                    alt={item.name}
                    style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9}}
                  />
                  {item.tag && (
                    <span style={{position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#C9A84C', color: '#0C0C0C', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 800, padding: '0.4rem 0.8rem', zIndex: 2}}>
                      {item.tag}
                    </span>
                  )}
                </div>
                
                <div style={{padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1}}>
                  <div style={{marginBottom: '1rem'}}>
                    <p style={{fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem'}}>{item.category}</p>
                    <h3 style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#F0EAD6', fontWeight: 300}}>{item.name}</h3>
                  </div>
                  
                  <p style={{fontSize: '0.85rem', color: '#8A7E6A', lineHeight: 1.7, marginBottom: '2.5rem'}}>
                    {item.description}
                  </p>
                  
                  {/* Price and Button Anchored to Bottom */}
                  <div style={{marginTop: 'auto'}}>
                    <div style={{
                        textAlign: 'center', 
                        padding: '1.5rem 0', 
                        borderTop: '1px solid rgba(201,168,76,0.1)',
                        marginBottom: '1.5rem'
                    }}>
                        <span style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#C9A84C'}}>£{Number(item.price).toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => addToCart(item)}
                        style={buttonStyle}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#C9A84C'; e.target.style.color = '#0C0C0C'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#C9A84C'; }}
                    >
                        Add to Basket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Support Section */}
          <div style={{textAlign: 'center', marginTop: '8rem', padding: '4rem', borderTop: '1px solid rgba(201,168,76,0.1)'}}>
            <h4 style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '1rem'}}>Large Event Catering?</h4>
            <p style={{fontSize: '0.9rem', color: '#8A7E6A', marginBottom: '2.5rem', lineHeight: 1.8}}>
              We offer bespoke menus for weddings, birthdays, and corporate events.
            </p>
            <a 
              href="https://wa.me/447833698693"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '1rem', 
                backgroundColor: '#25D366', 
                color: '#fff', 
                padding: '1rem 2.5rem', 
                fontSize: '0.75rem', 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                fontWeight: 600, 
                textDecoration: 'none'
              }}
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

const buttonStyle = {
  width: '100%',
  backgroundColor: 'transparent',
  color: '#C9A84C',
  border: '1px solid #C9A84C',
  padding: '1.2rem',
  fontSize: '0.7rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s'
};

export default Menu
