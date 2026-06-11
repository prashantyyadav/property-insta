import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { formatPriceIndian } from '../../data';

const OPPORTUNITIES = [
  { id: 1, name: 'DLF Privana — Fractional', type: 'Residential', location: 'Sector 77, Gurgaon', total: 75000000, minInvest: 1000000, yield: 8.2, appreciation: 14, funded: 68, investors: 42, tenure: '5 yrs', status: 'Open' },
  { id: 2, name: 'Cyber City Grade-A Office', type: 'Commercial', location: 'DLF Cyber City', total: 120000000, minInvest: 500000, yield: 9.5, appreciation: 10, funded: 84, investors: 128, tenure: '7 yrs', status: 'Filling Fast' },
  { id: 3, name: 'Logistics Park — IMT Manesar', type: 'Warehouse', location: 'IMT Manesar', total: 95000000, minInvest: 2000000, yield: 11.0, appreciation: 12, funded: 45, investors: 23, tenure: '6 yrs', status: 'Open' },
  { id: 4, name: 'Retail High-Street, Golf Course Rd', type: 'Retail', location: 'Golf Course Road', total: 60000000, minInvest: 750000, yield: 8.8, appreciation: 11, funded: 92, investors: 76, tenure: '5 yrs', status: 'Filling Fast' },
];

const SECONDARY = [
  { id: 1, asset: 'DLF Privana — Fractional', seller: 'Investor #2841', stake: 2.5, price: 1850000, originalPrice: 1500000, gain: 23.3 },
  { id: 2, asset: 'Cyber City Office', seller: 'Investor #1203', stake: 1.0, price: 1280000, originalPrice: 1200000, gain: 6.7 },
  { id: 3, asset: 'Logistics Park', seller: 'Investor #5567', stake: 4.0, price: 8400000, originalPrice: 8000000, gain: 5.0 },
];

const MY_PORTFOLIO = [
  { asset: 'Godrej Aristocrat — Fractional', invested: 1000000, current: 1140000, yield: 8.2, stake: 1.3 },
  { asset: 'Sohna Warehouse REIT', invested: 2000000, current: 2310000, yield: 11.0, stake: 2.1 },
];

