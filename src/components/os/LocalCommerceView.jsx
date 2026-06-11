import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

const CATEGORIES = [
  { id: 'interiors', label: 'Interior Design', icon: '🛋️' },
  { id: 'movers', label: 'Packers & Movers', icon: '🚚' },
  { id: 'electrician', label: 'Electricians', icon: '⚡' },
  { id: 'plumber', label: 'Plumbers', icon: '🚰' },
  { id: 'cleaning', label: 'Deep Cleaning', icon: '🧹' },
  { id: 'smarthome', label: 'Smart Home', icon: '🔒' },
];

const PROVIDERS = {
  interiors: [
    { name: 'Livspace Studio', rating: 4.8, jobs: 340, price: 'From ₹1.5L', verified: true, eta: '2-3 months' },
    { name: 'Bonito Designs', rating: 4.6, jobs: 210, price: 'From ₹2L', verified: true, eta: '3 months' },
  ],
  movers: [
    { name: 'Agarwal Packers', rating: 4.7, jobs: 1200, price: 'From ₹8,000', verified: true, eta: 'Same day' },
    { name: 'Leo Packers', rating: 4.4, jobs: 560, price: 'From ₹6,500', verified: true, eta: '1 day' },
  ],
  electrician: [
    { name: 'Urban Company Elec', rating: 4.6, jobs: 890, price: '₹299/visit', verified: true, eta: '2 hours' },
    { name: 'QuickFix Electric', rating: 4.3, jobs: 320, price: '₹250/visit', verified: false, eta: '4 hours' },
  ],
  plumber: [
    { name: 'Urban Company Plumb', rating: 4.7, jobs: 760, price: '₹199/visit', verified: true, eta: '2 hours' },
  ],
  cleaning: [
    { name: 'BroomBerg Deep Clean', rating: 4.8, jobs: 450, price: '₹2,500', verified: true, eta: '1 day' },
  ],
  smarthome: [
    { name: 'Hogar Smart Controls', rating: 4.5, jobs: 180, price: 'From ₹15,000', verified: true, eta: '3 days' },
  ],
};

export default function LocalCommerceView() {
  const toast = useToast();
  const [active, setActive] = useState('interiors');
  const [bookModal, setBookModal] = useState(null);
  const [date, setDate] = useState('');

  const confirmBook = () => {
    if (!date) { toast('Pick a date', 'warning'); return; }
    toast(`${bookModal.name} booked for ${date} — confirmation sent`, 'success', 5000);
    setBookModal(null);
    setDate('');
  };

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">🛒</div>
        <div><h1>Local Commerce</h1><p>Interiors, movers, contractors, electricians & home services marketplace</p></div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="commerce-cats">
        {CATEGORIES.map(c => (
          <button key={c.id} className={`commerce-cat ${active === c.id ? 'active' : ''}`} onClick={() => setActive(c.id)}>
            <span className="cc-icon">{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(PROVIDERS[active] || []).map((p, i) => (
          <div key={i} className="commerce-provider-card">
            <div className="cpc-avatar">{p.name[0]}</div>
            <div className="cpc-body">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <h4>{p.name}</h4>
                {p.verified && <span className="trust-pill green small">✓ Verified</span>}
              </div>
              <p>⭐ {p.rating} · {p.jobs} jobs done · ETA: {p.eta}</p>
            </div>
            <div className="cpc-price">{p.price}</div>
            <button className="os-btn-primary" onClick={() => setBookModal(p)}>Book Now</button>
          </div>
        ))}
      </div>

      {bookModal && (
        <div className="os-modal-backdrop" onClick={() => setBookModal(null)}>
          <div className="os-modal" onClick={e => e.stopPropagation()}>
            <div className="os-modal-header"><h3>Book — {bookModal.name}</h3><button onClick={() => setBookModal(null)}>✕</button></div>
            <div className="os-modal-body">
              <p style={{ color: 'var(--os-muted)', margin: 0 }}>⭐ {bookModal.rating} · {bookModal.price} · ETA {bookModal.eta}</p>
              <div><label>Preferred Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} /></div>
              <div><label>Service Address</label><input placeholder="Flat 1204, DLF Privana, Sector 77" /></div>
              <div><label>Notes (optional)</label><textarea placeholder="Describe what you need…" /></div>
            </div>
            <div className="os-modal-footer">
              <button className="os-btn-outline" onClick={() => setBookModal(null)}>Cancel</button>
              <button className="os-btn-primary" onClick={confirmBook}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
