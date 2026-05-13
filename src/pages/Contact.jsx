import React from 'react';

const Contact = () => {
  const contactInfo = [
    { label: 'Location', value: '25 Grasmere Road, London SE25 4RF', icon: '📍' },
    { label: 'Opening Hours', value: 'Tue – Sun: 12PM – 9PM', icon: '🕒' },
    { label: 'Contact', value: '+44 7833 698693', icon: '📞' }
  ];

  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: '120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          
          {/* Left: Branding */}
          <div>
            <div style={{ width: '28px', height: '1px', backgroundColor: '#C9A84C', marginBottom: '1.5rem' }} />
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', fontWeight: 300, marginBottom: '2rem' }}>
              Connect with <br /><em style={{ fontStyle: 'italic', color: '#C9A84C' }}>the Kitchen</em>
            </h1>
            <p style={{ color: '#8A7E6A', lineHeight: 1.8, maxWidth: '400px', marginBottom: '3rem' }}>
              For large catering orders or special events, reach out to us directly via WhatsApp for a personalized menu.
            </p>
            
            <a href="https://wa.me/447833698693" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 2.5rem', border: '1px solid #C9A84C', color: '#C9A84C', textDecoration: 'none', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 600 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              Message us
            </a>
          </div>

          {/* Right: Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#1E1E1E' }}>
            {contactInfo.map((info) => (
              <div key={info.label} style={{ backgroundColor: '#111', padding: '2.5rem' }}>
                <p style={{ fontSize: '0.6rem', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>{info.label}</p>
                <p style={{ fontSize: '1.2rem', fontFamily: 'serif' }}>{info.value}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
