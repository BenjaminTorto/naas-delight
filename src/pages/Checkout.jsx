import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const KITCHEN_ADDRESS = "25 Grasmere Road, London SE25 4RF";

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceMethod, setServiceMethod] = useState('delivery');
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', postcode: '', instructions: ''
  });

  // DELIVERY FEE LOGIC BASED ON LONDON POSTCODES
  const calculateFee = () => {
    if (serviceMethod === 'pickup') return 0;
    
    const pc = formData.postcode.toUpperCase().trim();
    if (!pc) return 3.50; // Default

    if (pc.startsWith('SE25')) return 3.50; // Local (South Norwood)
    if (pc.startsWith('SE20') || pc.startsWith('SE27') || pc.startsWith('CR0')) return 5.50; // Nearby
    return 8.50; // Wider South London
  };

  const deliveryFee = calculateFee();
  const finalTotal = cartTotal + deliveryFee;
  const WHATSAPP_NUMBER = "447833698693";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppUrl = (orderId) => {
    let text = `*NEW ORDER: Naa's Delight*\nID: #${orderId}\n`;
    text += `*Method:* ${serviceMethod.toUpperCase()}\n\n`;
    text += `*Customer:* ${formData.name}\n*Phone:* ${formData.phone}\n`;
    
    if (serviceMethod === 'delivery') {
      text += `*Address:* ${formData.address}, ${formData.postcode}\n`;
    } else {
      text += `*Pickup from:* ${KITCHEN_ADDRESS}\n`;
    }

    text += `\n*Items:*\n` + cart.map(i => `- ${i.quantity}x ${i.name}`).join('\n');
    text += `\n\n*Subtotal:* £${cartTotal.toFixed(2)}\n`;
    text += `*Delivery:* £${deliveryFee.toFixed(2)}\n`;
    text += `*TOTAL: £${finalTotal.toFixed(2)}*`;
    
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('orders').insert([{
        customer_name: formData.name,
        customer_phone: formData.phone,
        delivery_address: serviceMethod === 'delivery' ? `${formData.address}, ${formData.postcode}` : 'PICKUP',
        items: cart,
        total_price: finalTotal,
        status: 'pending'
      }]).select();
      
      if (error) throw error;
      window.open(generateWhatsAppUrl(data[0].id.toString().slice(0,6)), '_blank');
      navigate(`/order-confirmation/${data[0].id}`);
    } catch (err) {
      alert("Checkout failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { backgroundColor: '#111', border: '1px solid #222', color: '#F0EAD6', padding: '1.2rem', borderRadius: '8px', width: '100%' };

  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Checkout</h1>

        {/* Method Selector */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {['delivery', 'pickup'].map(method => (
            <button 
              key={method}
              onClick={() => setServiceMethod(method)}
              style={{ 
                flex: 1, padding: '1rem', borderRadius: '8px', cursor: 'pointer', 
                border: serviceMethod === method ? '1px solid #C9A84C' : '1px solid #222', 
                backgroundColor: serviceMethod === method ? 'rgba(201,168,76,0.1)' : 'transparent', 
                color: serviceMethod === method ? '#C9A84C' : '#8A7E6A',
                textTransform: 'capitalize'
              }}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Summary Card */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#8A7E6A' }}>
            <span>Subtotal</span>
            <span>£{cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#8A7E6A' }}>
            <span>{serviceMethod === 'pickup' ? 'Pickup' : 'Delivery'}</span>
            <span style={{color: '#C9A84C'}}>{deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}</span>
          </div>
          <div style={{ borderTop: '1px solid #222', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Total</span>
            <span style={{ color: '#C9A84C', fontSize: '1.5rem' }}>£{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input required name="name" placeholder="Full Name" onChange={handleInputChange} style={inputStyle} />
          <input required name="phone" type="tel" placeholder="Phone Number" onChange={handleInputChange} style={inputStyle} />
          
          {serviceMethod === 'delivery' && (
            <>
              <input required name="postcode" placeholder="Postcode (e.g. SE25 4RF)" onChange={handleInputChange} style={inputStyle} />
              <input required name="address" placeholder="Flat/House Number & Street" onChange={handleInputChange} style={inputStyle} />
            </>
          )}

          {serviceMethod === 'pickup' && (
            <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px dashed #C9A84C', fontSize: '0.8rem' }}>
              <p style={{ color: '#C9A84C', marginBottom: '0.4rem' }}>Collection Address:</p>
              <p style={{ color: '#8A7E6A' }}>{KITCHEN_ADDRESS}</p>
            </div>
          )}

          <textarea name="instructions" placeholder="Special requests..." onChange={handleInputChange} style={{ ...inputStyle, height: '80px', resize: 'none' }} />
          
          <button type="submit" disabled={isSubmitting} style={{ 
            backgroundColor: '#C9A84C', color: '#0C0C0C', padding: '1.2rem', 
            fontWeight: '800', cursor: 'pointer', border: 'none', borderRadius: '8px',
            fontSize: '1rem', letterSpacing: '1px', marginTop: '1rem'
          }}>
            {isSubmitting ? 'PROCESSING...' : `ORDER VIA WHATSAPP • £${finalTotal.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
