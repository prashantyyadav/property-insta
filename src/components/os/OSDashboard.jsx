import { useApp } from '../../context/AppContext';
import { useRole } from '../../context/RoleContext';

const ALL_MODULES = [
  {
    id: 'feed',
    name: 'Property Discovery',
    desc: 'AI-powered search across Sale, Rent, PG, Commercial, Land & Warehouses',
    icon: '🔍',
    status: 'live',
    category: 'discovery',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'reels',
    name: 'Property Reels',
    desc: 'Instagram-style video tours of top listings',
    icon: '🎬',
    status: 'live',
    category: 'discovery',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'mapView',
    name: 'Map Explorer',
    desc: 'Geo-search properties with infrastructure overlay',
    icon: '🗺️',
    status: 'live',
    category: 'discovery',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'trust',
    name: 'Trust Layer',
    desc: 'Ownership verification, RERA checks, builder scores & legal status',
    icon: '🛡️',
    status: 'beta',
    category: 'trust',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'passport',
    name: 'Property Passport',
    desc: 'Digital twin with ownership history, valuation & registry documents',
    icon: '📋',
    status: 'beta',
    category: 'trust',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'transaction',
    name: 'Transaction Layer',
    desc: 'Digital deal room, offers, negotiations & documentation',
    icon: '🤝',
    status: 'beta',
    category: 'transaction',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'crm',
    name: 'Property CRM',
    desc: 'Lead management, call logs, follow-ups & WhatsApp integration',
    icon: '📊',
    status: 'beta',
    category: 'crm',
    roles: ['broker'],
  },
  {
    id: 'channelpartner',
    name: 'Channel Partner Network',
    desc: 'Inventory marketplace, lead sharing & commission tracking',
    icon: '🌐',
    status: 'beta',
    category: 'crm',
    roles: ['broker'],
  },
  {
    id: 'copilot',
    name: 'AI Copilot',
    desc: 'AI assistant for buyers, sellers, builders and investors',
    icon: '🤖',
    status: 'beta',
    category: 'ai',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'investment',
    name: 'Investment Layer',
    desc: 'Fractional ownership, rental yield marketplace & secondary market',
    icon: '📈',
    status: 'coming',
    category: 'finance',
    roles: ['buyer'],
  },
  {
    id: 'rental',
    name: 'Rental Ecosystem',
    desc: 'Tenant app, rent collection, maintenance & communication',
    icon: '🏘️',
    status: 'coming',
    category: 'manage',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'society',
    name: 'Society OS',
    desc: 'Visitor management, maintenance billing & security',
    icon: '🏢',
    status: 'coming',
    category: 'manage',
    roles: ['buyer'],
  },
  {
    id: 'propmgmt',
    name: 'Property Management',
    desc: 'Tenant screening, inspections, maintenance & lease management',
    icon: '🔑',
    status: 'coming',
    category: 'manage',
    roles: ['broker'],
  },
  {
    id: 'commerce',
    name: 'Local Commerce',
    desc: 'Interiors, movers, contractors & home services marketplace',
    icon: '🛒',
    status: 'coming',
    category: 'commerce',
    roles: ['buyer'],
  },
  {
    id: 'financing',
    name: 'Financing Layer',
    desc: 'Loan eligibility, lender marketplace & approval tracking',
    icon: '🏦',
    status: 'beta',
    category: 'finance',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'legal',
    name: 'Legal Layer',
    desc: 'Registry, agreements, due diligence & lawyer marketplace',
    icon: '⚖️',
    status: 'beta',
    category: 'trust',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'infra',
    name: 'Infrastructure Intelligence',
    desc: 'Metro, highways, growth corridors & appreciation forecasting',
    icon: '🚇',
    status: 'beta',
    category: 'data',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'datacloud',
    name: 'Real Estate Data Cloud',
    desc: 'Market intelligence, demand-supply analytics & builder insights',
    icon: '☁️',
    status: 'beta',
    category: 'data',
    roles: ['broker'],
  },
  {
    id: 'social',
    name: 'RE Social Network',
    desc: 'Follow builders, projects, localities & share reviews',
    icon: '💬',
    status: 'coming',
    category: 'community',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'govint',
    name: 'Government Integrations',
    desc: 'RERA, land records, municipal records & property tax systems',
    icon: '🏛️',
    status: 'coming',
    category: 'trust',
    roles: ['buyer', 'broker'],
  },
  {
    id: 'aiexchange',
    name: 'AI Property Exchange',
    desc: 'Personalized property, financing, investment & exit planning',
    icon: '✨',
    status: 'coming',
    category: 'ai',
    roles: ['buyer', 'broker'],
  },
];

