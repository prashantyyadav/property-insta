import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

const INTEGRATIONS = [
  { id: 'rera', name: 'RERA Portal', desc: 'Project registration & builder compliance', icon: '📋', status: 'Connected', records: '12,400+' },
  { id: 'land', name: 'Land Records (DLRS)', desc: 'Jamabandi, Khasra, Khatauni records', icon: '🗺️', status: 'Connected', records: '8,200+' },
  { id: 'municipal', name: 'Municipal Records', desc: 'Building plans, OC, CC certificates', icon: '🏙️', status: 'Connected', records: '5,600+' },
  { id: 'tax', name: 'Property Tax (MCG)', desc: 'Tax dues, payment history, receipts', icon: '💰', status: 'Connected', records: '15,800+' },
  { id: 'digilocker', name: 'DigiLocker', desc: 'Verified property documents', icon: '🔒', status: 'Connected', records: 'Live' },
  { id: 'registry', name: 'Sub-Registrar Office', desc: 'Stamp duty & slot booking', icon: '📝', status: 'Beta', records: 'Live' },
];

export default function GovIntView() {
  const toast = useToast();
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(null);
  const [taxPaid, setTaxPaid] = useState(false);

  const lookupLand = () => {
    if (!search.trim()) { toast('Enter a Khasra/survey number or address', 'warning'); return; }
    setResult({
      khasra: search.trim(), owner: 'Rajiv Mehta', area: '4,200 sq.ft', landUse: 'Residential',
      encumbrance: 'None', mutation: 'Updated 2023', registry: 'HR/SR/GGN/2023/14502',
    });
    toast('Land record fetched from DLRS', 'success');
  };

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">🏛️</div>
        <div><h1>Government Integrations</h1><p>RERA, land records, municipal records & property tax systems</p></div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="os-tabs">
        {[['overview', '🔗 Integrations'], ['land', '🗺️ Land Records'], ['tax', '💰 Property Tax']].map(([t, l]) => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="os-module-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {INTEGRATIONS.map(int => (
            <div key={int.id} className="govint-card">
              <div style={{ fontSize: 32 }}>{int.icon}</div>
              <div className="gic-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4>{int.name}</h4>
                  <span className={`trust-pill ${int.status === 'Connected' ? 'green' : 'amber'} small`}>● {int.status}</span>
                </div>
                <p>{int.desc}</p>
                <span className="gic-records">{int.records} records synced</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'land' && (
        <div className="trust-search-box">
          <h3>Land Record Lookup</h3>
          <p>Search official land records via the Digital Land Records System (DLRS)</p>
          <div className="trust-input-row">
            <input placeholder="Khasra No. / Survey No. / Address" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookupLand()} />
            <button className="os-btn-primary" onClick={lookupLand}>Fetch Record</button>
          </div>
          {result && (
            <div className="trust-result verified" style={{ marginTop: 20 }}>
              <div className="passport-info-grid" style={{ marginBottom: 0 }}>
                <div><label>Khasra / Survey</label><p>{result.khasra}</p></div>
                <div><label>Registered Owner</label><p>{result.owner}</p></div>
                <div><label>Area</label><p>{result.area}</p></div>
                <div><label>Land Use</label><p>{result.landUse}</p></div>
                <div><label>Encumbrance</label><p style={{ color: '#059669' }}>{result.encumbrance}</p></div>
                <div><label>Mutation</label><p>{result.mutation}</p></div>
              </div>
              <button className="os-btn-outline small" style={{ marginTop: 12 }} onClick={() => toast('Certified copy downloaded', 'success')}>Download Certified Copy</button>
            </div>
          )}
        </div>
      )}

      {tab === 'tax' && (
        <div className="rental-rent-panel">
          <div className={`rental-rent-card ${taxPaid ? 'paid' : ''}`}>
            <div className="rrc-head"><span>Property Tax — FY 2025-26</span>{taxPaid ? <span className="trust-pill green">✓ Paid</span> : <span className="trust-pill red">Outstanding</span>}</div>
            <div className="rrc-amount">₹56,000</div>
            <p className="rrc-unit">Flat 1204, DLF Privana · PID: MCG-GGN-77-1204 · MCG</p>
            {!taxPaid ? <button className="os-btn-primary" style={{ width: '100%' }} onClick={() => { setTaxPaid(true); toast('Property tax ₹56,000 paid to MCG — receipt generated', 'success', 5000); }}>Pay Property Tax</button>
              : <button className="os-btn-outline" style={{ width: '100%' }} onClick={() => toast('Tax receipt downloaded', 'success')}>Download Receipt</button>}
          </div>
          <div className="rental-history">
            <h4>Tax Payment History</h4>
            {[['2024-25', 52000], ['2023-24', 48000], ['2022-23', 45000]].map(([y, amt], i) => (
              <div key={i} className="rental-hist-row"><span>FY {y}</span><span>₹{amt.toLocaleString()}</span><span className="trust-pill green small">✓ Paid</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