export default function InvestmentView() {
  const toast = useToast();
  const [tab, setTab] = useState('opportunities');
  const [investModal, setInvestModal] = useState(null);
  const [amount, setAmount] = useState('');
  const [portfolio, setPortfolio] = useState(MY_PORTFOLIO);

  const confirmInvest = () => {
    const amt = Number(amount);
    if (!amt || amt < investModal.minInvest) { toast(`Minimum investment is ${formatPriceIndian(investModal.minInvest)}`, 'warning'); return; }
    setPortfolio(prev => [...prev, { asset: investModal.name, invested: amt, current: amt, yield: investModal.yield, stake: +((amt / investModal.total) * 100).toFixed(2) }]);
    toast(`Invested ${formatPriceIndian(amt)} in ${investModal.name} — ${((amt / investModal.total) * 100).toFixed(2)}% stake`, 'success', 5000);
    setInvestModal(null);
    setAmount('');
  };

  const totalInvested = portfolio.reduce((s, p) => s + p.invested, 0);
  const totalCurrent = portfolio.reduce((s, p) => s + p.current, 0);
  const totalGain = totalInvested ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">📈</div>
        <div><h1>Investment Layer</h1><p>Fractional ownership, rental yield marketplace, commercial investments & secondary market</p></div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="trust-stats-row">
        <div className="trust-stat-card blue"><span className="tsc-num">{formatPriceIndian(totalInvested)}</span><span className="tsc-lbl">Total Invested</span></div>
        <div className="trust-stat-card green"><span className="tsc-num">{formatPriceIndian(totalCurrent)}</span><span className="tsc-lbl">Current Value</span></div>
        <div className="trust-stat-card purple"><span className="tsc-num">+{totalGain.toFixed(1)}%</span><span className="tsc-lbl">Total Returns</span></div>
        <div className="trust-stat-card red"><span className="tsc-num">{portfolio.length}</span><span className="tsc-lbl">Active Holdings</span></div>
      </div>

      <div className="os-tabs">
        {[['opportunities', '🏘️ Opportunities'], ['yield', '💰 Rental Yield'], ['secondary', '🔄 Secondary Market'], ['portfolio', '📊 My Portfolio']].map(([t, l]) => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {(tab === 'opportunities' || tab === 'yield') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {OPPORTUNITIES.filter(o => tab === 'opportunities' || o.yield >= 8.5).map(o => (
            <div key={o.id} className="inv-opp-card">
              <div className="inv-opp-main">
                <div className="inv-opp-head">
                  <h3>{o.name}</h3>
                  <span className={`cpic-status ${o.status === 'Filling Fast' ? 'hot' : 'avail'}`}>{o.status === 'Filling Fast' ? '🔥 Filling Fast' : 'Open'}</span>
                  <span className="inv-type-badge">{o.type}</span>
                </div>
                <p className="inv-opp-loc">📍 {o.location} · {o.tenure} tenure</p>
                <div className="inv-fund-bar"><div className="inv-fund-fill" style={{ width: `${o.funded}%` }} /></div>
                <span className="inv-fund-label">{o.funded}% funded · {o.investors} investors</span>
              </div>
              <div className="inv-opp-stats">
                <div><span className="ios-n green">{o.yield}%</span><span className="ios-l">Rental Yield</span></div>
                <div><span className="ios-n">{o.appreciation}%</span><span className="ios-l">Appreciation</span></div>
                <div><span className="ios-n">{formatPriceIndian(o.minInvest)}</span><span className="ios-l">Min Invest</span></div>
              </div>
              <button className="os-btn-primary" onClick={() => { setInvestModal(o); setAmount(String(o.minInvest)); }}>Invest Now</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'secondary' && (
        <div className="os-table-wrap">
          <div className="os-table-head" style={{ gridTemplateColumns: '2fr 1.2fr 0.8fr 1.2fr 1fr 1fr' }}>
            <span>Asset</span><span>Seller</span><span>Stake</span><span>Ask Price</span><span>Gain</span><span></span>
          </div>
          {SECONDARY.map(s => (
            <div key={s.id} className="os-table-row" style={{ gridTemplateColumns: '2fr 1.2fr 0.8fr 1.2fr 1fr 1fr' }}>
              <span style={{ fontWeight: 600 }}>{s.asset}</span>
              <span>{s.seller}</span>
              <span>{s.stake}%</span>
              <span style={{ fontWeight: 700, color: 'var(--os-accent)' }}>{formatPriceIndian(s.price)}</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>+{s.gain}%</span>
              <button className="os-btn-outline small" onClick={() => toast(`Purchase request sent for ${s.stake}% of ${s.asset}`, 'success')}>Buy Stake</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'portfolio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {portfolio.map((p, i) => {
            const gain = ((p.current - p.invested) / p.invested) * 100;
            return (
              <div key={i} className="inv-portfolio-row">
                <div className="inv-pf-info"><h4>{p.asset}</h4><span>{p.stake}% stake · {p.yield}% yield</span></div>
                <div className="inv-pf-stat"><span className="ios-l">Invested</span><strong>{formatPriceIndian(p.invested)}</strong></div>
                <div className="inv-pf-stat"><span className="ios-l">Current</span><strong>{formatPriceIndian(p.current)}</strong></div>
                <div className="inv-pf-stat"><span className="ios-l">Returns</span><strong style={{ color: gain >= 0 ? '#059669' : '#DC2626' }}>{gain >= 0 ? '+' : ''}{gain.toFixed(1)}%</strong></div>
                <button className="os-btn-outline small" onClick={() => toast(`Listed ${p.stake}% of ${p.asset} on secondary market`, 'info')}>Sell Stake</button>
              </div>
            );
          })}
        </div>
      )}

      {investModal && (
        <div className="os-modal-backdrop" onClick={() => setInvestModal(null)}>
          <div className="os-modal" onClick={e => e.stopPropagation()}>
            <div className="os-modal-header"><h3>Invest — {investModal.name}</h3><button onClick={() => setInvestModal(null)}>✕</button></div>
            <div className="os-modal-body">
              <div style={{ background: 'var(--os-bg)', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                {[['Asset Type', investModal.type], ['Rental Yield', `${investModal.yield}% p.a.`], ['Appreciation', `${investModal.appreciation}% YoY`], ['Tenure', investModal.tenure], ['Min Investment', formatPriceIndian(investModal.minInvest)]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--os-muted)' }}>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
              <div><label>Investment Amount (₹)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} autoFocus /></div>
              {amount && Number(amount) >= investModal.minInvest && (
                <div style={{ fontSize: 13, color: 'var(--os-muted)' }}>
                  You'll own <strong style={{ color: 'var(--os-accent)' }}>{((Number(amount) / investModal.total) * 100).toFixed(2)}%</strong> · Est. annual income <strong style={{ color: '#059669' }}>{formatPriceIndian(Math.round(Number(amount) * investModal.yield / 100))}</strong>
                </div>
              )}
            </div>
            <div className="os-modal-footer">
              <button className="os-btn-outline" onClick={() => setInvestModal(null)}>Cancel</button>
              <button className="os-btn-primary" onClick={confirmInvest}>Confirm Investment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
