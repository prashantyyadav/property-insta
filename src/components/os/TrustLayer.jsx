import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../hooks/useToast';

const MOCK_BUILDERS = [
  { name: 'DLF Limited', rera: 'HR/RERA/GUR/2025/301', score: 96, projects: 42, verified: true, litigations: 0 },
  { name: 'Godrej Properties', rera: 'HR/RERA/GUR/2025/302', score: 94, projects: 38, verified: true, litigations: 1 },
  { name: 'M3M India', rera: 'HR/RERA/GUR/2024/189', score: 88, projects: 29, verified: true, litigations: 2 },
  { name: 'Emaar India', rera: 'HR/RERA/GUR/2025/412', score: 91, projects: 18, verified: true, litigations: 0 },
  { name: 'Signature Global', rera: 'HR/RERA/GUR/2024/221', score: 82, projects: 22, verified: true, litigations: 3 },
  { name: 'Supertech Ltd', rera: 'NOT REGISTERED', score: 34, projects: 15, verified: false, litigations: 47 },
];

const OWNERSHIP_STEPS = [
  { step: 1, title: 'Upload Sale Deed', desc: 'Upload the latest sale deed or title document' },
  { step: 2, title: 'Identity Verification', desc: 'KYC via Aadhaar or PAN card matching' },
  { step: 3, title: 'Land Record Check', desc: 'Automated check against state land records' },
  { step: 4, title: 'Encumbrance Certificate', desc: 'Verify property is free of loans & liens' },
  { step: 5, title: 'Trust Score Generated', desc: 'Composite score issued with blockchain proof' },
];

