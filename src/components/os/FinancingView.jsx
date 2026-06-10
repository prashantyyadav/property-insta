import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

const LENDERS = [
  { name: 'HDFC Bank', rate: 8.50, maxLoan: 50000000, processing: 10000, time: '7 days', logo: '🏦' },
  { name: 'SBI', rate: 8.40, maxLoan: 75000000, processing: 5000, time: '10 days', logo: '🏛️' },
  { name: 'ICICI Bank', rate: 8.65, maxLoan: 40000000, processing: 8500, time: '5 days', logo: '💳' },
  { name: 'Axis Bank', rate: 8.75, maxLoan: 35000000, processing: 7500, time: '6 days', logo: '🔷' },
  { name: 'Kotak Mahindra', rate: 8.85, maxLoan: 30000000, processing: 12000, time: '8 days', logo: '🔴' },
  { name: 'LIC Housing', rate: 8.35, maxLoan: 20000000, processing: 3000, time: '14 days', logo: '📋' },
];

function calcEMI(principal, rate, months) {
  const r = rate / 100 / 12;
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}

export default function FinancingView() {
  const toast = useToast();
  const [income, setIncome] = useState(200000);
  const [propPrice, setPropPrice] = useState(10000000);
  const [downPct, setDownPct] = useState(20);
  const [tenure, setTenure] = useState(20);
  const [tab, setTab] = useState('eligibility');
  const [applyModal, setApplyModal] = useState(null);
  const [applyStep, setApplyStep] = useState(0);
  const [form, setForm] = useState({ name: '', pan: '', employment: 'Salaried', income2: '' });

  const loanAmt = propPrice * (1 - downPct / 100);
  const maxEligible = income * 60;
  const eligible = Math.min(loanAmt, maxEligible);
  const emi = calcEMI(eligible, 8.5, tenure * 12);
  const totalPayable = emi * tenure * 12;
  const totalInterest = totalPayable - eligible;

  const startApply = (lender) => {
    setApplyModal(lender);
    setApplyStep(0);
  };

  const nextStep = () => {
    if (applyStep === 0 && (!form.name || !form.pan)) { toast('Please fill all required fields', 'warning'); return; }
    if (applyStep < 4) {
      setApplyStep(s => s + 1);
      if (applyStep === 3) {
        setTimeout(() => {
          toast(`🎉 In-principle approval from ${applyModal.name} — ₹${Math.round(eligible / 100000)}L at ${applyModal.rate}%`, 'success', 6000);
          setApplyModal(null);
          setApplyStep(0);
        }, 1500);
        toast('Processing application…', 'info');
      }
    }
  };

  const APPLY_STEPS = ['Basic Details', 'KYC & Documents', 'Property Info', 'Review & Submit', 'Approval'];

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">🏦</div>
        <div><h1>Financing Layer</h1><p>Loan eligibility, lender marketplace & real-time approval tracking</p></div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="os-tabs">
        {['eligibility', 'lenders', 'apply'].map(t => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'eligibility' && '📊 Eligibility Calculator'}
            {t === 'lenders' && '🏦 Lender Marketplace'}
            {t === 'apply' && '📝 Track Applications'}
          </button>
        ))}
      </div>

      {tab === 'eligibility' && (
        <div className="fin-calc-layout">
          <div className="fin-inputs">
            <h3>Eligibility Calculator</h3>
            <label>Monthly Income (₹)</label>
            <input type="number" value={income} onChange={e => setIncome(+e.target.value)} />
            <label>Property Price (₹)</label>
            <input type="number" value={propPrice} onChange={e => setPropPrice(+e.target.value)} />
            <label>Down Payment: {downPct}%</label>
            <input type="range" min={10} max={50} value={downPct} onChange={e => setDownPct(+e.target.value)} />
            <label>Loan Tenure: {tenure} years</label>
            <input type="range" min={5} max={30} value={tenure} onChange={e => setTenure(+e.target.value)} />
            <button className="os-btn-primary" style={{ marginTop: 12 }} onClick={() => setTab('lenders')}>Compare Lenders →</button>
          </div>
          <div className="fin-results">
            <div className="fin-result-card primary"><span>Max Loan Eligible</span><h2>₹{Math.round(eligible / 100000)}L</h2></div>
            <div className="fin-result-card"><span>Monthly EMI</span><h3>₹{emi.toLocaleString()}</h3></div>
            <div className="fin-result-card"><span>Down Payment</span><h3>₹{Math.round(propPrice * downPct / 100 / 100000)}L</h3></div>
            <div className="fin-result-card"><span>Total Interest</span><h3>₹{Math.round(totalInterest / 100000)}L</h3></div>
            <div className="fin-result-card"><span>Total Payable</span><h3>₹{Math.round(totalPayable / 100000)}L</h3></div>
            <div className="fin-result-card green"><span>EMI / Income</span><h3>{Math.round((emi / income) * 100)}%</h3></div>
          </div>
        </div>
      )}

      {tab === 'lenders' && (
        <div className="fin-lenders">
          <div className="fin-lenders-header"><p>Showing rates for ₹{Math.round(eligible / 100000)}L loan · {tenure} years tenure</p></div>
          {[...LENDERS].sort((a, b) => a.rate - b.rate).map((l, i) => (
            <div key={i} className={`fin-lender-row ${i === 0 ? 'best' : ''}`}>
              {i === 0 && <span className="fin-best-badge">Best Rate</span>}
              <div className="flr-logo">{l.logo}</div>
              <div className="flr-name">{l.name}</div>
              <div className="flr-rate"><span className="flr-rate-num">{l.rate}%</span><span>p.a.</span></div>
              <div className="flr-emi"><span>EMI: ₹{calcEMI(eligible, l.rate, tenure * 12).toLocaleString()}/mo</span></div>
              <div className="flr-time">⏱ {l.time}</div>
              <button className="os-btn-primary small" onClick={() => startApply(l)}>Apply</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'apply' && (
        <div className="fin-apply">
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--os-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <h3 style={{ color: 'var(--os-text)', margin: '0 0 8px' }}>No active applications</h3>
            <p>Apply to lenders from the marketplace and track your applications here.</p>
            <button className="os-btn-primary" style={{ marginTop: 16 }} onClick={() => setTab('lenders')}>Browse Lenders</button>
          </div>
        </div>
      )}

      {applyModal && (
        <div className="os-modal-backdrop" onClick={() => setApplyModal(null)}>
          <div className="os-modal" onClick={e => e.stopPropagation()}>
            <div className="os-modal-header">
              <h3>Apply — {applyModal.name} · {applyModal.rate}% p.a.</h3>
              <button onClick={() => setApplyModal(null)}>✕</button>
            </div>
            <div className="os-modal-body">
              <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                {APPLY_STEPS.slice(0, 4).map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ height: 4, borderRadius: 2, background: i <= applyStep ? 'var(--os-accent)' : 'var(--os-border)', marginBottom: 4 }} />
                    <span style={{ fontSize: 10, color: i <= applyStep ? 'var(--os-accent)' : 'var(--os-muted)' }}>{s}</span>
                  </div>
                ))}
              </div>
              {applyStep === 0 && <>
                <div className="os-form-row">
                  <div><label>Full Name *</label><input placeholder="Arjun Sharma" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoFocus /></div>
                  <div><label>PAN Number *</label><input placeholder="ABCDE1234F" value={form.pan} onChange={e => setForm(p => ({ ...p, pan: e.target.value.toUpperCase() }))} /></div>
                </div>
                <div className="os-form-row">
                  <div><label>Employment</label>
                    <select value={form.employment} onChange={e => setForm(p => ({ ...p, employment: e.target.value }))}>
                      <option>Salaried</option><option>Self-Employed</option><option>Business</option>
                    </select>
                  </div>
                  <div><label>Monthly Income (₹)</label><input type="number" value={income} onChange={e => setIncome(+e.target.value)} /></div>
                </div>
              </>}
              {applyStep === 1 && <>
                <p style={{ color: 'var(--os-muted)', fontSize: 14 }}>Upload the following documents:</p>
                {['Aadhaar Card', 'PAN Card', '3 months Bank Statement', '3 months Salary Slips'].map((doc, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--os-border)' }}>
                    <span style={{ fontSize: 14 }}>{doc}</span>
                    <button className="os-btn-outline small" onClick={() => toast(`${doc} uploaded`, 'success')}>Upload</button>
                  </div>
                ))}
              </>}
              {applyStep === 2 && <>
                <div><label>Property Address</label><input placeholder="Sector 77, Gurugram, Haryana" /></div>
                <div><label>Property Value (₹)</label><input type="number" value={propPrice} onChange={e => setPropPrice(+e.target.value)} /></div>
                <div><label>Loan Amount Required (₹)</label><input type="number" value={Math.round(eligible)} readOnly /></div>
              </>}
              {applyStep === 3 && (
                <div style={{ padding: '8px 0' }}>
                  <div style={{ background: 'var(--os-bg)', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                    {[['Lender', applyModal.name], ['Interest Rate', `${applyModal.rate}% p.a.`], ['Loan Amount', `₹${Math.round(eligible / 100000)}L`], ['Tenure', `${tenure} years`], ['Monthly EMI', `₹${calcEMI(eligible, applyModal.rate, tenure * 12).toLocaleString()}`], ['Processing Fee', `₹${applyModal.processing.toLocaleString()}`]].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--os-muted)' }}>{k}</span>
                        <strong style={{ color: 'var(--os-text)' }}>{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="os-modal-footer">
              <button className="os-btn-outline" onClick={() => applyStep > 0 ? setApplyStep(s => s - 1) : setApplyModal(null)}>
                {applyStep > 0 ? '← Back' : 'Cancel'}
              </button>
              <button className="os-btn-primary" onClick={nextStep}>
                {applyStep < 3 ? 'Next →' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
