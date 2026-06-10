import { useState } from 'react';

const CORRIDORS = [
  { name: 'Dwarka Expressway', type: 'Highway + Metro', status: 'Operational', impact: '+22% appreciation', zone: ['Sector 84', 'Sector 85', 'Sector 99', 'Palam Vihar'], color: '#059669' },
  { name: 'SPR (Southern Peripheral Road)', type: 'Highway', status: 'Operational', impact: '+18% appreciation', zone: ['Sector 77', 'Sector 78', 'Sector 79', 'Sector 80'], color: '#4F46E5' },
  { name: 'KMP Expressway', type: 'Highway', status: 'Operational', impact: '+14% appreciation', zone: ['Sohna', 'Manesar', 'IMT Manesar'], color: '#D97706' },
  { name: 'Golf Course Extension (Phase 2)', type: 'Road + Metro Planned', status: 'Under Development', impact: '+19% forecast by 2028', zone: ['Sector 65', 'Sector 66', 'Sector 67'], color: '#7C3AED' },
  { name: 'RRTS Delhi-Gurugram', type: 'Rapid Rail', status: 'Under Construction', impact: '+28% forecast by 2027', zone: ['Sector 17', 'Cyber City', 'Udyog Vihar'], color: '#DC2626' },
];

const METRO_LINES = [
  { line: 'Yellow Line', status: 'Operational', stations: ['HUDA City Centre', 'Sikanderpur', 'MG Road', 'Iffco Chowk'], impact: 'Established premium — 8-12% over non-metro' },
  { line: 'Rapid Metro', status: 'Operational', stations: ['Sikanderpur', 'Phase 2', 'Cyber City', 'Moulsari Avenue'], impact: 'IT corridor premium — 10-15%' },
  { line: 'Metro Phase 2 Extension', status: 'Planned 2028', stations: ['Hero Honda Chowk', 'Sector 10', 'Sector 37'], impact: '+25-30% once announced' },
];

export default function InfraView() {
  const [tab, setTab] = useState('corridors');
  const [selected, setSelected] = useState(CORRIDORS[0]);

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">🚇</div>
        <div>
          <h1>Infrastructure Intelligence</h1>
          <p>Metro, highways, growth corridors & appreciation forecasting</p>
        </div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="os-tabs">
        {['corridors', 'metro', 'forecast'].map(t => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'corridors' && '🛣️ Growth Corridors'}
            {t === 'metro' && '🚇 Metro Lines'}
            {t === 'forecast' && '📈 Appreciation Map'}
          </button>
        ))}
      </div>

      {tab === 'corridors' && (
        <div className="infra-corridors-layout">
          <div className="infra-list">
            {CORRIDORS.map((c, i) => (
              <div key={i} className={`infra-corridor-card ${selected?.name === c.name ? 'selected' : ''}`}
                onClick={() => setSelected(c)}>
                <div className="icc-dot" style={{ background: c.color }} />
                <div className="icc-body">
                  <h4>{c.name}</h4>
                  <p>{c.type}</p>
                </div>
                <span className={`icc-status ${c.status === 'Operational' ? 'op' : 'dev'}`}>{c.status}</span>
              </div>
            ))}
          </div>
          {selected && (
            <div className="infra-detail-panel">
              <h3>{selected.name}</h3>
              <div className="idp-impact" style={{ color: selected.color }}>📈 {selected.impact}</div>
              <div className="idp-info">
                <div><label>Type</label><p>{selected.type}</p></div>
                <div><label>Status</label><p>{selected.status}</p></div>
              </div>
              <div className="idp-zones">
                <h4>Impact Zones</h4>
                {selected.zone.map((z, i) => (
                  <span key={i} className="idp-zone-chip">{z}</span>
                ))}
              </div>
              <button className="os-btn-primary" style={{ marginTop: 16, width: '100%' }}>
                View Properties in This Corridor
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'metro' && (
        <div className="infra-metro-list">
          {METRO_LINES.map((m, i) => (
            <div key={i} className="infra-metro-card">
              <div className="imc-header">
                <h3>{m.line}</h3>
                <span className={`imc-status ${m.status === 'Operational' ? 'op' : 'plan'}`}>{m.status}</span>
              </div>
              <div className="imc-stations">
                {m.stations.map((s, j) => (
                  <span key={j} className="imc-station">{j > 0 && '→ '}{s}</span>
                ))}
              </div>
              <div className="imc-impact">💡 {m.impact}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'forecast' && (
        <div className="infra-forecast">
          <div className="infra-forecast-grid">
            {[
              { area: 'Dwarka Expressway', now: 8500, y1: 10200, y3: 13500, growth: '59%' },
              { area: 'Sector 77 SPR', now: 19500, y1: 22000, y3: 27000, growth: '38%' },
              { area: 'Golf Course Ext.', now: 14000, y1: 16500, y3: 21000, growth: '50%' },
              { area: 'Sohna Road', now: 6500, y1: 7800, y3: 10500, growth: '62%' },
              { area: 'Manesar', now: 4200, y1: 5100, y3: 7200, growth: '71%' },
              { area: 'Cyber City', now: 22000, y1: 24000, y3: 28500, growth: '30%' },
            ].map((a, i) => (
              <div key={i} className="infra-forecast-card">
                <h4>{a.area}</h4>
                <div className="ifc-current">₹{a.now.toLocaleString()}/sqft</div>
                <div className="ifc-projections">
                  <div><span>1Y</span><strong>₹{a.y1.toLocaleString()}</strong></div>
                  <div><span>3Y</span><strong>₹{a.y3.toLocaleString()}</strong></div>
                </div>
                <div className="ifc-growth">📈 +{a.growth} over 3 years</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
