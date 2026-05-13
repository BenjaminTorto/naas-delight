import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  
  const [editingId, setEditingId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.6;
    audio.play().catch(e => console.log("Audio play blocked."));
  };

  const fetchData = async () => {
    try {
      const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      const { data: menuData } = await supabase.from('menu').select('*').order('name', { ascending: true });

      setOrders(orderData || []);
      setMenuItems(menuData || []);
      
      const revenue = orderData?.reduce((acc, order) => acc + (Number(order.total_price) || 0), 0) || 0;
      setStats({ totalOrders: orderData?.length || 0, totalRevenue: revenue });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const subscription = supabase.channel('orders_channel').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => {
          playSound();
          fetchData();
        }).subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);

  const updatePrice = async (itemId) => {
    const { error } = await supabase
      .from('menu')
      .update({ price: parseFloat(newPrice) })
      .eq('id', itemId);
    
    if (error) {
      alert("Error updating price: Check Supabase RLS policies");
      console.error(error);
    } else {
      setEditingId(null);
      fetchData();
    }
  };

  if (loading) return <div style={{ color: '#C9A84C', textAlign: 'center', paddingTop: '200px' }}>Loading Naa's Delight...</div>;

  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', borderBottom: '1px solid #222', paddingBottom:  '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300 }}>Management</h1>
            <p style={{ color: '#C9A84C', letterSpacing: '0.2em', fontSize: '0.7rem' }}>LIVE KITCHEN FEED</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.5rem', margin: 0 }}>£{stats.totalRevenue.toFixed(2)}</p>
            <p style={{ color: '#8A7E6A', fontSize: '0.7rem' }}>TOTAL REVENUE</p>
          </div>
        </header>

        {/* Live Orders Section */}
        <section style={{ marginBottom: '6rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '2rem', color: '#C9A84C' }}>Active Orders</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{ backgroundColor: '#111', border: '1px solid #222', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{order.customer_name}</h3>
                  <span style={{ color: '#C9A84C', fontWeight: 'bold' }}>£{order.total_price?.toFixed(2)}</span>
                </div>
                <div style={{ margin: '1rem 0', fontSize: '0.9rem', color: '#8A7E6A' }}>
                  {order.items?.map((item, i) => <div key={i}>{item.quantity}x {item.name}</div>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICE MANAGEMENT SECTION */}
        <section style={{ borderTop: '1px solid #222', paddingTop: '4rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '2rem', color: '#C9A84C' }}>Edit Menu Prices</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {menuItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '1.2rem 2rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span>{item.name}</span>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {editingId === item.id ? (
                    <>
                      <input 
                        type="number" 
                        value={newPrice} 
                        onChange={(e) => setNewPrice(e.target.value)}
                        style={{ width: '80px', background: '#222', color: '#fff', border: '1px solid #C9A84C', padding: '0.4rem' }}
                      />
                      <button onClick={() => updatePrice(item.id)} style={{ color: '#22C55E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>SAVE</button>
                    </>
                  ) : (
                    <>
                      <span style={{ color: '#C9A84C' }}>£{Number(item.price).toFixed(2)}</span>
                      <button onClick={() => { setEditingId(item.id); setNewPrice(item.price); }} style={{ color: '#555', background: 'none', border: '1px solid #333', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>EDIT</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;
