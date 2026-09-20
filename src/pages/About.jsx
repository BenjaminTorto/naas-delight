import React from 'react';

import KenteAccent from '../components/ui/KenteAccent';

const About = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--cream)', minHeight: '100vh', paddingTop: 'clamp(90px, 15vw, 140px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 2rem)' }}>
        
        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(2.5rem, 6vw, 6rem)', alignItems: 'center', marginBottom: 'clamp(3.5rem, 8vw, 8rem)' }}>
          <div>
            <KenteAccent width={28} style={{ marginBottom: '1.5rem' }} />
            <h1 style={{ fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(2.6rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '2rem' }}>
              Our <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Heritage</em>
            </h1>
            <div style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p>
                Naa's Delight is a UK-based food brand bringing the warmth of West Africa to your table one dish at a time. Founded with a powerful mission to share the authentic flavours of Ghana with the world, our brand is more than just food. it’s a cultural experience. 
              </p>
              <p>
                Based in the UK, we craft every dish using traditional Ghanaian recipes passed down through generations. We use authentic spices sourced directly from Ghana, ensuring each bite is packed with bold, vibrant, and unforgettable flavours. 
              </p>
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div style={{ aspectRatio: '4/5', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)', padding: '1rem' }}>
              <img 
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80" 
                alt="Ghanaian Spices" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
              />
            </div>
            <div style={{ position: 'absolute', bottom: '-20px', right: 'clamp(0px, 2vw, -20px)', backgroundColor: 'var(--gold)', color: 'var(--bg-page)', padding: '2.5rem', borderRadius: '50%', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.4 }}>
              Authentic Cuisine
            </div>
          </div>
        </div>

        {/* Philosophy Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1px', backgroundColor: 'var(--border-grid)', marginBottom: 'clamp(3.5rem, 8vw, 8rem)' }}>
          {[
            { title: 'Nourishment', desc: 'We are dedicated to delivering food that nourishes the body and feeds the soul.' },
            { title: 'Craftsmanship', desc: 'Every dish tells a story—rooted in family tradition and Ghanaian hospitality.' },
            { title: 'Authenticity', desc: 'Crafted with love and traditional techniques to bring a taste of home to the UK.' }
          ].map((item) => (
            <div key={item.title} style={{ backgroundColor: 'var(--bg-page)', padding: 'clamp(2.5rem, 6vw, 4rem) 2rem', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--gold)', fontFamily: 'Archivo, sans-serif', fontSize: '1.8rem', marginBottom: '1.2rem', fontWeight: 400 }}>{item.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
