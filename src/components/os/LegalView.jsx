import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

const LAWYERS = [
  { name: 'Adv. Priya Khanna', spec: 'Property Law', city: 'Gurgaon', exp: 14, rating: 4.9, fee: 25000, verified: true },
  { name: 'Adv. Rajesh Sood', spec: 'RERA Disputes', city: 'Delhi', exp: 22, rating: 4.8, fee: 40000, verified: true },
  { name: 'Adv. Meera Iyer', spec: 'Registry & Deeds', city: 'Noida', exp: 9, rating: 4.7, fee: 15000, verified: true },
  { name: 'Adv. Suresh Kumar', spec: 'NRI Property', city: 'Mumbai', exp: 18, rating: 4.6, fee: 35000, verified: true },
];

const DUE_DILIGENCE = [
  { check: 'Title Search (30 years)', status: 'done', note: 'Clear title — no disputes found' },
  { check: 'Encumbrance Certificate', status: 'done', note: 'Property free from all encumbrances' },
  { check: 'RERA Compliance', status: 'done', note: 'Registered: HR/RERA/GUR/2025/301' },
  { check: 'Land Use Verification', status: 'done', note: 'Residential — confirmed with DGTCP' },
  { check: 'Builder Litigation Check', status: 'pending', note: 'Court records verification in progress' },
  { check: 'Property Tax Clearance', status: 'pending', note: 'Awaiting MCG records' },
  { check: 'NOC from Society', status: 'na', note: 'Not applicable — under construction' },
  { check: 'Mutation Verification', status: 'pending', note: 'Revenue records check pending' },
];

const DOCS = [
  { name: 'Sale Agreement (Draft)', status: 'ready', type: 'Sale' },
  { name: 'Allotment Letter', status: 'ready', type: 'Builder' },
  { name: 'Construction Linked Plan Agreement', status: 'ready', type: 'CLP' },
  { name: 'Power of Attorney (NRI)', status: 'draft', type: 'POA' },
  { name: 'Rental Agreement', status: 'draft', type: 'Rent' },
  { name: 'Leave & License Agreement', status: 'draft', type: 'LnL' },
];

export default function LegalView() {
  const toast = useToast();
  const [tab, setTab] = useState('diligence');
  const [checks, setChecks] = useState(DUE_DILIGENCE);
  const [bookingLawyer, setBookingLawyer] = useState(null);
  const [bookingDate, setBookingDate] = useState('');

  const runCheck = (idx) => {
    if (checks[idx].status !== 'pending') return;
    toast(`Running ${checks[idx].check}…`, 'info');
    setTimeout(() => {
      setChecks(prev => prev.map((c, i) => i === idx ? { ...c, status: 'done', note: 'Verified successfully' } : c));
      toast(`${checks[idx].check} — Verified ✓`, 'success');
    }, 2000);
  };

  const confirmBooking = () => {
    if (!bookingDate) { toast('Please select a date', 'warning'); return; }
    toast(`Consultation booked with ${bookingLawyer.name} on ${bookingDate}`, 'success');
    setBookingLawyer(null);
    setBookingDate('');
  };

  const done = checks.filter(d => d.status === 'done').length;

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">⚖️</div>
        <div><h1>Legal Layer</h1><p>Registry, agreements, due diligence & lawyer marketplace</p></div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="os-tabs">
        {['diligence', 'documents', 'lawyers'].map(t => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'diligence' && `🔍 Due Diligence (${done}/${checks.length})`}
            {t === 'documents' && '📄 Agreements'}
            {t === 'lawyers' && '👨‍⚖️ Lawyers'}
          </button>
        ))}
      </div>

      {tab === 'diligence' && (
        <div className="legal-dd">
          <div className="legal-dd-progress">
            <div className="lddp-bar"><div className="lddp-fill" style={{ width: `${(done / checks.length) * 100}%` }} /></div>
            <span>{done}/{checks.length} checks complete · Legal risk: {done >= 6 ? 'Low' : done >= 4 ? 'Medium' : 'High'}</span>
          </div>
          {checks.map((d, i) => (
            <div key={i} className={`legal-check-row ${d.status}`}>
              <span className="lcr-icon">{d.status === 'done' ? '✅' : d.status === 'pending' ? '⏳' : '➖'}</span>
              <div className="lcr-body"><h4>{d.check}</h4><p>{d.note}</p></div>
              <span className={`lcr-badge ${d.status}`}>{d.status === 'done' ? 'Verified' : d.status === 'pending' ? 'In Progress' : 'N/A'}</span>
              {d.status === 'pending' && (
                <button className="os-btn-primary small" onClick={() => runCheck(i)}>Run Check</button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'documents' && (
        <div className="legal-docs">
          <p className="legal-docs-desc">AI-generated legal documents, reviewed and signed digitally.</p>
          {DOCS.map((doc, i) => (
            <div key={i} className="legal-doc-row">
              <span>📄</span>
              <div className="ldr-body"><h4>{doc.name}</h4><span className="ldr-type">{doc.type}</span></div>
              <span className={`ldr-status ${doc.status}`}>{doc.status === 'ready' ? '✓ Ready' : '✏️ Draft'}</span>
              <div className="ldr-actions">
                <button className="os-btn-outline small" onClick={() => toast(`Previewing ${doc.name}`, 'info')}>Preview</button>
                <button className="os-btn-primary small" onClick={() => toast(`${doc.name} downloaded`, 'success')}>Download</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'lawyers' && (
        <div className="legal-lawyers">
          {LAWYERS.map((l, i) => (
            <div key={i} className="legal-lawyer-card">
              <div className="llc-avatar">{l.name.split(' ').slice(1).map(n => n[0]).join('')}</div>
              <div className="llc-body">
                <h4>{l.name}</h4>
                <p>{l.spec} · {l.city} · {l.exp} years exp</p>
                <div className="llc-meta">
                  <span>⭐ {l.rating}</span>
                  <span>₹{l.fee.toLocaleString()} flat fee</span>
                  {l.verified && <span className="trust-pill green small">✓ Verified</span>}
                </div>
              </div>
              <div className="llc-actions">
                <button className="os-btn-primary" onClick={() => setBookingLawyer(l)}>Book Consultation</button>
                <button className="os-btn-outline" onClick={() => toast(`Viewing ${l.name}'s full profile`, 'info')}>View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookingLawyer && (
        <div className="os-modal-backdrop" onClick={() => setBookingLawyer(null)}>
          <div className="os-modal" onClick={e => e.stopPropagation()}>
            <div className="os-modal-header">
              <h3>Book Consultation — {bookingLawyer.name}</h3>
              <button onClick={() => setBookingLawyer(null)}>✕</button>
            </div>
            <div className="os-modal-body">
              <p style={{ color: 'var(--os-muted)', margin: 0 }}>{bookingLawyer.spec} · {bookingLawyer.city} · ₹{bookingLawyer.fee.toLocaleString()}</p>
              <div><label>Preferred Date</label><input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} /></div>
              <div><label>Time Slot</label>
                <select><option>10:00 AM</option><option>12:00 PM</option><option>2:00 PM</option><option>4:00 PM</option></select>
              </div>
              <div><label>Property Address (optional)</label><input placeholder="Sector 77, Gurgaon" /></div>
              <div><label>Query Summary</label><textarea placeholder="Briefly describe what legal help you need…" /></div>
            </div>
            <div className="os-modal-footer">
              <button className="os-btn-outline" onClick={() => setBookingLawyer(null)}>Cancel</button>
              <button className="os-btn-primary" onClick={confirmBooking}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
