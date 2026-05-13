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
    audio.play().catch(() => console.log("Audio play blocked."));
  };

  const fetchData = async () => {
    try {
      const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      const { data: menuData } = await supabase.from('menu').select('*').order('name', { ascending: true });
      
      setOrders(orderData || []);
      setMenuItems(menuData || []);
      
      const revenue = orderData?.reduce((acc, o) => acc + (Number(o.total_price) || 0), 0) || 0;
      setStats({ totalOrders: orderData?.length || 0, totalRevenue: revenue });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const sub = supabase.channel('any').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => {
      playSound();
      fetchData();
    }).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) fetchData();
  };

  const updatePrice = async (id) => {
    const { error } = await supabase.from('menu').update({ price: parseFloat(newPrice) }).eq('id', id);
    if (!error) { setEditingId(null); fetchData(); }
  };

  if (loading) return <div style={{ color: '#C9A84C', textAlign: 'center', paddingTop: '200px' }}>Loading Kitchen...</div>;

  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', borderBottom: '1px solid #222', paddingBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'serif', fontSize: '3rem' }}>Management</h1>
            <p style={{ color: '#C9A84C', letterSpacing: '0.2em', fontSize: '0.7rem' }}>LIVE FEED</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.5rem', margin: 0 }}>£{stats.totalRevenue.toFixed(2)}</p>
            <p style={{ color: '#8A7E6A', fontSize: '0.7rem' }}>REVENUE</p>
          </div>
        </header>

        {/* Live Orders */}
        <section style={{ marginBottom: '6rem' }}>
          <h2 style={{ color: '#C9A84C', marginBottom: '2rem' }}>Active Orders</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map(o => (
              <div key={o.id} style={{ background: '#111', padding: '2rem', border: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{o.customer_name}</h3>
                  <span style={{ color: '#C9A84C' }}>£{o.total_price?.toFixed(2)}</span>
                </div>
                <div style={{ margin: '1rem 0', fontSize: '0.9rem', color: '#8A7E6A' }}>
                  {o.items?.map((item, i) => <div key={i}>{item.quantity}x {item.name}</div>)}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => updateStatus(o.id, 'cooking')} style={{ flex: 1, padding: '0.8rem', background: 'none', border: '1px solid #3B82F6', color: '#3B82F6', cursor: 'pointer' }}>START COOKING</button>
                  <button onClick={() => updateStatus(o.id, 'completed')} style={{ flex: 1, padding: '0.8rem', background: '#C9A84C', border: 'none', color: '#0C0C0C', fontWeight: 'bold', cursor: 'pointer' }}>COMPLETE</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Menu Management */}
        <section style={{ borderTop: '1px solid #222', paddingTop: '4rem' }}>
          <h2 style={{ color: '#C9A84C', marginBottom: '2rem' }}>Menu Price Editor</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {menuItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#111', padding: '1.2rem', border: '1px solid #222' }}>
                <span>{item.name}</span>
                <div>
                  {editingId === item.id ? (
                    <>
                      <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ width: '60px', background: '#222', color: '#fff', border: '1px solid #C9A84C' }} />
                      <button onClick={() => updatePrice(item.id)} style={{ color: '#22C55E', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>SAVE</button>
                    </>
                  ) : (
                    <>
                      <span style={{ marginRight: '15px' }}>£{Number(item.price).toFixed(2)}</span>
                      <button onClick={() => { setEditingId(item.id); setNewPrice(item.price); }} style={{ color: '#555', background: 'none', border: '1px solid #333', cursor: 'pointer', padding: '2px 8px' }}>EDIT</button>
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
