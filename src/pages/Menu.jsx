import { useState, useEffect } from 'react'
import { categories } from '../lib/data' 
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

// Asset imports
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
      // Fetching all columns including the new 'is_available'
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
            Experience the vibrant soul of Ghana. Every dish is prepared fresh in our SE25 kitchen.
          </p>
        </div>
      </section>

      <div style={{backgroundColor: '#0C0C0C', padding: '0 3rem 8rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          
          <div style={{display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.1)', marginBottom: '4rem', overflowX: 'auto', scrollbarWidth: 'none'}}>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  padding: '1.5rem 2rem', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', background: 'transparent', cursor: 'pointer',
                  borderBottom: activeCategory === cat.name ? '1px solid #C9A84C' : '1px solid transparent',
                  color: activeCategory === cat.name ? '#C9A84C' : '#555', marginBottom: '-1px', whiteSpace: 'nowrap', transition: '0.4s'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem', alignItems: 'stretch'}}>
            {filtered.map(item => {
              // Check availability (default to true if column doesn't exist yet)
              const available = item.is_available !== false;

              return (
                <div
                  key={item.id || item.name}
                  style={{
                    backgroundColor: '#111', 
                    border: '1px solid rgba(255,255,255,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    opacity: available ? 1 : 0.6 // Dim the card if sold out
                  }}
                >
                  <div style={{width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative'}}>
                    <img
                      src={assetMap[item.image_url] || item.image_url}
                      alt={item.name}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover', 
                        opacity: available ? 0.9 : 0.3, // Fade image if sold out
                        filter: available ? 'none' : 'grayscale(100%)'
                      }}
                    />
                    
                    {/* Sold Out Badge */}
                    {!available && (
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '100%', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.7)',
                        padding: '1rem 0', color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.3em',
                        textTransform: 'uppercase', fontWeight: 800, borderY: '1px solid #C9A84C'
                      }}>
                        Not Available Today
                      </div>
                    )}

                    {item.tag && available && (
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
                    
                    <div style={{marginTop: 'auto'}}>
                      <div style={{textAlign: 'center', padding: '1.5rem 0', borderTop: '1px solid rgba(201,168,76,0.1)', marginBottom: '1.5rem'}}>
                          <span style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: available ? '#C9A84C' : '#444'}}>
                            £{Number(item.price).toFixed(2)}
                          </span>
                      </div>
                      <button
                          disabled={!available}
                          onClick={() => addToCart(item)}
                          style={{
                            ...buttonStyle,
                            cursor: available ? 'pointer' : 'not-allowed',
                            borderColor: available ? '#C9A84C' : '#333',
                            color: available ? '#C9A84C' : '#555'
                          }}
                          onMouseEnter={(e) => { 
                            if(available) {
                              e.target.style.backgroundColor = '#C9A84C'; 
                              e.target.style.color = '#0C0C0C'; 
                            }
                          }}
                          onMouseLeave={(e) => { 
                            if(available) {
                              e.target.style.backgroundColor = 'transparent'; 
                              e.target.style.color = '#C9A84C'; 
                            }
                          }}
                      >
                          {available ? 'Add to Basket' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const buttonStyle = {
  width: '100%',
  backgroundColor: 'transparent',
  border: '1px solid #C9A84C',
  padding: '1.2rem',
  fontSize: '0.7rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  fontWeight: 700,
  transition: 'all 0.3s'
};

export default Menu
