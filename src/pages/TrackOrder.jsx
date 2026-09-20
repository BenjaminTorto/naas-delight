import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/order-confirmation/${orderId.trim()}`);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--cream)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Archivo, sans-serif', fontSize: '2.5rem', marginBottom: '1rem' }}>Track your Meal</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '2.5rem' }}>
          The easiest way is to tap the tracking link in your WhatsApp confirmation. If you'd rather paste your Order ID directly, do that below.
        </p>
        
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Paste your full Order ID" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{ width: '100%', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-grid)', color: 'var(--cream)', padding: '1.2rem', textAlign: 'center', fontSize: '0.9rem', letterSpacing: '0.05em', marginBottom: '1.5rem', outline: 'none' }}
          />
          <button type="submit" style={{ width: '100%', backgroundColor: 'var(--gold)', color: 'var(--bg-page)', padding: '1.2rem', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', border: 'none', cursor: 'pointer' }}>
            Check Status
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackOrder;

