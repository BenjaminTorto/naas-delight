import React from 'react';

// You must import the images from the 'food' folder in assets
import victoriaImg from '../assets/food/victoria.jpg';
import hildaImg from '../assets/food/hilda.jpg';

const teamMembers = [
  {
    id: 1,
    name: "Victoria",
    role: "FOUNDER & HEAD CHEF",
    image: victoriaImg, 
    bio: "The visionary behind Naa's Delight. Victoria combines traditional Ghanaian culinary heritage with modern techniques to create our signature luxury menu."
  },
  {
    id: 2,
    name: "Mrs. Hilda",
    role: "CO-HEAD CHEF",
    image: hildaImg, 
    bio: "A master of authentic West African flavours, Mrs. Hilda ensures every dish maintains the traditional depth and quality that defines our kitchen."
  }
];

const Team = () => {
  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 300, marginBottom: '1.5rem' }}>
            The <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Team</em>
          </h1>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '5rem'
        }}>
          {teamMembers.map((member) => (
            <div key={member.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '100%', 
                aspectRatio: '4/5', 
                overflow: 'hidden', 
                marginBottom: '2.5rem', 
                border: '1px solid rgba(201,168,76,0.1)',
                backgroundColor: '#1a1a1a'
              }}>
                <img 
                  src={member.image} 
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 300, marginBottom: '0.5rem' }}>{member.name}</h3>
                <p style={{ color: '#C9A84C', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>{member.role}</p>
                <p style={{ color: '#8A7E6A', fontSize: '0.95rem', lineHeight: '1.8', maxWidth: '300px', margin: '0 auto' }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
