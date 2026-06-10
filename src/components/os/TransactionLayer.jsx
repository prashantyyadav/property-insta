import { useState } from 'react';
import { formatPriceIndian } from '../../data';
import { useToast } from '../../hooks/useToast';

const DEAL_STAGES = ['Interested', 'Offer Made', 'Negotiation', 'Docs Signed', 'Registered'];

const MOCK_DEALS = [
  { id: 'DL-001', property: 'DLF Privana 4BHK', buyer: 'Arjun Sharma', value: 75000000, stage: 2, date: '2026-06-01', agent: 'Priya S.' },
  { id: 'DL-002', property: 'Godrej Aristocrat 3BHK', buyer: 'Meera Joshi', value: 52000000, stage: 4, date: '2026-05-28', agent: 'Vikram G.' },
  { id: 'DL-003', property: 'M3M Mansion', buyer: 'Rahul & Sunita', value: 38000000, stage: 1, date: '2026-06-05', agent: 'Rohit M.' },
  { id: 'DL-004', property: 'Emaar Urban Ascent', buyer: 'Kavita Reddy', value: 61000000, stage: 3, date: '2026-05-20', agent: 'Deepak R.' },
];

const DOC_CHECKLIST = [
  { name: 'Sale Agreement', required: true },
  { name: 'KYC Documents (Buyer)', required: true },
  { name: 'KYC Documents (Seller)', required: true },
  { name: 'Property Title Report', required: true },
  { name: 'RERA Certificate', required: true },
  { name: 'Bank NOC (if mortgaged)', required: false },
  { name: 'TDS Certificate (26QB)', required: true },
  { name: 'Sale Deed (Executed)', required: true },
  { name: 'Registration Receipt', required: true },
];