const CATEGORIES = {
  discovery: { label: 'Discovery Engine', color: '#4F46E5' },
  trust: { label: 'Trust & Legal', color: '#059669' },
  transaction: { label: 'Transaction', color: '#D97706' },
  crm: { label: 'CRM & Partners', color: '#7C3AED' },
  ai: { label: 'AI Intelligence', color: '#DC2626' },
  finance: { label: 'Finance & Investment', color: '#0891B2' },
  manage: { label: 'Property Management', color: '#65A30D' },
  builder: { label: 'Builder Tools', color: '#EA580C' },
  commerce: { label: 'Local Commerce', color: '#DB2777' },
  data: { label: 'Data & Analytics', color: '#6366F1' },
  community: { label: 'Community', color: '#14B8A6' },
};

const STATUS_BADGE = {
  live: { label: 'Live', cls: 'status-live' },
  beta: { label: 'Beta', cls: 'status-beta' },
  coming: { label: 'Coming Soon', cls: 'status-coming' },
};

export default function OSDashboard() {
  const { setCurrentView } = useApp();
  const { role } = useRole();

  const visibleModules = ALL_MODULES.filter(m => m.roles.includes(role));

  const grouped = {};
  visibleModules.forEach(m => {
    if (!grouped[m.category]) grouped[m.category] = [];
    grouped[m.category].push(m);
  });

  const stats = {
    live: visibleModules.filter(m => m.status === 'live').length,
    beta: visibleModules.filter(m => m.status === 'beta').length,
    coming: visibleModules.filter(m => m.status === 'coming').length,
  };

  return (
    <div className="os-dashboard">
      <div className="os-dashboard-hero">
        <div className="os-hero-content">
          <div className="os-hero-badge">Property Ally OS</div>
          <h1>India's Real Estate Operating System</h1>
          <p>One platform connecting buyers, sellers, brokers, builders, investors, lenders and lawyers.</p>
          <div className="os-hero-stats">
            <div className="os-hero-stat">
              <span className="stat-num">{stats.live}</span>
              <span className="stat-lbl">Live</span>
            </div>
            <div className="os-hero-stat">
              <span className="stat-num">{stats.beta}</span>
              <span className="stat-lbl">Beta</span>
            </div>
            <div className="os-hero-stat">
              <span className="stat-num">{stats.coming}</span>
              <span className="stat-lbl">Coming Soon</span>
            </div>
          </div>
        </div>
        <div className="os-hero-graphic">
          <div className="os-orbit">
            {['🔍','🛡️','📈','🤖','🏦','⚖️','☁️','🤝'].map((icon, i) => (
              <div key={i} className="os-orbit-item" style={{ '--i': i, '--total': 8 }}>{icon}</div>
            ))}
            <div className="os-orbit-center">🏠</div>
          </div>
        </div>
      </div>

      <div className="os-modules-container">
        {Object.entries(grouped).map(([cat, modules]) => (
          <div key={cat} className="os-module-group">
            <div className="os-group-header">
              <span className="os-group-dot" style={{ background: CATEGORIES[cat]?.color }} />
              <h3>{CATEGORIES[cat]?.label}</h3>
              <span className="os-group-count">{modules.length} modules</span>
            </div>
            <div className="os-module-grid">
              {modules.map(mod => (
                <button
                  key={mod.id}
                  className={`os-module-card ${mod.status}`}
                  onClick={() => mod.status !== 'coming' && setCurrentView(mod.id)}
                  disabled={mod.status === 'coming'}
                >
                  <div className="os-card-icon">{mod.icon}</div>
                  <div className="os-card-body">
                    <div className="os-card-top">
                      <h4>{mod.name}</h4>
                      <span className={`os-status-badge ${STATUS_BADGE[mod.status].cls}`}>
                        {STATUS_BADGE[mod.status].label}
                      </span>
                    </div>
                    <p>{mod.desc}</p>
                  </div>
                  {mod.status !== 'coming' && (
                    <div className="os-card-arrow">→</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ALL_MODULES };
