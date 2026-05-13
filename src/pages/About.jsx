import React from 'react';

const About = () => {
  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: '120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', alignItems: 'center', marginBottom: '8rem' }}>
          <div>
            <div style={{ width: '28px', height: '1px', backgroundColor: '#C9A84C', marginBottom: '1.5rem' }} />
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '2rem' }}>
              Our <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Heritage</em>
            </h1>
            <div style={{ color: '#8A7E6A', lineHeight: 1.8, fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p>
                Naa's Delight is a UK-based food brand bringing the warmth of West Africa to your table one dish at a time. [cite: 1] Founded with a powerful mission to share the authentic flavours of Ghana with the world, our brand is more than just food—it’s a cultural experience. [cite: 6, 7]
              </p>
              <p>
                Based in the UK, we craft every dish using traditional Ghanaian recipes passed down through generations. [cite: 8] We use authentic spices sourced directly from Ghana, ensuring each bite is packed with bold, vibrant, and unforgettable flavours. [cite: 8, 12]
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
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', backgroundColor: '#C9A84C', color: '#0C0C0C', padding: '2.5rem', borderRadius: '50%', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.4 }}>
              Authentic Cuisine
            </div>
          </div>
        </div>

        {/* Philosophy Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1px', backgroundColor: '#1E1E1E', marginBottom: '8rem' }}>
          {[
            { title: 'Nourishment', desc: 'We are dedicated to delivering food that nourishes the body and feeds the soul. [cite: 10]' },
            { title: 'Craftsmanship', desc: 'Every dish tells a story—rooted in family tradition and Ghanaian hospitality. [cite: 4]' },
            { title: 'Authenticity', desc: 'Crafted with love and traditional techniques to bring a taste of home to the UK. [cite: 5]' }
          ].map((item) => (
            <div key={item.title} style={{ backgroundColor: '#0C0C0C', padding: '4rem 2rem', textAlign: 'center' }}>
              <h3 style={{ color: '#C9A84C', fontFamily: 'serif', fontSize: '1.8rem', marginBottom: '1.2rem', fontWeight: 400 }}>{item.title}</h3>
              <p style={{ color: '#8A7E6A', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;