export default function TransactionLayer() {
  const toast = useToast();
  const [deals, setDeals] = useState(MOCK_DEALS);
  const [selectedDeal, setSelectedDeal] = useState(MOCK_DEALS[0]);
  const [tab, setTab] = useState('pipeline');
  const [docsDone, setDocsDone] = useState({ 0: true, 1: true, 4: true });
  const [offerModal, setOfferModal] = useState(false);
  const [offerAmt, setOfferAmt] = useState('');

  const advanceStage = (dealId) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId && d.stage < 4) {
        const next = { ...d, stage: d.stage + 1 };
        if (d.id === selectedDeal.id) setSelectedDeal(next);
        toast(`Deal moved to "${DEAL_STAGES[next.stage]}"`, 'success');
        return next;
      }
      return d;
    }));
  };

  const sendOffer = () => {
    if (!offerAmt) { toast('Enter an offer amount', 'warning'); return; }
    setOfferModal(false);
    toast(`Offer of ₹${Number(offerAmt).toLocaleString()} sent to seller`, 'success');
    advanceStage(selectedDeal.id);
  };

  const completedDocs = Object.keys(docsDone).length;

  const uploadDoc = (idx, name) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.png';
    input.onchange = (e) => {
      if (e.target.files[0]) {
        setDocsDone(prev => ({ ...prev, [idx]: true }));
        toast(`${name} uploaded`, 'success');
      }
    };
    input.click();
  };

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">🤝</div>
        <div><h1>Transaction Layer</h1><p>Digital deal room — offers, negotiations, approvals & documentation</p></div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="txn-stats-row">
        <div className="txn-stat"><span className="ts-n">{deals.length}</span><span>Active Deals</span></div>
        <div className="txn-stat"><span className="ts-n">{formatPriceIndian(deals.reduce((s, d) => s + d.value, 0))}</span><span>Pipeline Value</span></div>
        <div className="txn-stat"><span className="ts-n">{deals.filter(d => d.stage === 4).length}</span><span>Registered</span></div>
        <div className="txn-stat"><span className="ts-n">{deals.filter(d => d.stage >= 2).length}</span><span>In Negotiation</span></div>
      </div>

      <div className="os-tabs">
        {['pipeline', 'dealroom', 'docs'].map(t => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'pipeline' && '📊 Pipeline'}
            {t === 'dealroom' && '🏛️ Deal Room'}
            {t === 'docs' && `📂 Documents (${completedDocs}/${DOC_CHECKLIST.length})`}
          </button>
        ))}
      </div>

      {tab === 'pipeline' && (
        <div className="txn-kanban">
          {DEAL_STAGES.map((stage, si) => (
            <div key={si} className="txn-kanban-col">
              <div className="txn-col-header">
                <span>{stage}</span>
                <span className="txn-col-count">{deals.filter(d => d.stage === si).length}</span>
              </div>
              <div className="txn-col-body">
                {deals.filter(d => d.stage === si).map(deal => (
                  <div key={deal.id} className="txn-deal-card" onClick={() => { setSelectedDeal(deal); setTab('dealroom'); }}>
                    <div className="tdc-id">{deal.id}</div>
                    <h4>{deal.property}</h4>
                    <p>{deal.buyer}</p>
                    <div className="tdc-footer">
                      <span className="tdc-value">{formatPriceIndian(deal.value)}</span>
                      <span className="tdc-agent">{deal.agent}</span>
                    </div>
                    {deal.stage < 4 && (
                      <button className="os-btn-primary small" style={{ marginTop: 8, width: '100%' }}
                        onClick={e => { e.stopPropagation(); advanceStage(deal.id); }}>
                        Advance →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'dealroom' && selectedDeal && (
        <div className="txn-dealroom">
          <div className="dr-header">
            <h3>Deal Room — {selectedDeal.id}</h3>
            <span className={`dr-stage-badge stage-${selectedDeal.stage}`}>{DEAL_STAGES[selectedDeal.stage]}</span>
          </div>
          <div className="dr-info-grid">
            <div><label>Property</label><p>{selectedDeal.property}</p></div>
            <div><label>Buyer</label><p>{selectedDeal.buyer}</p></div>
            <div><label>Deal Value</label><p>{formatPriceIndian(selectedDeal.value)}</p></div>
            <div><label>Agent</label><p>{selectedDeal.agent}</p></div>
          </div>
          <div className="dr-stage-progress">
            {DEAL_STAGES.map((s, i) => (
              <div key={i} className={`dr-stage-step ${i <= selectedDeal.stage ? 'done' : ''} ${i === selectedDeal.stage ? 'current' : ''}`}>
                <div className="dr-step-dot" /><span>{s}</span>
              </div>
            ))}
          </div>
          <div className="dr-actions">
            <button className="os-btn-primary" onClick={() => setOfferModal(true)}>Send Offer</button>
            <button className="os-btn-outline" onClick={() => { setTab('docs'); }}>Upload Document</button>
            <button className="os-btn-outline" onClick={() => toast('Meeting scheduled — calendar invite sent', 'success')}>Schedule Meeting</button>
            <button className="os-btn-outline" onClick={() => toast(`WhatsApp opened for ${selectedDeal.buyer}`, 'info')}>WhatsApp Buyer</button>
            {selectedDeal.stage < 4 && (
              <button className="os-btn-primary" onClick={() => advanceStage(selectedDeal.id)}>Advance Stage →</button>
            )}
          </div>
          <div className="dr-activity">
            <h4>Activity Log</h4>
            <div className="dr-activity-item"><span>📤</span><p>Offer of {formatPriceIndian(selectedDeal.value * 0.95)} sent to seller</p><small>2 days ago</small></div>
            <div className="dr-activity-item"><span>📞</span><p>Call with buyer — confirmed interest</p><small>4 days ago</small></div>
            <div className="dr-activity-item"><span>🏠</span><p>Site visit completed</p><small>6 days ago</small></div>
          </div>
        </div>
      )}

      {tab === 'docs' && (
        <div className="txn-docs">
          <div className="txn-docs-progress">
            <div className="tdp-bar"><div className="tdp-fill" style={{ width: `${(completedDocs / DOC_CHECKLIST.length) * 100}%` }} /></div>
            <span>{completedDocs}/{DOC_CHECKLIST.length} documents complete</span>
          </div>
          {DOC_CHECKLIST.map((doc, i) => (
            <div key={i} className={`txn-doc-row ${docsDone[i] ? 'done' : ''}`}>
              <span className="tdr-check" onClick={() => { if (!docsDone[i]) uploadDoc(i, doc.name); }}>
                {docsDone[i] ? '✅' : '⬜'}
              </span>
              <span className="tdr-name">{doc.name}</span>
              {doc.required && <span className="tdr-req">Required</span>}
              {docsDone[i]
                ? <button className="os-btn-outline small" onClick={() => toast(`Viewing ${doc.name}`, 'info')}>View</button>
                : <button className="os-btn-outline small" onClick={() => uploadDoc(i, doc.name)}>Upload</button>
              }
            </div>
          ))}
        </div>
      )}

      {offerModal && (
        <div className="os-modal-backdrop" onClick={() => setOfferModal(false)}>
          <div className="os-modal" onClick={e => e.stopPropagation()}>
            <div className="os-modal-header">
              <h3>Send Offer — {selectedDeal?.property}</h3>
              <button onClick={() => setOfferModal(false)}>✕</button>
            </div>
            <div className="os-modal-body">
              <div>
                <label>Offer Amount (₹)</label>
                <input type="number" placeholder={selectedDeal?.value * 0.95}
                  value={offerAmt} onChange={e => setOfferAmt(e.target.value)} autoFocus />
              </div>
              <div>
                <label>Message to Seller (optional)</label>
                <textarea placeholder="We are interested in purchasing this property and propose the above amount…" />
              </div>
              <div>
                <label>Validity</label>
                <select><option>7 days</option><option>14 days</option><option>30 days</option></select>
              </div>
            </div>
            <div className="os-modal-footer">
              <button className="os-btn-outline" onClick={() => setOfferModal(false)}>Cancel</button>
              <button className="os-btn-primary" onClick={sendOffer}>Send Offer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
