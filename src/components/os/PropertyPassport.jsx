import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPriceIndian } from '../../data';

const MOCK_PASSPORT = {
  id: 'PPT-2024-GGN-00142',
  title: 'DLF Privana South – 4 BHK, Tower C, Flat 1204',
  address: 'Sector 77, SPR Road, Gurugram, Haryana 122009',
  reraId: 'HR/RERA/GUR/2025/301',
  area: 4200,
  type: 'Apartment',
  builder: 'DLF Limited',
  trustScore: 94,
  ownership: [
    { owner: 'DLF Limited (Developer)', date: 'Jan 2020', type: 'Original Allotment', price: null },
    { owner: 'Rajiv Mehta', date: 'Mar 2022', type: 'First Sale', price: 62000000 },
    { owner: 'Priya & Suresh Kapoor', date: 'Nov 2023', type: 'Resale', price: 71000000 },
    { owner: 'Current Owner (You)', date: 'Present', type: 'Active', price: null },
  ],
  valuations: [
    { year: '2020', value: 52000000 },
    { year: '2021', value: 56000000 },
    { year: '2022', value: 62000000 },
    { year: '2023', value: 69000000 },
    { year: '2024', value: 75000000 },
    { year: '2025', value: 81000000 },
  ],
  documents: [
    { name: 'Sale Deed (2023)', type: 'PDF', verified: true },
    { name: 'RERA Registration Certificate', type: 'PDF', verified: true },
    { name: 'Occupancy Certificate', type: 'PDF', verified: false },
    { name: 'Property Tax Receipts (2024)', type: 'PDF', verified: true },
    { name: 'Encumbrance Certificate', type: 'PDF', verified: true },
    { name: 'Floor Plan (Approved)', type: 'PDF', verified: true },
  ],
  taxes: [
    { year: '2022-23', amount: 48000, paid: true },
    { year: '2023-24', amount: 52000, paid: true },
    { year: '2024-25', amount: 56000, paid: false },
  ],
};

export default function PropertyPassport() {
  const { allProperties } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('timeline');

  const prop = selected || MOCK_PASSPORT;
  const maxVal = Math.max(...prop.valuations.map(v => v.value));

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">📋</div>
        <div>
          <h1>Property Passport</h1>
          <p>Permanent digital record — ownership history, valuation, registry & documents</p>
        </div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="passport-search-row">
        <input
          type="text"
          placeholder="Search by property ID, address or RERA number…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="passport-search-input"
        />
        <button className="os-btn-primary">Lookup Passport</button>
      </div>

      <div className="passport-card">
        <div className="passport-card-header">
          <div className="passport-id-badge">
            <span>🪪</span>
            <div>
              <strong>Passport ID</strong>
              <code>{prop.id}</code>
            </div>
          </div>
          <div className="passport-trust">
            <div className="passport-trust-score" style={{ '--score': prop.trustScore }}>
              <svg viewBox="0 0 64 64" width="64" height="64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="6" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#059669" strokeWidth="6"
                  strokeDasharray={`${(prop.trustScore / 100) * 163} 163`}
                  strokeLinecap="round" transform="rotate(-90 32 32)" />
                <text x="32" y="37" textAnchor="middle" fill="#059669" fontSize="14" fontWeight="700">{prop.trustScore}</text>
              </svg>
              <span>Trust Score</span>
            </div>
          </div>
        </div>

        <div className="passport-info-grid">
          <div><label>Property</label><p>{prop.title}</p></div>
          <div><label>Address</label><p>{prop.address}</p></div>
          <div><label>RERA ID</label><code>{prop.reraId}</code></div>
          <div><label>Area</label><p>{prop.area.toLocaleString()} sq.ft</p></div>
          <div><label>Type</label><p>{prop.type}</p></div>
          <div><label>Developer</label><p>{prop.builder}</p></div>
        </div>

        <div className="os-tabs">
          {['timeline', 'valuation', 'documents', 'taxes'].map(t => (
            <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'timeline' && '🔄 Ownership'}
              {t === 'valuation' && '📈 Valuation'}
              {t === 'documents' && '📂 Documents'}
              {t === 'taxes' && '🧾 Taxes'}
            </button>
          ))}
        </div>

        {tab === 'timeline' && (
          <div className="passport-timeline">
            {prop.ownership.map((o, i) => (
              <div key={i} className={`pp-timeline-item ${o.type === 'Active' ? 'active' : ''}`}>
                <div className="pp-tl-dot" />
                <div className="pp-tl-body">
                  <h4>{o.owner}</h4>
                  <span className="pp-tl-date">{o.date} · {o.type}</span>
                  {o.price && <span className="pp-tl-price">{formatPriceIndian(o.price)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'valuation' && (
          <div className="passport-chart">
            <h4>Valuation History</h4>
            <div className="pp-bar-chart">
              {prop.valuations.map(v => (
                <div key={v.year} className="pp-bar-col">
                  <div className="pp-bar-wrap">
                    <div className="pp-bar" style={{ height: `${(v.value / maxVal) * 100}%` }}>
                      <span className="pp-bar-label">{formatPriceIndian(v.value)}</span>
                    </div>
                  </div>
                  <span className="pp-bar-year">{v.year}</span>
                </div>
              ))}
            </div>
            <p className="passport-appreciation">
              📈 Total appreciation: +{Math.round(((prop.valuations.at(-1).value - prop.valuations[0].value) / prop.valuations[0].value) * 100)}% over 5 years
            </p>
          </div>
        )}

        {tab === 'documents' && (
          <div className="passport-docs">
            {prop.documents.map((d, i) => (
              <div key={i} className="pp-doc-row">
                <span className="pp-doc-icon">📄</span>
                <span className="pp-doc-name">{d.name}</span>
                <span className={`pp-doc-status ${d.verified ? 'verified' : 'pending'}`}>
                  {d.verified ? '✓ Verified' : '⏳ Pending'}
                </span>
                <button className="os-btn-outline small">View</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'taxes' && (
          <div className="passport-taxes">
            {prop.taxes.map((t, i) => (
              <div key={i} className="pp-tax-row">
                <span>{t.year}</span>
                <span>₹{t.amount.toLocaleString()}</span>
                <span className={`trust-pill ${t.paid ? 'green' : 'red'}`}>
                  {t.paid ? '✓ Paid' : '⚠ Due'}
                </span>
                {!t.paid && <button className="os-btn-primary small">Pay Now</button>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
