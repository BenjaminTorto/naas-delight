import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [editingId, setEditingId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const navigate = useNavigate();

  const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.6;
    audio.play().catch(() => console.log("Audio play blocked."));
  };

  const fetchData = async () => {
    try {
      const { data: orderData, error: orderErr } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      const { data: menuData, error: menuErr } = await supabase.from('menu').select('*').order('name', { ascending: true });
      
      if (orderErr) console.error("Orders Fetch Error:", orderErr);
      if (menuErr) console.error("Menu Fetch Error:", menuErr);

      const parsedOrders = orderData || [];
      setOrders(parsedOrders);
      setMenuItems(menuData || []);
      
      // Dynamic key matching for schema compatibility (total_price vs totalPrice)
      const revenue = parsedOrders.reduce((acc, o) => {
        const rawPrice = o.total_price ?? o.totalPrice ?? o.price ?? 0;
        return acc + (Number(rawPrice) || 0);
      }, 0);

      setStats({ totalOrders: parsedOrders.length, totalRevenue: revenue });
    } catch (err) {
      console.error("System catch block exception:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-login');
      } else {
        fetchData();
      }
    };

    checkUser();

    const sub = supabase.channel('realtime-orders').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => {
      playSound();
      fetchData();
    }).subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-login');
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) fetchData();
  };

  const updatePrice = async (id) => {
    const { error } = await supabase.from('menu').update({ price: parseFloat(newPrice) }).eq('id', id);
    if (!error) { setEditingId(null); fetchData(); }
  };

  const toggleAvailability = async (id, currentStatus) => {
    const { error } = await supabase.from('menu').update({ is_available: !currentStatus }).eq('id', id);
    if (!error) fetchData();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem' }}>Verifying Portal Access...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0C0C0C', color: '#F0EAD6', padding: '120px 2rem 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '1.5rem', marginBottom: '3rem' }}>
          <div>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C' }}>Management Dashboard</span>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, marginTop: '0.25rem' }}>Naa's Delight HQ</h1>
          </div>
          <button 
            onClick={handleLogout}
            style={{ backgroundColor: 'transparent', border: '1px solid rgba(255, 107, 107, 0.4)', color: '#ff6b6b', padding: '0.6rem 1.4rem', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600 }}
          >
            Sign Out
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.08)', padding: '2rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7E6A' }}>Total Active Volume</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: '#C9A84C', marginTop: '0.5rem', fontWeight: 300 }}>{stats.totalOrders}</p>
          </div>
          <div style={{ backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.08)', padding: '2rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A7E6A' }}>Gross Pipeline Revenue</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: '#C9A84C', marginTop: '0.5rem', fontWeight: 300 }}>£{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, marginBottom: '1.5rem', color: '#C9A84C' }}>Active Inbound Orders</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.length === 0 ? (
              <p style={{ color: '#8A7E6A', fontSize: '0.85rem', fontStyle: 'italic' }}>Waiting for fresh incoming orders...</p>
            ) : (
              orders.map(order => {
                // Defensive extraction to prevent empty string fallouts
                const orderId = order.id;
                const dateVal = order.created_at || order.createdAt;
                const summary = order.items_summary || order.itemsSummary || "Custom Order Selection";
                const clientName = order.customer_name || order.customerName || "Guest User";
                const clientPhone = order.customer_phone || order.customerPhone || "No Phone Provided";
                const totalCost = order.total_price ?? order.totalPrice ?? 0;

                return (
                  <div key={orderId} style={{ backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.08)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F0EAD6' }}>Order #{orderId}</span>
                        {dateVal && <span style={{ fontSize: '0.7rem', color: '#8A7E6A' }}>{new Date(dateVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#C9A84C', marginBottom: '0.25rem' }}>{summary}</p>
                      <p style={{ fontSize: '0.75rem', color: '#8A7E6A' }}>Customer: {clientName} ({clientPhone})</p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#F0EAD6' }}>£{Number(totalCost).toFixed(2)}</span>
                      <select 
                        value={order.status || 'Pending'} 
                        onChange={(e) => updateStatus(orderId, e.target.value)}
                        style={{ backgroundColor: '#171717', color: '#F0EAD6', border: '1px solid rgba(201,168,76,0.2)', padding: '0.5rem 1rem', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="Pending">⏱ Pending</option>
                        <option value="Preparing">🍳 Preparing</option>
                        <option value="Ready">✅ Ready for Pickup</option>
                        <option value="Completed">📦 Completed</option>
                        <option value="Cancelled">❌ Cancelled</option>
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, marginBottom: '1.5rem', color: '#C9A84C' }}>Live Menu Inventory Control</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {menuItems.map(item => (
              <div key={item.id} style={{ backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.05)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, color: '#F0EAD6' }}>{item.name}</h3>
                    <span style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C' }}>{item.category}</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(201,168,76,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    {editingId === item.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="number" 
                          step="0.01"
                          value={newPrice} 
                          onChange={(e) => setNewPrice(e.target.value)}
                          style={{ width: '65px', backgroundColor: '#171717', border: '1px solid #C9A84C', padding: '0.3rem', color: '#F0EAD6', fontSize: '0.8rem' }}
                        />
                        <button onClick={() => updatePrice(item.id)} style={{ backgroundColor: '#C9A84C', border: 'none', color: '#0C0C0C', fontSize: '0.65rem', padding: '0 0.5rem', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ backgroundColor: 'transparent', border: 'none', color: '#8A7E6A', fontSize: '0.65rem', cursor: 'pointer' }}>X</button>
                      </div>
                    ) : (
                      <div style={{ cursor: 'pointer' }} onClick={() => { setEditingId(item.id); setNewPrice(item.price); }}>
                        <span style={{ fontSize: '0.85rem', color: '#8A7E6A' }}>Price: </span>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', color: '#C9A84C' }}>£{Number(item.price).toFixed(2)} 📝</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => toggleAvailability(item.id, item.is_available)}
                    style={{ 
                      backgroundColor: item.is_available !== false ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: item.is_available !== false ? '1px solid #4ade80' : '1px solid #ef4444',
                      color: item.is_available !== false ? '#4ade80' : '#ef4444',
                      fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: 600
                    }}
                  >
                    {item.is_available !== false ? '● In Stock' : '○ Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
