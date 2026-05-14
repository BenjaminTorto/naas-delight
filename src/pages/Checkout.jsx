import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const KITCHEN_ADDRESS = "25 Grasmere Road, London SE25 4RF";
const WHATSAPP_NUMBER = "447833698693";

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceMethod, setServiceMethod] = useState('delivery');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    postcode: '',
    instructions: '',
  });

  const calculateFee = () => {
    if (serviceMethod === 'pickup') return 0;
    const pc = formData.postcode.toUpperCase().trim();
    if (!pc) return 3.50;
    if (pc.startsWith('SE25')) return 3.50;
    if (pc.startsWith('SE20') || pc.startsWith('SE27') || pc.startsWith('CR0')) return 5.50;
    return 8.50;
  };

  const deliveryFee = calculateFee();
  const finalTotal = cartTotal + deliveryFee;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppUrl = (orderId) => {
    let text = `*NEW ORDER — Naa's Delight*\n`;
    text += `*Order ID:* #${orderId}\n`;
    text += `*Method:* ${serviceMethod.toUpperCase()}\n\n`;
    text += `*Customer:* ${formData.name}\n`;
    text += `*Phone:* ${formData.phone}\n`;

    if (serviceMethod === 'delivery') {
      text += `*Address:* ${formData.address}, ${formData.postcode}\n`;
    } else {
      text += `*Pickup from:* ${KITCHEN_ADDRESS}\n`;
    }

    if (formData.instructions) {
      text += `*Notes:* ${formData.instructions}\n`;
    }

    text += `\n*Items:*\n`;
    text += cart.map(i => `- ${i.quantity}x ${i.name}`).join('\n');
    text += `\n\n*Subtotal:* £${cartTotal.toFixed(2)}`;
    text += `\n*${serviceMethod === 'pickup' ? 'Pickup' : 'Delivery'}:* ${deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}`;
    text += `\n*TOTAL: £${finalTotal.toFixed(2)}*`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);

    // 1. Generate a temporary ID and the WhatsApp link immediately
    const tempId = Math.random().toString(36).slice(2, 8).toUpperCase();
    const whatsappUrl = generateWhatsAppUrl(tempId);

    // 2. TRIGGER WHATSAPP IMMEDIATELY (Before the await)
    // This bypasses browser popup blockers which hate waiting for database calls
    window.open(whatsappUrl, '_blank');

    // 3. Silent background check to Supabase
    try {
      const { data, error } = await supabase.from('orders').insert([{
        customer_name: formData.name,
        customer_phone: formData.phone,
        delivery_address: serviceMethod === 'delivery' 
          ? `${formData.address}, ${formData.postcode}` 
          : 'PICKUP',
        items: cart,
        total_price: finalTotal,
        status: 'pending',
      }]).select();

      // Use the real DB ID if available, otherwise keep tempId
      const finalId = (!error && data?.[0]?.id) ? data[0].id.toString().slice(0, 6) : tempId;
      
      navigate(`/order-confirmation/${finalId}`);
    } catch (err) {
      console.warn("Supabase log skipped, continuing to confirmation.");
      navigate(`/order-confirmation/${tempId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#111',
    border: '1px solid #222',
    color: '#F0EAD6',
    padding: '1.2rem',
    borderRadius: '8px',
    width: '100%',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ backgroundColor: '#0C0C0C', color: '#F0EAD6', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 1.5rem' }}>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          Checkout
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {['delivery', 'pickup'].map(method => (
            <button
              key={method}
              type="button"
              onClick={() => setServiceMethod(method)}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                border: serviceMethod === method ? '1px solid #C9A84C' : '1px solid #222',
                backgroundColor: serviceMethod === method ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: serviceMethod === method ? '#C9A84C' : '#8A7E6A',
                textTransform: 'capitalize',
                fontSize: '1rem',
              }}
            >
              {method}
            </button>
          ))}
        </div>

        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #222' }}>
          {cart.length === 0 ? (
            <p style={{ color: '#8A7E6A', textAlign: 'center' }}>Your bag is empty.</p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: '#8A7E6A', fontSize: '0.9rem' }}>
                  <span>{item.quantity}x {item.name}</span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #222', marginTop: '1rem', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: '#8A7E6A' }}>
                  <span>Subtotal</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: '#8A7E6A' }}>
                  <span>{serviceMethod === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                  <span style={{ color: '#C9A84C' }}>{deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#C9A84C', fontSize: '1.5rem' }}>£{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input required name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} style={inputStyle} />
          <input required name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} style={inputStyle} />

          {serviceMethod === 'delivery' && (
            <>
              <input required name="postcode" placeholder="Postcode (e.g. SE25 4RF)" value={formData.postcode} onChange={handleInputChange} style={inputStyle} />
              <input required name="address" placeholder="Flat/House Number & Street" value={formData.address} onChange={handleInputChange} style={inputStyle} />
            </>
          )}

          {serviceMethod === 'pickup' && (
            <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px dashed #C9A84C', fontSize: '0.85rem' }}>
              <p style={{ color: '#C9A84C', marginBottom: '0.4rem' }}>Collection Address:</p>
              <p style={{ color: '#8A7E6A' }}>{KITCHEN_ADDRESS}</p>
            </div>
          )}

          <textarea
            name="instructions"
            placeholder="Special requests or dietary notes..."
            value={formData.instructions}
            onChange={handleInputChange}
            style={{ ...inputStyle, height: '90px', resize: 'none' }}
          />

          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            style={{
              backgroundColor: isSubmitting ? '#8A7E6A' : '#C9A84C',
              color: '#0C0C0C',
              padding: '1.2rem',
              fontWeight: '800',
              cursor: isSubmitting || cart.length === 0 ? 'not-allowed' : 'pointer',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              letterSpacing: '1px',
              marginTop: '1rem',
            }}
          >
            {isSubmitting ? 'OPENING WHATSAPP...' : `ORDER VIA WHATSAPP • £${finalTotal.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
