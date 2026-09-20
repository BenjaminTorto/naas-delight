import { useEffect, useState } from 'react';
import { getKitchenStatus } from '../../lib/kitchenHours';

const KitchenStatusBadge = ({ className = '' }) => {
  const [status, setStatus] = useState(() => getKitchenStatus());

  useEffect(() => {
    const id = setInterval(() => setStatus(getKitchenStatus()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 border border-gold/15 rounded-full px-3 py-1.5 ${className}`}
      aria-live="polite"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.isOpen ? 'bg-green-400' : 'bg-red-400/70'}`}
        style={status.isOpen ? { boxShadow: '0 0 6px 1px rgba(74,222,128,0.6)' } : {}}
      />
      <span className="text-[10px] tracking-widest uppercase text-[var(--cream-80)] whitespace-nowrap">
        Kitchen {status.isOpen ? 'Open' : 'Closed'}
        <span className="text-gold normal-case tracking-normal"> · {status.label}</span>
      </span>
    </div>
  );
};

export default KitchenStatusBadge;