function ScoreRing({ score, size = 72 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 85 ? '#059669' : score >= 60 ? '#D97706' : '#DC2626';
  return (
    <svg width={size} height={size} className="trust-score-ring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fill={color} fontSize="16" fontWeight="700">{score}</text>
    </svg>
  );
}

export default function TrustLayer() {
  const { allProperties } = useApp();
  const toast = useToast();
  const [reraInput, setReraInput] = useState('');
  const [reraResult, setReraResult] = useState(null);
  const [tab, setTab] = useState('rera');
  const [stepsDone, setStepsDone] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  const checkRERA = () => {
    if (!reraInput.trim()) { toast('Please enter a RERA registration number', 'warning'); return; }
    const found = MOCK_BUILDERS.find(b => b.rera.toLowerCase() === reraInput.trim().toLowerCase());
    setReraResult(found || { name: 'Unknown', rera: reraInput, score: 0, verified: false, litigations: 0, notFound: true });
  };

  const handleStepStart = (stepNum, stepTitle) => {
    if (stepNum === 1) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.jpg,.png';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setUploadedFiles(prev => ({ ...prev, [stepNum]: file.name }));
          setStepsDone(prev => ({ ...prev, [stepNum]: true }));
          toast(`✓ ${file.name} uploaded successfully`, 'success');
        }
      };
      input.click();
    } else if (stepNum === 2) {
      setTimeout(() => {
        setStepsDone(prev => ({ ...prev, [stepNum]: true }));
        toast('Identity verified via Aadhaar OTP', 'success');
      }, 1000);
      toast('Sending OTP to registered mobile…', 'info');
    } else if (stepNum <= 4) {
      setTimeout(() => {
        setStepsDone(prev => ({ ...prev, [stepNum]: true }));
        toast(`${stepTitle} completed successfully`, 'success');
      }, 1500);
      toast(`Running ${stepTitle}…`, 'info');
    } else {
      const allPrev = [1, 2, 3, 4].every(s => stepsDone[s]);
      if (!allPrev) {
        toast('Complete all previous steps first', 'warning');
        return;
      }
      setTimeout(() => {
        setStepsDone(prev => ({ ...prev, [stepNum]: true }));
        toast('Trust Score generated: 91/100 — Property Verified ✓', 'success', 5000);
      }, 2000);
      toast('Generating Trust Score…', 'info');
    }
  };

  const verifiedProps = allProperties.filter(p => p.verified).length;
  const reraProps = allProperties.filter(p => p.rera).length;

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">🛡️</div>
        <div>
          <h1>Trust Layer</h1>
          <p>Ownership verification, RERA checks, builder scores & legal compliance</p>
        </div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="trust-stats-row">
        <div className="trust-stat-card green"><span className="tsc-num">{verifiedProps}</span><span className="tsc-lbl">Verified Properties</span></div>
        <div className="trust-stat-card blue"><span className="tsc-num">{reraProps}</span><span className="tsc-lbl">RERA Registered</span></div>
        <div className="trust-stat-card purple"><span className="tsc-num">{MOCK_BUILDERS.filter(b => b.verified).length}</span><span className="tsc-lbl">Verified Builders</span></div>
        <div className="trust-stat-card red"><span className="tsc-num">3</span><span className="tsc-lbl">Flagged Listings</span></div>
      </div>

      <div className="os-tabs">
        {['rera', 'builders', 'ownership'].map(t => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'rera' && '📋 RERA Checker'}
            {t === 'builders' && '🏗️ Builder Scores'}
            {t === 'ownership' && '🔏 Ownership Check'}
          </button>
        ))}
      </div>

      {tab === 'rera' && (
        <div className="trust-rera-panel">
          <div className="trust-search-box">
            <h3>RERA Registration Verifier</h3>
            <p>Enter a RERA registration number to verify builder, project status & complaints</p>
            <div className="trust-input-row">
              <input type="text" placeholder="e.g. HR/RERA/GUR/2025/301"
                value={reraInput} onChange={e => setReraInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkRERA()} />
              <button className="os-btn-primary" onClick={checkRERA}>Verify</button>
            </div>
            {reraResult && (
              <div className={`trust-result ${reraResult.notFound ? 'not-found' : reraResult.verified ? 'verified' : 'flagged'}`}>
                {reraResult.notFound ? (
                  <p>⚠️ No registration found for "{reraInput}". This property may not be RERA registered.</p>
                ) : (
                  <div className="trust-result-content">
                    <ScoreRing score={reraResult.score} />
                    <div>
                      <h4>{reraResult.name}</h4>
                      <p>RERA ID: <code>{reraResult.rera}</code></p>
                      <p>Projects: {reraResult.projects} | Litigations: {reraResult.litigations}</p>
                      <span className={`trust-pill ${reraResult.verified ? 'green' : 'red'}`}>
                        {reraResult.verified ? '✓ Verified & Compliant' : '✗ Not Compliant'}
                      </span>
                      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                        <button className="os-btn-outline small" onClick={() => toast('Certificate downloaded', 'success')}>Download Certificate</button>
                        <button className="os-btn-outline small" onClick={() => toast('Full report sent to your email', 'info')}>Email Report</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'builders' && (
        <div className="trust-builders-list">
          {MOCK_BUILDERS.map(b => (
            <div key={b.rera} className="trust-builder-row">
              <ScoreRing score={b.score} size={56} />
              <div className="tbr-info">
                <h4>{b.name}</h4>
                <span className="tbr-rera">{b.rera}</span>
              </div>
              <div className="tbr-meta">
                <span>{b.projects} projects</span>
                <span className={b.litigations > 5 ? 'red' : b.litigations > 0 ? 'amber' : 'green'}>
                  {b.litigations} litigations
                </span>
              </div>
              <span className={`trust-pill ${b.verified ? 'green' : 'red'}`}>{b.verified ? '✓ Verified' : '✗ Flagged'}</span>
              <button className="os-btn-outline small" onClick={() => toast(`Full report for ${b.name} opened`, 'info')}>View Report</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'ownership' && (
        <div className="trust-ownership-panel">
          <div className="trust-steps">
            {OWNERSHIP_STEPS.map(s => (
              <div key={s.step} className={`trust-step ${stepsDone[s.step] ? 'done' : ''}`}>
                <div className="ts-num" style={stepsDone[s.step] ? { background: '#059669' } : {}}>{stepsDone[s.step] ? '✓' : s.step}</div>
                <div className="ts-body">
                  <h4>{s.title}</h4>
                  <p>{s.desc}{uploadedFiles[s.step] ? ` — ${uploadedFiles[s.step]}` : ''}</p>
                </div>
                {stepsDone[s.step]
                  ? <span style={{ color: '#059669', fontWeight: 700 }}>Done ✓</span>
                  : <button className="os-btn-primary small" onClick={() => handleStepStart(s.step, s.title)}>Start</button>
                }
              </div>
            ))}
          </div>
          {Object.keys(stepsDone).length === 5 && (
            <div className="trust-coming-note" style={{ background: '#F0FDF4', borderColor: '#BBF7D0', color: '#059669' }}>
              🎉 All checks complete! Trust Score: 91/100 — Property is Verified
            </div>
          )}
          {Object.keys(stepsDone).length < 5 && (
            <div className="trust-coming-note">
              🔜 Government API integrations (DLRS, Sub-Registrar) launching Q3 2026
            </div>
          )}
        </div>
      )}
    </div>
  );
}
