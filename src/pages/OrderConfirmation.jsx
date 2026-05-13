import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (!error) setOrder(data);
      setLoading(false);
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <div style={msgStyle}>Verifying Receipt...</div>;

  if (!order) return (
    <div style={msgStyle}>
      <h2 style={{ color: '#C9A84C' }}>Order Not Found</h2>
      <Link to="/menu" style={{ color: '#F0EAD6', marginTop: '1rem' }}>Back to Menu</Link>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: '120px', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: '#111', border: '1px solid #C9A84C' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem', marginBottom: '1rem' }}>Order Confirmed!</h1>
        <p style={{ color: '#8A7E6A', marginBottom: '2rem' }}>Order ID: {order.id.slice(0, 8)}</p>
        
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{item.quantity}x {item.name}</span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #222', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', color: '#C9A84C', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>£{order.total_price.toFixed(2)}</span>
          </div>
        </div>

        <Link to="/track" style={{ backgroundColor: '#C9A84C', color: '#0C0C0C', padding: '1rem 2rem', textDecoration: 'none', fontWeight: 'bold' }}>
          TRACK STATUS
        </Link>
      </div>
    </div>
  );
};

const msgStyle = { backgroundColor: '#0C0C0C', color: '#F0EAD6', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };

export default OrderConfirmation;
