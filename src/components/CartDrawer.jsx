import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// Asset imports for fallback mapping
import jollofRice from '../assets/food/jollof-rice.jpg';
import assortedJollof from '../assets/food/assorted-jollof.jpg';
import assortedFriedRice from '../assets/food/assorted-fried-rice.jpg';
import checkCheckRice from '../assets/food/check-check-rice.jpg';
import waakye from '../assets/food/waakye.jpg';
import riceTilapia from '../assets/food/rice-tilapia.jpg';
import yamFish from '../assets/food/yam-fish.jpg';
import friesChicken from '../assets/food/fries-chicken.jpg';
import chickenWings from '../assets/food/chicken-wings.jpg';
import kelewele from '../assets/food/kelewele.jpg';
import beansPlantain from '../assets/food/beans-plantain.jpg';
import sobolo from '../assets/food/sobolo.jpg';
import friedTilapia from '../assets/food/fried-tilapia.jpg';
import friedChicken from '../assets/food/fried-chicken.jpg';

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

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.8)', 
          backdropFilter: 'blur(8px)',
          zIndex: 9998,
          opacity: isCartOpen ? 1 : 0,
          visibility: isCartOpen ? 'visible' : 'hidden',
          transition: 'all 0.4s ease-in-out'
        }} 
      />

      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        width: '100%', 
        maxWidth: '480px', 
        height: '100%', 
        backgroundColor: '#0C0C0C', 
        borderLeft: '1px solid rgba(201,168,76,0.2)',
        zIndex: 9999,
        transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
      }}>
        
        <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#F0EAD6', fontWeight: 300 }}>Your Bag</h2>
            <p style={{ color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '0.2em', marginTop: '0.3rem' }}>{cart.length} ITEMS SELECTED</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', color: '#8A7E6A', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            CLOSE ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <p style={{ color: '#8A7E6A', fontSize: '0.9rem', marginBottom: '2rem' }}>Your bag is currently empty.</p>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/menu'); }}
                style={{ background: 'none', border: '1px solid #C9A84C', color: '#C9A84C', padding: '0.8rem 1.5rem', fontSize: '0.7rem', letterSpacing: '0.2em', cursor: 'pointer' }}
              >
                BROWSE MENU
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const resolvedImage = item.image || assetMap[item.image_url];
              return (
                <div key={item.id} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
                  <div style={{ width: '90px', height: '90px', backgroundColor: '#111', flexShrink: 0, overflow: 'hidden', border: '1px solid #1A1A1A' }}>
                    <img 
                      src={resolvedImage} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }} 
                      onError={(e) => { e.target.style.opacity = '0'; }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#F0EAD6', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>{item.name}</h4>
                    <p style={{ color: '#8A7E6A', fontSize: '0.75rem', marginTop: '0.4rem' }}>{item.quantity} x £{Number(item.price).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '2.5rem 2rem', backgroundColor: '#0F0F0F', borderTop: '1px solid #1A1A1A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'flex-end' }}>
              <span style={{ color: '#8A7E6A', fontSize: '0.7rem', letterSpacing: '0.2em' }}>SUBTOTAL</span>
              <span style={{ color: '#C9A84C', fontSize: '2rem', fontFamily: 'Cormorant Garamond, serif' }}>£{cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              style={{ 
                width: '100%', 
                backgroundColor: '#C9A84C', 
                color: '#0C0C0C', 
                padding: '1.3rem', 
                border: 'none', 
                fontWeight: 'bold', 
                letterSpacing: '0.3em',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
