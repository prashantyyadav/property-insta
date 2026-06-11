import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { formatPriceIndian } from '../../data';

const PROFILES = [
  { id: 'enduser', label: 'Home Buyer', icon: '🏠', desc: 'Find a home to live in' },
  { id: 'investor', label: 'Investor', icon: '📈', desc: 'Build a property portfolio' },
  { id: 'nri', label: 'NRI', icon: '🌐', desc: 'Invest from abroad' },
];

const RECOMMENDATIONS = {
  enduser: [
    { name: 'Godrej Aristocrat — 3 BHK', match: 94, price: 32000000, reason: 'Matches your ₹3.2Cr budget, 15-min office commute, ready possession', tags: ['Best Match', 'Ready to Move'] },
    { name: 'M3M Antalya Hills — 3 BHK', match: 88, price: 28000000, reason: 'Lower price, near upcoming metro, family-friendly amenities', tags: ['Value Pick'] },
  ],
  investor: [
    { name: 'Cyber City Office (Fractional)', match: 96, price: 500000, reason: '9.5% rental yield, Grade-A tenant, high liquidity on secondary market', tags: ['Top Yield', 'Commercial'] },
    { name: 'Dwarka Expwy Plot', match: 91, price: 18000000, reason: '16% projected appreciation post-metro, land banking opportunity', tags: ['High Growth'] },
  ],
  nri: [
    { name: 'DLF Privana — 4 BHK (Managed)', match: 93, price: 75000000, reason: 'Full property management included, NRI-friendly docs, premium resale', tags: ['Hands-off', 'Premium'] },
  ],
};

const EXIT_PLAN = [
  { year: '2026', action: 'Hold', value: 32000000, note: 'Construction phase — value stable' },
  { year: '2028', action: 'Hold', value: 41000000, note: 'Possession + metro completion drives appreciation' },
  { year: '2030', action: 'Review', value: 52000000, note: 'Peak corridor maturity — evaluate market' },
  { year: '2031', action: 'Sell', value: 58000000, note: 'Optimal exit — +81% gain, low capital gains via indexation' },
];

export default function AIExchangeView() {
  const toast = useToast();
  const [profile, setProfile] = useState('enduser');
  const [tab, setTab] = useState('recommend');
  const recs = RECOMMENDATIONS[profile] || [];

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">✨</div>
        <div><h1>AI Property Exchange</h1><p>Personalized property, financing, investment & exit planning — AI-orchestrated</p></div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="aix-profile-select">
        <span className="aix-label">I am a:</span>
        {PROFILES.map(p => (
          <button key={p.id} className={`aix-profile ${profile === p.id ? 'active' : ''}`} onClick={() => setProfile(p.id)}>
            <span className="aixp-icon">{p.icon}</span>
            <div><strong>{p.label}</strong><small>{p.desc}</small></div>
          </button>
        ))}
      </div>

      <div className="os-tabs">
        {[['recommend', '🎯 Recommendations'], ['exit', '🚪 Exit Planning']].map(([t, l]) => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === 'recommend' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {recs.map((r, i) => (
            <div key={i} className="aix-rec-card">
              <div className="aix-match-ring">
                <svg viewBox="0 0 64 64" width="64" height="64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="var(--os-border)" strokeWidth="6" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#7C3AED" strokeWidth="6" strokeDasharray={`${(r.match / 100) * 163} 163`} strokeLinecap="round" transform="rotate(-90 32 32)" />
                  <text x="32" y="37" textAnchor="middle" fill="#7C3AED" fontSize="14" fontWeight="700">{r.match}%</text>
                </svg>
                <span>AI Match</span>
              </div>
              <div className="aix-rec-body">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <h4>{r.name}</h4>
                  {r.tags.map((t, j) => <span key={j} className="aix-tag">{t}</span>)}
                </div>
                <p className="aix-price">{formatPriceIndian(r.price)}</p>
                <p className="aix-reason">🤖 {r.reason}</p>
              </div>
              <div className="aix-rec-actions">
                <button className="os-btn-primary small" onClick={() => toast(`Connecting you with financing for ${r.name}`, 'info')}>Get Financing</button>
                <button className="os-btn-outline small" onClick={() => toast('Added to shortlist', 'success')}>Shortlist</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'exit' && (
        <div className="aix-exit-panel">
          <div className="aix-exit-intro">
            <h3>🤖 AI Exit Strategy</h3>
            <p>Based on infrastructure development, market cycles & tax efficiency, here's your optimal hold-and-exit timeline for <strong>Godrej Aristocrat 3 BHK</strong>.</p>
          </div>
          <div className="aix-timeline">
            {EXIT_PLAN.map((e, i) => (
              <div key={i} className={`aix-tl-item ${e.action === 'Sell' ? 'sell' : e.action === 'Review' ? 'review' : ''}`}>
                <div className="aix-tl-year">{e.year}</div>
                <div className="aix-tl-dot" />
                <div className="aix-tl-body">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`aix-action ${e.action.toLowerCase()}`}>{e.action}</span>
                    <strong style={{ color: 'var(--os-accent)' }}>{formatPriceIndian(e.value)}</strong>
                  </div>
                  <p>{e.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="passport-appreciation">📈 Projected total gain: +81% over 5 years · Recommended exit: 2031</div>
          <button className="os-btn-primary" style={{ marginTop: 16 }} onClick={() => toast('Exit plan saved — you\'ll get alerts at each milestone', 'success', 5000)}>Activate This Plan</button>
        </div>
      )}
    </div>
  );
}
