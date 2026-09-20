import React from 'react';
import KenteAccent from '../components/ui/KenteAccent';

// You must import the images from the 'food' folder in assets
import victoriaImg from '../assets/food/victoria.jpg';
import hildaImg from '../assets/food/hilda.jpg';

const teamMembers = [
  {
    id: 1,
    name: "Victoria",
    role: "FOUNDER & HEAD CHEF",
    image: victoriaImg, 
    bio: "The visionary behind Naa's Delight. Victoria combines traditional Ghanaian culinary heritage with modern techniques to create our signature luxury menu.",
    note: "Every plate carries a piece of home."
  },
  {
    id: 2,
    name: "Mrs. Hilda",
    role: "CO-HEAD CHEF",
    image: hildaImg, 
    bio: "A master of authentic West African flavours, Mrs. Hilda ensures every dish maintains the traditional depth and quality that defines our kitchen.",
    note: "Good food takes patience, and love."
  }
];

const Team = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--cream)', minHeight: '100vh', paddingTop: 'clamp(100px, 16vw, 140px)', paddingBottom: 'clamp(4rem, 8vw, 100px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 2rem)' }}>
        
        <header style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 8vw, 8rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <KenteAccent width={32} />
          </div>
          <h1 style={{ fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', fontWeight: 700, marginBottom: '1.5rem' }}>
            The <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Team</em>
          </h1>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 'clamp(2.5rem, 6vw, 5rem)'
        }}>
          {teamMembers.map((member) => (
            <div key={member.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '100%', 
                aspectRatio: '4/5', 
                overflow: 'visible', 
                marginBottom: '2.5rem', 
                position: 'relative',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  border: '1px solid rgba(201,168,76,0.1)',
                  backgroundColor: 'var(--bg-surface-alt)',
                }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-1.25rem',
                  left: '1.25rem',
                  maxWidth: '78%',
                  backgroundColor: 'var(--cream)',
                  color: 'var(--bg-page)',
                  padding: '0.9rem 1.25rem 1.1rem',
                  transform: 'rotate(-3deg)',
                  boxShadow: '0 12px 24px -8px rgba(0,0,0,0.6)',
                }}>
                  <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1.4rem', lineHeight: 1.25, fontWeight: 600 }}>
                    "{member.note}"
                  </p>
                  <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-dark)', marginTop: '0.15rem' }}>
                    — {member.name}
                  </p>
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Archivo, sans-serif', fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{member.name}</h3>
                <p style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>{member.role}</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.8', maxWidth: '300px', margin: '0 auto' }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
