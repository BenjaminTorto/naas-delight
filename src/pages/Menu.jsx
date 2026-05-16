import { useState, useEffect } from 'react'
import { categories } from '../lib/data' 
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

// Asset imports
import jollofRice from '../assets/food/jollof-rice.jpg'
import assortedJollof from '../assets/food/assorted-jollof.jpg'
import assortedFriedRice from '../assets/food/assorted-fried-rice.jpg'
import checkCheckRice from '../assets/food/check-check-rice.jpg'
import waakye from '../assets/food/waakye.jpg'
import riceTilapia from '../assets/food/rice-tilapia.jpg'
import yamFish from '../assets/food/yam-fish.jpg'
import friesChicken from '../assets/food/fries-chicken.jpg'
import chickenWings from '../assets/food/chicken-wings.jpg'
import kelewele from '../assets/food/kelewele.jpg'
import beansPlantain from '../assets/food/beans-plantain.jpg'
import sobolo from '../assets/food/sobolo.jpg'
import friedTilapia from '../assets/food/fried-tilapia.jpg'
import friedChicken from '../assets/food/fried-chicken.jpg'

const assetMap = {
  'jollof-rice.jpg': jollofRice,
  'assorted-jollof.jpg': assortedJollof,
  'assorted-fried-rice.jpg': assortedFriedRice,
  'check-check-rice.jpg': checkCheckRice,
  'waakye.jpg': waakye,
  'rice-tilapia.jpg': riceTilapia,
  'yam-fish.jpg': yamFish,
  'fries-chicken.jpg': friesChicken,
  'chicken-wings.jpg': chickenWings,
  'kelewele.jpg': kelewele,
  'beans-plantain.jpg': beansPlantain,
  'sobolo.jpg': sobolo,
  'fried-tilapia.jpg': friedTilapia,
  'fried-chicken.jpg': friedChicken
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
    : menuItems.filter(item => item.category?.toLowerCase() === activeCategory.toLowerCase())

  if (loading) {
    return (
      <div style={{minHeight: '100vh', backgroundColor: '#0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', letterSpacing: '0.1em'}}>Loading Delightful Menu...</p>
      </div>
    )
  }

  return (
    <div style={{backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: '120px', paddingBottom: '6rem'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 3rem'}}>
        
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1rem'}}>
            <div style={{width: '24px', height: '1px', backgroundColor: '#C9A84C'}} />
            <span style={{fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C'}}>Culinary Art</span>
            <div style={{width: '24px', height: '1px', backgroundColor: '#C9A84C'}} />
          </div>
          <h1 style={{fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: '#F0EAD6', marginBottom: '1rem'}}>
            The <em style={{fontStyle: 'italic', color: '#C9A84C'}}>Naas Delight</em> Menu
          </h1>
          <p style={{color: '#8A7E6A', fontSize: '0.85rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7}}>
            Every dish is prepared fresh on request using authentic ingredients. Choose your favorites for local pick-up.
          </p>
        </div>

        {/* Categories Tabs */}
        <div style={{display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(201,168,76,0.12)', marginBottom: '3.5rem', overflowX: 'auto', gap: '1rem'}}>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{
                padding: '1rem 1.5rem',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                borderBottom: activeCategory === cat.name ? '2px solid #C9A84C' : '2px solid transparent',
                color: activeCategory === cat.name ? '#C9A84C' : '#8A7E6A',
                marginBottom: '-1px',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '2.5rem'}}>
          {filtered.map(item => {
            const available = item.is_available !== false;
            return (
              <div 
                key={item.id} 
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid rgba(201,168,76,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  opacity: available ? 1 : 0.6
                }}
              >
                <div style={{width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative'}}>
                  <img
                    src={item.image || assetMap[item.image_url] || item.image_url}
                    alt={item.name}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover', 
                      opacity: available ? 0.9 : 0.3,
                      filter: available ? 'none' : 'grayscale(100%)'
                    }}
                  />
                  
                  {/* Status Tag */}
                  {item.tag && available && (
                    <span style={{position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#C9A84C', color: '#0C0C0C', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, padding: '0.35rem 0.8rem'}}>
                      {item.tag}
                    </span>
                  )}
                  {!available && (
                    <span style={{position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#2A2A2A', color: '#8A7E6A', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, padding: '0.35rem 0.8rem'}}>
                      Sold Out
                    </span>
                  )}
                </div>

                <div style={{padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <div>
                    <span style={{fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', display: 'block', marginBottom: '0.4rem'}}>
                      {item.category}
                    </span>
                    <h3 style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: '#F0EAD6', marginBottom: '0.6rem'}}>
                      {item.name}
                    </h3>
                    <p style={{fontSize: '0.78rem', color: '#8A7E6A', lineHeight: 1.6, marginBottom: '1.5rem'}}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(201,168,76,0.05)'}}>
                    <span style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: '#C9A84C', fontWeight: 400}}>
                      £{Number(item.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => available && addToCart(item)}
                      disabled={!available}
                      style={{
                        backgroundColor: available ? 'transparent' : 'transparent',
                        border: available ? '1px solid #C9A84C' : '1px solid rgba(138,126,106,0.2)',
                        color: available ? '#C9A84C' : '#5A5040',
                        padding: '0.45rem 1.2rem',
                        fontSize: '0.62rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        cursor: available ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {available ? 'Add To Bag' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Menu
