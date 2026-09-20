import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import KenteAccent from '../components/ui/KenteAccent';
import {
  formatDateLabel,
  formatTimeLabel,
  parseDateInputValue,
  isKitchenClosedOn,
  getLondonTodayDateOnly,
  toISODateString,
  KITCHEN_OPEN_HOUR,
  KITCHEN_CLOSE_HOUR,
} from '../lib/kitchenHours';

const WHATSAPP_NUMBER = "447833698693";
const MIN_LEAD_DAYS = 2;   // events need advance notice to prep
const MAX_LEAD_DAYS = 90;  // roughly 3 months out

const EVENT_TYPES = ['Birthday', 'Family Gathering', 'Corporate Event', 'Wedding / Celebration', 'Other'];

const Events = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: EVENT_TYPES[0],
    guestCount: '',
    menuRequests: '',
    notes: '',
  });
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [error, setError] = useState('');

  const today = getLondonTodayDateOnly();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + MIN_LEAD_DAYS);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + MAX_LEAD_DAYS);
  const minDateStr = toISODateString(minDate);
  const maxDateStr = toISODateString(maxDate);

  useEffect(() => {
    if (!dateStr || !timeStr) { setError(''); return; }
    const picked = parseDateInputValue(dateStr);

    if (picked < minDate) {
      setError(`Please choose a date at least ${MIN_LEAD_DAYS} days from today, so we have time to prepare.`);
      return;
    }
    if (picked > maxDate) {
      setError('Please choose a date within the next 3 months.');
      return;
    }
    if (isKitchenClosedOn(picked)) {
      setError("We're closed Mondays — please pick another day.");
      return;
    }
    const [h, m] = timeStr.split(':').map(Number);
    const minutes = h * 60 + m;
    if (minutes < KITCHEN_OPEN_HOUR * 60 || minutes > KITCHEN_CLOSE_HOUR * 60) {
      setError(`Please choose a time between ${KITCHEN_OPEN_HOUR % 12 || 12}PM and ${KITCHEN_CLOSE_HOUR - 12}PM.`);
      return;
    }
    setError('');
  }, [dateStr, timeStr]);

  const isIncomplete = !formData.name || !formData.phone || !formData.guestCount
    || !dateStr || !timeStr || !!error;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestedTimeLabel = dateStr && timeStr && !error
    ? `${formatDateLabel(parseDateInputValue(dateStr))} · ${formatTimeLabel(timeStr)}`
    : '';

  const buildWhatsAppUrl = (refId) => {
    let text = `*EVENT BOOKING REQUEST — Naa's Delight*\n`;
    text += `*Reference:* #${refId}\n\n`;
    text += `*Name:* ${formData.name}\n`;
    text += `*WhatsApp:* ${formData.phone}\n`;
    text += `*Event Type:* ${formData.eventType}\n`;
    text += `*Guests:* ${formData.guestCount}\n`;
    text += `*Requested Date/Time:* ${requestedTimeLabel}\n`;
    if (formData.menuRequests) text += `*Menu Requests:* ${formData.menuRequests}\n`;
    if (formData.notes) text += `*Notes:* ${formData.notes}\n`;
    text += `\nPlease confirm availability for this event.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isIncomplete) return;
    setIsSubmitting(true);

    const refId = Math.random().toString(36).slice(2, 8).toUpperCase();
    window.open(buildWhatsAppUrl(refId), '_blank');

    // Reuses the existing `orders` table (rather than a new table this
    // environment has no access to create) so the request also shows up
    // in the Admin dashboard immediately, alongside regular food orders.
    try {
      await supabase.from('orders').insert([{
        customer_name: formData.name,
        customer_phone: formData.phone,
        delivery_address: 'EVENT BOOKING',
        items: [{
          name: `Event: ${formData.eventType}`,
          quantity: Number(formData.guestCount) || 1,
          price: 0,
          menu_requests: formData.menuRequests,
          notes: formData.notes,
        }],
        total_price: 0,
        status: 'pending',
        scheduled_for: requestedTimeLabel,
      }]);
    } catch (err) {
      console.warn('Event booking WhatsApp sent; admin-dashboard log skipped.', err);
    } finally {
      setIsSubmitting(false);
      navigate('/');
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--cream)',
    padding: '1.1rem',
    borderRadius: '8px',
    width: '100%',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '0.5rem',
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--cream)', minHeight: '100vh', paddingTop: 'clamp(100px, 15vw, 130px)', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 2rem)' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <KenteAccent width={32} />
          </div>
          <h1 style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1rem' }}>
            Book For Your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Special Event</em>
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: '460px', margin: '0 auto' }}>
            Planning a party, family gathering, or corporate lunch? Reserve fresh Ghanaian food in advance and we'll confirm availability with you on WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Your Full Name</label>
              <input required name="name" placeholder="e.g. Kofi Mensah" value={formData.name} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>WhatsApp Phone Number</label>
              <input required name="phone" type="tel" placeholder="e.g. 07123 456789" value={formData.phone} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Event Type</label>
              <select name="eventType" value={formData.eventType} onChange={handleChange} style={inputStyle}>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Estimated Guests</label>
              <input required name="guestCount" type="number" min="1" placeholder="e.g. 20" value={formData.guestCount} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Event Date</label>
              <input
                required
                type="date"
                value={dateStr}
                min={minDateStr}
                max={maxDateStr}
                onChange={(e) => setDateStr(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Delivery / Pickup Time</label>
              <input
                required
                type="time"
                value={timeStr}
                min="12:00"
                max="21:00"
                onChange={(e) => setTimeStr(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {error && <p style={{ fontSize: '0.8rem', color: '#E0A0A0', margin: 0 }}>{error}</p>}
          {!error && requestedTimeLabel && (
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>
              Requested for <span style={{ color: 'var(--gold)' }}>{requestedTimeLabel}</span>
            </p>
          )}
          <p style={{ fontSize: '0.7rem', color: 'var(--muted-2)', margin: 0 }}>
            Please book at least {MIN_LEAD_DAYS} days ahead. We're open Tue–Sun, 12PM–9PM, closed Mondays.
          </p>

          <div>
            <label style={labelStyle}>Menu Requests (optional)</label>
            <textarea
              name="menuRequests"
              placeholder="e.g. Jollof rice for 20, grilled chicken, kelewele..."
              value={formData.menuRequests}
              onChange={handleChange}
              style={{ ...inputStyle, height: '80px', resize: 'none' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Special Notes / Instructions</label>
            <textarea
              name="notes"
              placeholder="Any dietary requirements, delivery location, or other details..."
              value={formData.notes}
              onChange={handleChange}
              style={{ ...inputStyle, height: '90px', resize: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isIncomplete}
            style={{
              backgroundColor: (isSubmitting || isIncomplete) ? 'var(--muted)' : 'var(--gold)',
              color: 'var(--bg-page)',
              padding: '1.2rem',
              fontWeight: 800,
              cursor: (isSubmitting || isIncomplete) ? 'not-allowed' : 'pointer',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              letterSpacing: '1px',
              marginTop: '0.5rem',
            }}
          >
            {isSubmitting ? 'OPENING WHATSAPP...' : 'CONFIRM EVENT RESERVATION'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Events;
