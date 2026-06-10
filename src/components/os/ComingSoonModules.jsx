import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { useApp } from '../../context/AppContext';

function ModuleShell({ icon, title, desc, badge = 'Coming Soon', eta, features }) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const joinWaitlist = () => {
    if (!email || !email.includes('@')) { toast('Please enter a valid email', 'warning'); return; }
    setJoined(true);
    toast(`You're on the waitlist for ${title}! We'll notify you at ${email}`, 'success', 5000);
    setEmail('');
  };

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">{icon}</div>
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
        <span className={`os-module-badge ${badge === 'Coming Soon' ? 'coming' : 'beta'}`}>{badge}</span>
      </div>

      {eta && (
        <div className="cs-eta-banner">
          🗓️ <strong>Estimated Launch:</strong> {eta}
        </div>
      )}

      <div className="cs-features-grid">
        {features.map((f, i) => (
          <div key={i} className="cs-feature-card">
            <span className="csfc-icon">{f.icon}</span>
            <div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="cs-waitlist">
        {joined ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h3 style={{ color: '#fff', margin: '0 0 8px' }}>You're on the list!</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>We'll notify you as soon as {title} launches.</p>
          </div>
        ) : (
          <>
            <h3>Join the Waitlist</h3>
            <p>Be the first to access this module when it launches.</p>
            <div className="cs-waitlist-form">
              <input type="email" placeholder="Enter your email…" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && joinWaitlist()} />
              <button onClick={joinWaitlist}>Notify Me</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function InvestmentView() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const OPPORTUNITIES = [
    { name: 'DLF Privana — Fractional', type: 'Residential', minInvest: 1000000, yield: '8.2%', appreciation: '14% YoY', status: 'Open' },
    { name: 'Cyber City Office Space', type: 'Commercial', minInvest: 500000, yield: '9.5%', appreciation: '10% YoY', status: 'Open' },
    { name: 'Logistic Park, IMT Manesar', type: 'Warehouse', minInvest: 2000000, yield: '11%', appreciation: '12% YoY', status: 'Filling Fast' },
  ];

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">📈</div>
        <div><h1>Investment Layer</h1><p>Fractional ownership, rental yield marketplace & commercial investments</p></div>
        <span className="os-module-badge coming">Coming Soon</span>
      </div>
      <div className="cs-eta-banner">🗓️ <strong>Estimated Launch:</strong> Q3 2026</div>

      <h3 style={{ color: 'var(--os-text)', margin: '0 0 16px' }}>Preview — Available Opportunities</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {OPPORTUNITIES.map((o, i) => (
          <div key={i} style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)', borderRadius: 12, padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <h4 style={{ margin: 0, color: 'var(--os-text)' }}>{o.name}</h4>
                <span style={{ background: '#DBEAFE', color: '#1D4ED8', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{o.type}</span>
                {o.status === 'Filling Fast' && <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>🔥 {o.status}</span>}
              </div>
              <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--os-muted)' }}>
                <span>Min: ₹{(o.minInvest / 100000).toFixed(0)}L</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>Yield: {o.yield} p.a.</span>
                <span>Appreciation: {o.appreciation}</span>
              </div>
            </div>
            <button className="os-btn-primary" onClick={() => toast(`Added to wishlist — launches Q3 2026`, 'info')}>Invest Now</button>
          </div>
        ))}
      </div>

      <div className="cs-waitlist">
        {joined ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h3 style={{ color: '#fff', margin: 0 }}>You're on the investor waitlist!</h3>
          </div>
        ) : (
          <>
            <h3>Join Investor Waitlist</h3>
            <p>Get early access to fractional investment opportunities.</p>
            <div className="cs-waitlist-form">
              <input type="email" placeholder="Enter your email…" value={email} onChange={e => setEmail(e.target.value)} />
              <button onClick={() => { if (!email.includes('@')) { toast('Enter valid email', 'warning'); return; } setJoined(true); toast('You\'re on the investor waitlist!', 'success'); }}>Notify Me</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function RentalView() {
  return <ModuleShell icon="🏘️" title="Rental Ecosystem" desc="Tenant app, rent collection, maintenance requests & landlord-tenant communication" eta="Q4 2026"
    features={[
      { icon: '👤', title: 'Tenant Portal', desc: 'Tenants manage rent, requests & communications' },
      { icon: '💳', title: 'Auto Rent Collection', desc: 'UPI mandate for zero-effort monthly rent' },
      { icon: '🔧', title: 'Maintenance Requests', desc: 'Log, track and resolve maintenance issues' },
      { icon: '📋', title: 'Digital Lease', desc: 'E-sign rental agreements with Aadhaar authentication' },
      { icon: '📊', title: 'Rent Analytics', desc: 'Benchmark rent against market, track yield' },
      { icon: '⭐', title: 'Tenant Rating', desc: 'Build verified rental history for tenants' },
    ]} />;
}

export function SocietyOSView() {
  return <ModuleShell icon="🏢" title="Society OS" desc="Visitor management, maintenance billing, complaints & security" eta="Q4 2026"
    features={[
      { icon: '🔐', title: 'Visitor Management', desc: 'Digital gate passes, QR codes & visitor logs' },
      { icon: '💰', title: 'Maintenance Billing', desc: 'Automated billing, collection & accounting' },
      { icon: '📢', title: 'Complaints System', desc: 'Raise, track & resolve society complaints' },
      { icon: '📅', title: 'Facility Booking', desc: 'Book clubhouse, parking & amenities online' },
      { icon: '🛡️', title: 'Security Dashboard', desc: 'CCTV feeds, guard tracking & incident logs' },
      { icon: '💬', title: 'Community Chat', desc: 'Society-wide announcements & group chats' },
    ]} />;
}

export function BuilderERPView() {
  return <ModuleShell icon="🏗️" title="Builder ERP" desc="Inventory management, bookings, collections, construction progress & CRM" eta="Q2 2026"
    features={[
      { icon: '🏢', title: 'Inventory Management', desc: 'Tower-wise, floor-wise unit tracking with pricing' },
      { icon: '📋', title: 'Booking Management', desc: 'Digital booking forms, token collection & allotment' },
      { icon: '💰', title: 'Collection Dashboard', desc: 'CLP tracking, demand letters & payment reconciliation' },
      { icon: '🏗️', title: 'Construction Tracker', desc: 'Milestone updates, photos & RERA progress reports' },
      { icon: '👥', title: 'Customer CRM', desc: 'Buyer communication, query management & escalations' },
      { icon: '📊', title: 'Sales Analytics', desc: 'Real-time sales velocity, pricing intelligence & CP analytics' },
    ]} />;
}

export function PropertyMgmtView() {
  return <ModuleShell icon="🔑" title="Property Management" desc="Tenant screening, inspections, maintenance & complete lease management" eta="Q4 2026"
    features={[
      { icon: '🔍', title: 'Tenant Screening', desc: 'Background, employment & reference verification' },
      { icon: '🔧', title: 'Maintenance Management', desc: 'Vendor coordination, inspection scheduling' },
      { icon: '📋', title: 'Lease Management', desc: 'Full lease lifecycle from drafting to renewal' },
      { icon: '💰', title: 'Rent Accounting', desc: 'Income tracking, expense management & P&L' },
      { icon: '📊', title: 'Portfolio Analytics', desc: 'Yield, occupancy & maintenance cost analytics' },
      { icon: '🏢', title: 'Multi-Property Dashboard', desc: 'Manage 1 to 1000+ properties from one screen' },
    ]} />;
}

export function LocalCommerceView() {
  return <ModuleShell icon="🛒" title="Local Commerce" desc="Interiors, movers, contractors, electricians & home services marketplace" eta="Q1 2027"
    features={[
      { icon: '🛋️', title: 'Interior Design', desc: 'Connect with verified interior designers, get 3D renders' },
      { icon: '🚚', title: 'Packers & Movers', desc: 'Verified movers with transparent pricing' },
      { icon: '🔌', title: 'Home Services', desc: 'Electricians, plumbers, carpenters on demand' },
      { icon: '🏗️', title: 'Renovation', desc: 'End-to-end renovation management' },
      { icon: '🔒', title: 'Smart Home', desc: 'Installation of smart locks, cameras & automation' },
      { icon: '🌱', title: 'Vastu & Architecture', desc: 'Certified Vastu consultants and architects' },
    ]} />;
}

export function SocialView() {
  return <ModuleShell icon="💬" title="RE Social Network" desc="Follow builders, projects & localities — share reviews, news & insights" eta="Q2 2027"
    features={[
      { icon: '🏗️', title: 'Follow Builders', desc: 'Get updates on projects, launches & offers' },
      { icon: '🏘️', title: 'Follow Localities', desc: 'Stay updated on your preferred neighbourhoods' },
      { icon: '⭐', title: 'Property Reviews', desc: 'Verified buyer reviews for builders and projects' },
      { icon: '📰', title: 'RE News Feed', desc: 'Curated real estate news, policy updates & market moves' },
      { icon: '💼', title: 'Professional Network', desc: 'Connect with brokers, builders and investors' },
      { icon: '🎯', title: 'Deal Alerts', desc: 'Price drops, new launches & open houses from followed projects' },
    ]} />;
}

export function GovIntView() {
  return <ModuleShell icon="🏛️" title="Government Integrations" desc="RERA, land records, municipal records & property tax systems" eta="Q3 2027 (Regulatory Approvals Required)"
    features={[
      { icon: '📋', title: 'RERA Integration', desc: 'Live sync with state RERA portals across India' },
      { icon: '🗺️', title: 'Land Records', desc: 'Direct access to Jamabandi, Khasra, Khatauni records' },
      { icon: '🏙️', title: 'Municipal Records', desc: 'Building plans, OC, CC from municipal corporations' },
      { icon: '💰', title: 'Property Tax', desc: 'View outstanding taxes, pay online, download receipts' },
      { icon: '📝', title: 'Registry Integration', desc: 'Stamp duty calculation & sub-registrar slot booking' },
      { icon: '🔒', title: 'DigiLocker Sync', desc: 'One-click property documents from DigiLocker' },
    ]} />;
}

export function AIExchangeView() {
  return <ModuleShell icon="✨" title="AI Property Exchange" desc="Fully personalized property, financing, investment & exit planning — AI-orchestrated" eta="Q4 2027"
    features={[
      { icon: '🎯', title: 'Hyper-Personalization', desc: 'AI matches properties based on lifestyle, commute, family needs & budget' },
      { icon: '💰', title: 'Financing Orchestration', desc: 'Auto-applies to best-fit lenders based on profile' },
      { icon: '📈', title: 'Investment Optimization', desc: 'Portfolio allocation across property types and geographies' },
      { icon: '🚪', title: 'Exit Planning', desc: 'Optimal time-to-sell prediction with tax efficiency' },
      { icon: '🤝', title: 'Auto Deal Room', desc: 'AI negotiates on your behalf within defined parameters' },
      { icon: '🌐', title: 'Global NRI Platform', desc: 'End-to-end property management for NRIs from anywhere in the world' },
    ]} />;
}
