import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

const INIT_REQUESTS = [
  { id: 1, title: 'Leaking kitchen tap', category: 'Plumbing', status: 'In Progress', date: '2026-06-08', priority: 'High' },
  { id: 2, title: 'AC not cooling — Bedroom 2', category: 'Electrical', status: 'Open', date: '2026-06-09', priority: 'Medium' },
  { id: 3, title: 'Repaint living room wall', category: 'Painting', status: 'Resolved', date: '2026-05-28', priority: 'Low' },
];

const LANDLORD_UNITS = [
  { unit: 'Flat 1204, DLF Privana', tenant: 'Arjun Sharma', rent: 85000, status: 'Occupied', due: '2026-07-01', paid: true },
  { unit: 'Flat 802, Godrej Aristocrat', tenant: 'Meera Joshi', rent: 62000, status: 'Occupied', due: '2026-07-01', paid: false },
  { unit: 'Villa 12, Sohna Road', tenant: '— Vacant —', rent: 120000, status: 'Vacant', due: '—', paid: false },
];

export default function RentalView() {
  const toast = useToast();
  const [mode, setMode] = useState('tenant');
  const [tab, setTab] = useState('rent');
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [rentPaid, setRentPaid] = useState(false);
  const [newReq, setNewReq] = useState(null);
  const [reqForm, setReqForm] = useState({ title: '', category: 'Plumbing', priority: 'Medium' });

  const payRent = () => { setRentPaid(true); toast('Rent of ₹85,000 paid successfully — receipt sent to email', 'success', 5000); };

  const submitRequest = () => {
    if (!reqForm.title) { toast('Describe the issue', 'warning'); return; }
    setRequests(prev => [{ id: Date.now(), ...reqForm, status: 'Open', date: new Date().toISOString().slice(0, 10) }, ...prev]);
    toast('Maintenance request submitted', 'success');
    setNewReq(null);
    setReqForm({ title: '', category: 'Plumbing', priority: 'Medium' });
  };

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">🏘️</div>
        <div><h1>Rental Ecosystem</h1><p>Tenant app, rent collection, maintenance & landlord-tenant communication</p></div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="rental-mode-toggle">
        <button className={mode === 'tenant' ? 'active' : ''} onClick={() => { setMode('tenant'); setTab('rent'); }}>👤 Tenant View</button>
        <button className={mode === 'landlord' ? 'active' : ''} onClick={() => { setMode('landlord'); setTab('units'); }}>🏠 Landlord View</button>
      </div>

      {mode === 'tenant' && (
        <>
          <div className="os-tabs">
            {[['rent', '💳 Rent'], ['maintenance', '🔧 Maintenance'], ['lease', '📋 Lease'], ['messages', '💬 Messages']].map(([t, l]) => (
              <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>

          {tab === 'rent' && (
            <div className="rental-rent-panel">
              <div className={`rental-rent-card ${rentPaid ? 'paid' : ''}`}>
                <div className="rrc-head"><span>Monthly Rent — July 2026</span>{rentPaid ? <span className="trust-pill green">✓ Paid</span> : <span className="trust-pill red">Due Jul 1</span>}</div>
                <div className="rrc-amount">₹85,000</div>
                <p className="rrc-unit">Flat 1204, DLF Privana South · Landlord: Rajiv Mehta</p>
                {!rentPaid ? <button className="os-btn-primary" style={{ width: '100%' }} onClick={payRent}>Pay Rent via UPI</button>
                  : <button className="os-btn-outline" style={{ width: '100%' }} onClick={() => toast('Receipt downloaded', 'success')}>Download Receipt</button>}
              </div>
              <div className="rental-history">
                <h4>Payment History</h4>
                {[['June 2026', 85000, true], ['May 2026', 85000, true], ['April 2026', 85000, true]].map(([m, amt, paid], i) => (
                  <div key={i} className="rental-hist-row"><span>{m}</span><span>₹{amt.toLocaleString()}</span><span className="trust-pill green small">✓ Paid</span></div>
                ))}
              </div>
            </div>
          )}

          {tab === 'maintenance' && (
            <div>
              <button className="os-btn-primary" style={{ marginBottom: 16 }} onClick={() => setNewReq(true)}>+ New Request</button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {requests.map(r => (
                  <div key={r.id} className="rental-req-row">
                    <span className="rrr-icon">{r.category === 'Plumbing' ? '🚰' : r.category === 'Electrical' ? '⚡' : '🎨'}</span>
                    <div className="rrr-body"><h4>{r.title}</h4><span>{r.category} · {r.date}</span></div>
                    <span className={`rrr-priority ${r.priority.toLowerCase()}`}>{r.priority}</span>
                    <span className={`trust-pill ${r.status === 'Resolved' ? 'green' : r.status === 'In Progress' ? 'amber' : 'red'} small`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'lease' && (
            <div className="rental-lease-card">
              <h3>Lease Agreement</h3>
              <div className="passport-info-grid">
                <div><label>Property</label><p>Flat 1204, DLF Privana South</p></div>
                <div><label>Monthly Rent</label><p>₹85,000</p></div>
                <div><label>Security Deposit</label><p>₹2,55,000</p></div>
                <div><label>Lease Start</label><p>1 Jan 2026</p></div>
                <div><label>Lease End</label><p>31 Dec 2026</p></div>
                <div><label>Renewal</label><p>Auto-reminder 60 days prior</p></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button className="os-btn-primary" onClick={() => toast('Lease PDF downloaded', 'success')}>Download Lease</button>
                <button className="os-btn-outline" onClick={() => toast('Renewal request sent to landlord', 'info')}>Request Renewal</button>
              </div>
            </div>
          )}

          {tab === 'messages' && (
            <div className="rental-messages">
              {[{ from: 'Rajiv Mehta (Landlord)', text: 'The plumber will visit tomorrow between 10-12 AM.', time: '2h ago', them: true },
                { from: 'You', text: 'Thanks, I\'ll be available.', time: '1h ago', them: false }].map((m, i) => (
                <div key={i} className={`ai-msg ${m.them ? 'ai' : 'user'}`}>
                  <div className="ai-msg-bubble"><p style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{m.from}</p><p>{m.text}</p></div>
                </div>
              ))}
              <div className="ai-input-row" style={{ borderTop: 'none', padding: 0, marginTop: 12 }}>
                <input placeholder="Message your landlord…" onKeyDown={e => { if (e.key === 'Enter' && e.target.value) { toast('Message sent', 'success'); e.target.value = ''; } }} />
                <button className="os-btn-primary" onClick={() => toast('Message sent', 'success')}>Send</button>
              </div>
            </div>
          )}
        </>
      )}

      {mode === 'landlord' && (
        <>
          <div className="trust-stats-row">
            <div className="trust-stat-card green"><span className="tsc-num">₹1.47L</span><span className="tsc-lbl">Monthly Income</span></div>
            <div className="trust-stat-card blue"><span className="tsc-num">2/3</span><span className="tsc-lbl">Occupied</span></div>
            <div className="trust-stat-card red"><span className="tsc-num">1</span><span className="tsc-lbl">Rent Due</span></div>
            <div className="trust-stat-card purple"><span className="tsc-num">{requests.filter(r => r.status !== 'Resolved').length}</span><span className="tsc-lbl">Open Requests</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LANDLORD_UNITS.map((u, i) => (
              <div key={i} className="rental-unit-row">
                <div className="rur-info"><h4>{u.unit}</h4><span>{u.tenant}</span></div>
                <div className="rur-rent">₹{u.rent.toLocaleString()}/mo</div>
                <span className={`trust-pill ${u.status === 'Occupied' ? 'green' : 'red'} small`}>{u.status}</span>
                {u.status === 'Occupied' && (u.paid
                  ? <span className="trust-pill green small">✓ Paid</span>
                  : <button className="os-btn-primary small" onClick={() => toast(`Reminder sent to ${u.tenant}`, 'info')}>Send Reminder</button>)}
                {u.status === 'Vacant' && <button className="os-btn-outline small" onClick={() => toast('Listing published to discovery feed', 'success')}>List Unit</button>}
              </div>
            ))}
          </div>
        </>
      )}

      {newReq && (
        <div className="os-modal-backdrop" onClick={() => setNewReq(null)}>
          <div className="os-modal" onClick={e => e.stopPropagation()}>
            <div className="os-modal-header"><h3>New Maintenance Request</h3><button onClick={() => setNewReq(null)}>✕</button></div>
            <div className="os-modal-body">
              <div><label>Issue Description</label><input placeholder="e.g. Leaking bathroom tap" value={reqForm.title} onChange={e => setReqForm(p => ({ ...p, title: e.target.value }))} autoFocus /></div>
              <div className="os-form-row">
                <div><label>Category</label><select value={reqForm.category} onChange={e => setReqForm(p => ({ ...p, category: e.target.value }))}>{['Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Appliance', 'Other'].map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label>Priority</label><select value={reqForm.priority} onChange={e => setReqForm(p => ({ ...p, priority: e.target.value }))}>{['Low', 'Medium', 'High'].map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div><label>Add Photo (optional)</label><button className="os-btn-outline small" onClick={() => toast('Photo attached', 'success')}>📷 Upload Photo</button></div>
            </div>
            <div className="os-modal-footer">
              <button className="os-btn-outline" onClick={() => setNewReq(null)}>Cancel</button>
              <button className="os-btn-primary" onClick={submitRequest}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
