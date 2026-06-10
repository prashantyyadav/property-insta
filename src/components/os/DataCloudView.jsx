import { useState } from 'react';

const MARKET_DATA = [
  { city: 'Gurgaon', qoq: 4.2, yoy: 14.8, supply: 12400, demand: 15600, absorption: 78, avgPrice: 18500 },
  { city: 'Noida', qoq: 3.8, yoy: 12.2, supply: 9800, demand: 11200, absorption: 72, avgPrice: 9800 },
  { city: 'Mumbai', qoq: 2.1, yoy: 8.4, supply: 28000, demand: 31000, absorption: 65, avgPrice: 32000 },
  { city: 'Bangalore', qoq: 5.1, yoy: 18.2, supply: 18000, demand: 24000, absorption: 82, avgPrice: 12000 },
  { city: 'Hyderabad', qoq: 6.2, yoy: 22.4, supply: 15000, demand: 21000, absorption: 86, avgPrice: 8500 },
  { city: 'Pune', qoq: 4.4, yoy: 15.6, supply: 11000, demand: 14500, absorption: 76, avgPrice: 9200 },
];

const SEGMENTS = [
  { label: 'Luxury (₹3Cr+)', share: 18, growth: 31 },
  { label: 'Premium (₹1-3Cr)', share: 32, growth: 22 },
  { label: 'Mid (₹50L-1Cr)', share: 35, growth: 15 },
  { label: 'Affordable (<₹50L)', share: 15, growth: 8 },
];

export default function DataCloudView() {
  const [tab, setTab] = useState('market');
  const [sortBy, setSortBy] = useState('yoy');

  const sorted = [...MARKET_DATA].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">☁️</div>
        <div>
          <h1>Real Estate Data Cloud</h1>
          <p>Market intelligence, demand-supply analytics & builder insights</p>
        </div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="os-tabs">
        {['market', 'segments', 'builders'].map(t => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'market' && '📊 Market Intelligence'}
            {t === 'segments' && '🥧 Segment Analysis'}
            {t === 'builders' && '🏗️ Builder Rankings'}
          </button>
        ))}
      </div>

      {tab === 'market' && (
        <div className="dc-market">
          <div className="dc-sort-row">
            <span>Sort by:</span>
            {[['yoy', 'YoY Growth'], ['qoq', 'QoQ'], ['absorption', 'Absorption'], ['avgPrice', 'Price']].map(([k, l]) => (
              <button key={k} className={`os-tab-sm ${sortBy === k ? 'active' : ''}`} onClick={() => setSortBy(k)}>{l}</button>
            ))}
          </div>
          <div className="dc-market-table">
            <div className="dmt-head">
              <span>City</span><span>Avg ₹/sqft</span><span>QoQ</span><span>YoY</span><span>Supply</span><span>Demand</span><span>Absorption</span>
            </div>
            {sorted.map((row, i) => (
              <div key={row.city} className="dmt-row">
                <div className="dmt-city">
                  <span className="dmt-rank">#{i + 1}</span>
                  {row.city}
                </div>
                <div>₹{row.avgPrice.toLocaleString()}</div>
                <div className="dmt-positive">+{row.qoq}%</div>
                <div className="dmt-positive">+{row.yoy}%</div>
                <div>{row.supply.toLocaleString()}</div>
                <div>{row.demand.toLocaleString()}</div>
                <div>
                  <div className="dmt-absorb-bar">
                    <div style={{ width: `${row.absorption}%`, background: row.absorption > 80 ? '#059669' : row.absorption > 65 ? '#D97706' : '#DC2626' }} />
                  </div>
                  <span>{row.absorption}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'segments' && (
        <div className="dc-segments">
          <div className="dc-seg-chart">
            {SEGMENTS.map((seg, i) => (
              <div key={i} className="dc-seg-row">
                <span className="dsr-label">{seg.label}</span>
                <div className="dsr-bar-wrap">
                  <div className="dsr-bar" style={{ width: `${seg.share * 2}%` }}>
                    <span>{seg.share}%</span>
                  </div>
                </div>
                <span className="dsr-growth">+{seg.growth}% YoY</span>
              </div>
            ))}
          </div>
          <div className="dc-seg-insight">
            <h4>Key Insight</h4>
            <p>Luxury segment (₹3Cr+) is the fastest growing at 31% YoY, driven by NRI demand, HNI wealth creation, and global quality expectations. Mid-segment shows highest volume at 35% market share.</p>
          </div>
        </div>
      )}

      {tab === 'builders' && (
        <div className="dc-builders">
          {[
            { name: 'DLF', units: 4200, revenue: '₹8,400 Cr', rera: 42, rating: 4.6, city: 'Pan India' },
            { name: 'Godrej Properties', units: 3800, revenue: '₹6,200 Cr', rera: 38, rating: 4.7, city: 'Pan India' },
            { name: 'Prestige Group', units: 3100, revenue: '₹5,800 Cr', rera: 31, rating: 4.5, city: 'South India' },
            { name: 'M3M India', units: 2900, revenue: '₹4,900 Cr', rera: 29, rating: 4.3, city: 'NCR' },
            { name: 'Signature Global', units: 2400, revenue: '₹3,200 Cr', rera: 22, rating: 4.1, city: 'NCR' },
          ].map((b, i) => (
            <div key={i} className="dc-builder-row">
              <span className="dcbr-rank">#{i + 1}</span>
              <div className="dcbr-name">{b.name}<small>{b.city}</small></div>
              <div>{b.units.toLocaleString()} units</div>
              <div>{b.revenue}</div>
              <div>{b.rera} RERA registrations</div>
              <div>⭐ {b.rating}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
