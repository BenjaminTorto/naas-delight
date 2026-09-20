import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  formatDateLabel,
  formatTimeLabel,
  getSchedulableDateRange,
  parseDateInputValue,
  isKitchenClosedOn,
  getLondonTodayDateOnly,
  getLondonNowMinutes,
  KITCHEN_OPEN_HOUR,
  KITCHEN_CLOSE_HOUR,
} from '../lib/kitchenHours';

// 1. PUBLIC display (No house number)
const PUBLIC_LOCATION = "Grasmere Road, London SE25 (Full address sent on WhatsApp)";

// 2. PRIVATE location (Full address for the message)
const PRIVATE_LOCATION = import.meta.env.VITE_KITCHEN_ADDRESS || "25 Grasmere Road, London SE25 4RF";

const WHATSAPP_NUMBER = "447833698693";

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceMethod, setServiceMethod] = useState('delivery');
  const [timing, setTiming] = useState('asap'); // 'asap' | 'schedule'
  const [schedDateStr, setSchedDateStr] = useState('');
  const [schedTimeStr, setSchedTimeStr] = useState('');
  const [scheduleError, setScheduleError] = useState('');

  const dateRange = getSchedulableDateRange();

  useEffect(() => {
    if (timing !== 'schedule' || !schedDateStr || !schedTimeStr) {
      setScheduleError('');
      return;
    }
    const picked = parseDateInputValue(schedDateStr);
    const today = getLondonTodayDateOnly();
    const maxDate = parseDateInputValue(dateRange.max);

    if (picked < today) { setScheduleError('Please choose a date from today onward.'); return; }
    if (picked > maxDate) { setScheduleError('We can only schedule up to two weeks ahead.'); return; }
    if (isKitchenClosedOn(picked)) { setScheduleError("We're closed Mondays — please pick another day."); return; }

    const [h, m] = schedTimeStr.split(':').map(Number);
    const pickedMinutes = h * 60 + m;
    if (pickedMinutes < KITCHEN_OPEN_HOUR * 60 || pickedMinutes > KITCHEN_CLOSE_HOUR * 60) {
      setScheduleError(`Please choose a time between ${KITCHEN_OPEN_HOUR % 12 || 12}PM and ${KITCHEN_CLOSE_HOUR - 12}PM.`);
      return;
    }

    const isToday = picked.getTime() === today.getTime();
    if (isToday && pickedMinutes < getLondonNowMinutes() + 45) {
      setScheduleError('Please choose a time at least 45 minutes from now.');
      return;
    }

    setScheduleError('');
  }, [timing, schedDateStr, schedTimeStr]);

  const requestedTimeLabel = timing === 'schedule' && schedDateStr && schedTimeStr && !scheduleError
    ? `${formatDateLabel(parseDateInputValue(schedDateStr))} · ${formatTimeLabel(schedTimeStr)}`
    : 'ASAP';

  const isScheduleIncomplete = timing === 'schedule' && (!schedDateStr || !schedTimeStr || !!scheduleError);

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

  const generateWhatsAppUrl = (displayId, trackingLink) => {
    let text = `*NEW ORDER — Naa's Delight*\n`;
    text += `*Order ID:* #${displayId}\n`;
    text += `*Method:* ${serviceMethod.toUpperCase()}\n`;
    text += `*Requested Time:* ${requestedTimeLabel}\n\n`;
    text += `*Customer:* ${formData.name}\n`;
    text += `*Phone:* ${formData.phone}\n`;

    if (serviceMethod === 'delivery') {
      text += `*Address:* ${formData.address}, ${formData.postcode}\n`;
    } else {
      // Reveal the REAL address only in the WhatsApp message
      text += `*Pickup from:* ${PRIVATE_LOCATION}\n`;
    }

    if (formData.instructions) {
      text += `*Notes:* ${formData.instructions}\n`;
    }

    text += `\n*Items:*\n`;
    text += cart.map(i => `- ${i.quantity}x ${i.name}`).join('\n');
    text += `\n\n*Subtotal:* £${cartTotal.toFixed(2)}`;
    text += `\n*${serviceMethod === 'pickup' ? 'Pickup' : 'Delivery'}:* ${deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}`;
    text += `\n*TOTAL: £${finalTotal.toFixed(2)}*`;
    if (trackingLink) {
      text += `\n\n*Track your order:* ${trackingLink}`;
    }

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (isScheduleIncomplete) return;
    setIsSubmitting(true);

    const tempId = Math.random().toString(36).slice(2, 8).toUpperCase();
    let finalId = tempId;

    try {
      const basePayload = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        delivery_address: serviceMethod === 'delivery' 
          ? `${formData.address}, ${formData.postcode}` 
          : 'PICKUP',
        items: cart,
        total_price: finalTotal,
        status: 'pending',
      };

      let { data, error } = await supabase
        .from('orders')
        .insert([{ ...basePayload, scheduled_for: requestedTimeLabel }])
        .select();

      // If the `scheduled_for` column hasn't been added to the orders
      // table yet, retry without it so the order still saves correctly
      // rather than being lost entirely.
      if (error) {
        console.warn("Retrying order insert without scheduled_for (column may not exist yet):", error.message);
        const retry = await supabase.from('orders').insert([basePayload]).select();
        data = retry.data;
        error = retry.error;
      }

      // Use the REAL database id (not a truncated version) so the
      // tracking link and this order's Supabase row always match —
      // previously the WhatsApp message and the tracking URL could end
      // up with two different, disconnected IDs.
      if (!error && data?.[0]?.id) {
        finalId = data[0].id;
      }
    } catch (err) {
      console.warn("Supabase save failed, falling back to WhatsApp-only order.", err);
    }

    const displayId = finalId.toString().slice(0, 6).toUpperCase();
    const trackingLink = `${window.location.origin}/order-confirmation/${finalId}`;
    const whatsappUrl = generateWhatsAppUrl(displayId, trackingLink);

    window.open(whatsappUrl, '_blank');
    navigate(`/order-confirmation/${finalId}`);
    setIsSubmitting(false);
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--cream)',
    padding: '1.2rem',
    borderRadius: '8px',
    width: '100%',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--cream)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 1.5rem' }}>

        <h1 style={{ fontFamily: 'Archivo, sans-serif', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
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
                border: serviceMethod === method ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
                backgroundColor: serviceMethod === method ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: serviceMethod === method ? 'var(--gold)' : 'var(--muted)',
                textTransform: 'capitalize',
                fontSize: '1rem',
              }}
            >
              {method}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
          {[
            { key: 'asap', label: 'ASAP' },
            { key: 'schedule', label: 'Schedule for later' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTiming(key)}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                border: timing === key ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
                backgroundColor: timing === key ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: timing === key ? 'var(--gold)' : 'var(--muted)',
                fontSize: '0.95rem',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {timing === 'schedule' && (
          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={schedDateStr}
                  min={dateRange.min}
                  max={dateRange.max}
                  onChange={(e) => setSchedDateStr(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                  Time
                </label>
                <input
                  type="time"
                  value={schedTimeStr}
                  min="12:00"
                  max="21:00"
                  onChange={(e) => setSchedTimeStr(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {scheduleError && (
              <p style={{ fontSize: '0.8rem', color: '#E0A0A0' }}>{scheduleError}</p>
            )}
            {!scheduleError && schedDateStr && schedTimeStr && (
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                Requested for <span style={{ color: 'var(--gold)' }}>{requestedTimeLabel}</span>
              </p>
            )}
            <p style={{ fontSize: '0.7rem', color: 'var(--muted-2)' }}>
              We're open Tue–Sun, 12PM–9PM. Closed Mondays.
            </p>
          </div>
        )}

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border-subtle)' }}>
          {cart.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Your bag is empty.</p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
                  <span>{item.quantity}x {item.name}</span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1rem', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: 'var(--muted)' }}>
                  <span>Subtotal</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: 'var(--muted)' }}>
                  <span>{serviceMethod === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                  <span style={{ color: 'var(--gold)' }}>{deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>£{finalTotal.toFixed(2)}</span>
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
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-alt)', borderRadius: '8px', border: '1px dashed var(--gold)', fontSize: '0.85rem' }}>
              <p style={{ color: 'var(--gold)', marginBottom: '0.4rem' }}>Collection Area:</p>
              <p style={{ color: 'var(--muted)' }}>{PUBLIC_LOCATION}</p>
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
            disabled={isSubmitting || cart.length === 0 || isScheduleIncomplete}
            style={{
              backgroundColor: (isSubmitting || isScheduleIncomplete) ? 'var(--muted)' : 'var(--gold)',
              color: 'var(--bg-page)',
              padding: '1.2rem',
              fontWeight: '800',
              cursor: (isSubmitting || cart.length === 0 || isScheduleIncomplete) ? 'not-allowed' : 'pointer',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              letterSpacing: '1px',
              marginTop: '1rem',
            }}
          >
            {isSubmitting
              ? 'OPENING WHATSAPP...'
              : isScheduleIncomplete
                ? 'PICK A DATE & TIME'
                : `ORDER VIA WHATSAPP • £${finalTotal.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
