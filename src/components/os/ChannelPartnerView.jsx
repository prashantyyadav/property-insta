import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPriceIndian } from '../../data';

const MOCK_CPS = [
  { id: 1, name: 'Rajiv Properties', city: 'Gurgaon', tier: 'Platinum', deals: 42, commission: 2850000, rating: 4.9, active: true },
  { id: 2, name: 'Priya Real Estate', city: 'Delhi', tier: 'Gold', deals: 28, commission: 1420000, rating: 4.7, active: true },
  { id: 3, name: 'NRI Connect', city: 'Mumbai', tier: 'Silver', deals: 12, commission: 680000, rating: 4.5, active: true },
  { id: 4, name: 'HomeFirst Brokers', city: 'Noida', tier: 'Bronze', deals: 6, commission: 220000, rating: 4.2, active: false },
];

const TIER_COLORS = { Platinum: '#7C3AED', Gold: '#D97706', Silver: '#6B7280', Bronze: '#92400E' };

const MOCK_INVENTORY = [
  { builder: 'DLF', project: 'Privana South', units: 12, price: '₹6.5Cr–₹9Cr', type: '4 BHK', commission: '2%', status: 'Hot' },
  { builder: 'Godrej', project: 'Aristocrat', units: 8, price: '₹3.2Cr–₹5Cr', type: '3/4 BHK', commission: '1.5%', status: 'Available' },
  { builder: 'M3M', project: 'Antalya Hills', units: 23, price: '₹1.8Cr–₹3.5Cr', type: '3 BHK', commission: '2%', status: 'Available' },
  { builder: 'Emaar', project: 'Urban Ascent', units: 5, price: '₹4.5Cr–₹6Cr', type: '4 BHK', commission: '1.75%', status: 'Limited' },
  { builder: 'Adani', project: 'Samsara', units: 0, price: '₹7Cr+', type: 'Penthouse', commission: '2.5%', status: 'Sold Out' },
];

export default function ChannelPartnerView() {
  const [tab, setTab] = useState('inventory');
  const { allProperties } = useApp();

  const totalCommission = MOCK_CPS.reduce((s, cp) => s + cp.commission, 0);

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">🌐</div>
        <div>
          <h1>Channel Partner Network</h1>
          <p>Inventory marketplace, lead sharing & commission tracking</p>
        </div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="cp-stats-row">
        <div className="cp-stat"><span>{MOCK_CPS.filter(c => c.active).length}</span><p>Active CPs</p></div>
        <div className="cp-stat"><span>{MOCK_CPS.reduce((s, c) => s + c.deals, 0)}</span><p>Total Deals</p></div>
        <div className="cp-stat"><span>{formatPriceIndian(totalCommission)}</span><p>Commission Paid</p></div>
        <div className="cp-stat"><span>{MOCK_INVENTORY.filter(i => i.status !== 'Sold Out').reduce((s, i) => s + i.units, 0)}</span><p>Units Available</p></div>
      </div>

      <div className="os-tabs">
        {['inventory', 'partners', 'commissions'].map(t => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'inventory' && '🏢 Inventory'}
            {t === 'partners' && '🤝 My CPs'}
            {t === 'commissions' && '💰 Commissions'}
          </button>
        ))}
      </div>

      {tab === 'inventory' && (
        <div className="cp-inventory-grid">
          {MOCK_INVENTORY.map((item, i) => (
            <div key={i} className={`cp-inv-card ${item.status === 'Sold Out' ? 'sold-out' : ''}`}>
              <div className="cpic-header">
                <div className="cpic-builder">{item.builder}</div>
                <span className={`cpic-status ${item.status === 'Hot' ? 'hot' : item.status === 'Limited' ? 'limited' : item.status === 'Sold Out' ? 'sold' : 'avail'}`}>
                  {item.status}
                </span>
              </div>
              <h3>{item.project}</h3>
              <p>{item.type} · {item.price}</p>
              <div className="cpic-footer">
                <div className="cpic-units">
                  <span className="cpic-n">{item.units}</span>
                  <span>Units</span>
                </div>
                <div className="cpic-comm">
                  <span className="cpic-n">{item.commission}</span>
                  <span>Commission</span>
                </div>
              </div>
              {item.status !== 'Sold Out' && (
                <button className="os-btn-primary" style={{ width: '100%', marginTop: 12 }}>
                  Request Leads
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'partners' && (
        <div className="cp-partner-list">
          {MOCK_CPS.map(cp => (
            <div key={cp.id} className={`cp-partner-card ${!cp.active ? 'inactive' : ''}`}>
              <div className="cppc-avatar" style={{ background: TIER_COLORS[cp.tier] }}>
                {cp.name[0]}
              </div>
              <div className="cppc-body">
                <h4>{cp.name} <span className={`cp-tier-badge`} style={{ color: TIER_COLORS[cp.tier] }}>◆ {cp.tier}</span></h4>
                <p>{cp.city} · {cp.deals} deals · ⭐ {cp.rating}</p>
              </div>
              <div className="cppc-meta">
                <span>{formatPriceIndian(cp.commission)} earned</span>
                <span className={`cp-status-dot ${cp.active ? 'active' : ''}`}>{cp.active ? 'Active' : 'Inactive'}</span>
              </div>
              <button className="os-btn-outline small">Share Lead</button>
            </div>
          ))}
          <button className="os-btn-primary" style={{ marginTop: 12 }}>+ Onboard New CP</button>
        </div>
      )}

      {tab === 'commissions' && (
        <div className="cp-commissions">
          <div className="cp-comm-summary">
            <div className="ccs-card green">
              <h3>{formatPriceIndian(totalCommission)}</h3>
              <p>Total Commission Paid (FY 2025-26)</p>
            </div>
          </div>
          {MOCK_CPS.map(cp => (
            <div key={cp.id} className="cp-comm-row">
              <div style={{ fontWeight: 600 }}>{cp.name}</div>
              <div className="cpcr-bar-wrap">
                <div className="cpcr-bar" style={{ width: `${(cp.commission / totalCommission) * 100}%`, background: TIER_COLORS[cp.tier] }} />
              </div>
              <div style={{ color: TIER_COLORS[cp.tier], fontWeight: 700 }}>{formatPriceIndian(cp.commission)}</div>
              <div>{cp.deals} deals</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
