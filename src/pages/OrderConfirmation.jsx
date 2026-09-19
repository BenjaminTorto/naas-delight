import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import OrderTracker from '../components/ui/OrderTracker';

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

  // Live-update the tracker the moment staff change the status in the
  // admin dashboard, without the customer needing to refresh the page.
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          setOrder((prev) => (prev ? { ...prev, ...payload.new } : payload.new));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) return <div style={msgStyle}>Verifying Receipt...</div>;

  if (!order) return (
    <div style={msgStyle}>
      <h2 style={{ color: '#C9A84C' }}>Order Not Found</h2>
      <Link to="/menu" style={{ color: '#F0EAD6', marginTop: '1rem' }}>Back to Menu</Link>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: 'clamp(90px, 15vw, 120px)', paddingLeft: '1.25rem', paddingRight: '1.25rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 2rem)', backgroundColor: '#111', border: '1px solid #C9A84C' }}>
        <h1 style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: '0.5rem' }}>
          {order.status === 'Completed' ? 'Order Picked Up' : order.status === 'Cancelled' ? 'Order Cancelled' : 'Order Confirmed!'}
        </h1>
        <p style={{ color: '#8A7E6A', marginBottom: '2rem' }}>Order ID: {order.id.slice(0, 8)}</p>

        <OrderTracker status={order.status || 'Pending'} />

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
          TRACK ANOTHER ORDER
        </Link>
      </div>
    </div>
  );
};

const msgStyle = { backgroundColor: '#0C0C0C', color: '#F0EAD6', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };

export default OrderConfirmation;
