const STEPS = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready for Pickup' },
  { key: 'completed', label: 'Picked Up' },
];

// Mirrors the exact status values set from the admin dashboard.
const STATUS_INDEX = { Pending: 0, Preparing: 1, Ready: 2, Completed: 3 };

const OrderTracker = ({ status }) => {
  if (status === 'Cancelled') {
    return (
      <div style={{ border: '1px solid #8A2E2E', backgroundColor: 'rgba(138,46,46,0.08)', padding: '1.25rem', textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#E0A0A0', fontWeight: 700, letterSpacing: '0.03em', fontFamily: 'Archivo, sans-serif' }}>This order was cancelled</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>If you think this is a mistake, please get in touch.</p>
      </div>
    );
  }

  const currentIndex = STATUS_INDEX[status] ?? 0;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? '0 0 auto' : 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '58px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: done ? 'var(--gold)' : 'var(--border-grid)',
                    border: done ? '1px solid var(--gold)' : '1px solid var(--border-subtle-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}
                >
                  {done ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--bg-page)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--muted-2)' }} />
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.58rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: done ? 'var(--cream)' : 'var(--muted-2)',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: i < currentIndex ? 'var(--gold)' : 'var(--border-grid)',
                    margin: '11px 4px 0',
                    transition: 'background-color 0.4s ease',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
