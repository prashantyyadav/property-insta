import { useState } from 'react';
import { formatPriceIndian } from '../../data';
import { useToast } from '../../hooks/useToast';
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection';

const PIPELINE_STAGES = ['New Lead', 'Contacted', 'Site Visit', 'Negotiation', 'Closed'];

const INIT_LEADS = [
  { id: 1, name: 'Arjun Sharma', phone: '+91 98765 43210', budget: 7500000, type: 'Apartment', location: 'Gurgaon', stage: 0, source: 'Website', date: '2026-06-08', hot: true },
  { id: 2, name: 'Priya Nair', phone: '+91 87654 32109', budget: 15000000, type: 'Villa', location: 'DLF Phase 5', stage: 2, source: 'Referral', date: '2026-06-07', hot: true },
  { id: 3, name: 'Rohit Verma', phone: '+91 76543 21098', budget: 5000000, type: 'Apartment', location: 'Noida', stage: 1, source: 'Facebook Ad', date: '2026-06-06', hot: false },
  { id: 4, name: 'Sunita Kapoor', phone: '+91 65432 10987', budget: 25000000, type: 'Penthouse', location: 'Cyber City', stage: 3, source: 'IVR', date: '2026-06-05', hot: false },
  { id: 5, name: 'Karan Mehta', phone: '+91 54321 09876', budget: 12000000, type: 'Plot', location: 'Sohna Road', stage: 4, source: '99acres', date: '2026-06-01', hot: false },
];

const CALL_LOG = [
  { lead: 'Arjun Sharma', time: '10:30 AM', duration: '4m 22s', outcome: 'Scheduled site visit', date: 'Today' },
  { lead: 'Priya Nair', time: '2:15 PM', duration: '12m 10s', outcome: 'Price negotiation in progress', date: 'Today' },
  { lead: 'Rohit Verma', time: '11:45 AM', duration: '2m 05s', outcome: 'No answer — follow up tomorrow', date: 'Yesterday' },
  { lead: 'Sunita Kapoor', time: '9:00 AM', duration: '18m 44s', outcome: 'Token amount discussed — ₹5L', date: 'Yesterday' },
];

export default function CRMView() {
  const toast = useToast();
  const { rows: leads, add, update } = useSupabaseCollection('crm_leads', INIT_LEADS, { localKey: 'os_crm_leads' });
  const [tab, setTab] = useState('pipeline');
  const [addModal, setAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '', budget: '', type: 'Apartment', location: '', source: 'Website' });

  const advanceStage = (lead) => {
    if (lead && lead.stage < 4) {
      update(lead.id, { stage: lead.stage + 1 });
      toast(`${lead.name} moved to "${PIPELINE_STAGES[lead.stage + 1]}"`, 'success');
    }
  };

  const saveLead = async () => {
    if (!newLead.name || !newLead.phone) { toast('Name and phone are required', 'warning'); return; }
    await add({ name: newLead.name, phone: newLead.phone, budget: Number(newLead.budget) || 0, type: newLead.type, location: newLead.location, source: newLead.source, stage: 0, hot: false });
    setAddModal(false);
    setNewLead({ name: '', phone: '', budget: '', type: 'Apartment', location: '', source: 'Website' });
    toast(`Lead "${newLead.name}" added`, 'success');
  };

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">📊</div>
        <div><h1>Property CRM</h1><p>Lead management, call logs, follow-ups & WhatsApp integration</p></div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
          <span className="os-module-badge beta">Beta</span>
          <button className="os-btn-primary" onClick={() => setAddModal(true)}>+ Add Lead</button>
        </div>
      </div>

      <div className="crm-stats-row">
        <div className="crm-stat blue"><span className="cs-n">{leads.length}</span><span>Total Leads</span></div>
        <div className="crm-stat orange"><span className="cs-n">{leads.filter(l => l.hot).length}</span><span>Hot Leads</span></div>
        <div className="crm-stat green"><span className="cs-n">{leads.filter(l => l.stage === 4).length}</span><span>Closed</span></div>
        <div className="crm-stat purple"><span className="cs-n">{formatPriceIndian(leads.reduce((s, l) => s + l.budget, 0))}</span><span>Pipeline Value</span></div>
      </div>

      <div className="os-tabs">
        {['pipeline', 'leads', 'calllog', 'followups'].map(t => (
          <button key={t} className={`os-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'pipeline' && '📊 Pipeline'}
            {t === 'leads' && '👥 All Leads'}
            {t === 'calllog' && '📞 Call Log'}
            {t === 'followups' && '⏰ Follow-ups'}
          </button>
        ))}
      </div>

      {tab === 'pipeline' && (
        <div className="crm-kanban">
          {PIPELINE_STAGES.map((stage, si) => (
            <div key={si} className="crm-kanban-col">
              <div className="crm-col-header">
                <span>{stage}</span>
                <span className="crm-col-count">{leads.filter(l => l.stage === si).length}</span>
              </div>
              {leads.filter(l => l.stage === si).map(lead => (
                <div key={lead.id} className={`crm-lead-card ${lead.hot ? 'hot' : ''}`}>
                  {lead.hot && <span className="crm-hot-badge">🔥 Hot</span>}
                  <h4>{lead.name}</h4>
                  <p>{lead.location} · {lead.type}</p>
                  <div className="clc-budget">{lead.budget ? formatPriceIndian(lead.budget) : '—'}</div>
                  <div className="clc-actions">
                    <button title="Call" onClick={() => toast(`Calling ${lead.name}…`, 'info')}>📞</button>
                    <button title="WhatsApp" onClick={() => toast(`WhatsApp opened for ${lead.name}`, 'info')}>💬</button>
                    <button title="Email" onClick={() => toast(`Email composed for ${lead.name}`, 'info')}>✉️</button>
                  </div>
                  {lead.stage < 4 && (
                    <button className="os-btn-outline small" style={{ width: '100%', marginTop: 6 }} onClick={() => advanceStage(lead)}>
                      Move to {PIPELINE_STAGES[lead.stage + 1]} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'leads' && (
        <div className="crm-leads-table">
          <div className="crm-table-header">
            <div>Name</div><div>Phone</div><div>Budget</div><div>Location</div><div>Stage</div><div>Source</div><div>Actions</div>
          </div>
          {leads.map(lead => (
            <div key={lead.id} className="crm-table-row">
              <div className="ctr-name">{lead.hot && '🔥 '}{lead.name}</div>
              <div>{lead.phone}</div>
              <div>{lead.budget ? formatPriceIndian(lead.budget) : '—'}</div>
              <div>{lead.location}</div>
              <div><span className={`crm-stage-badge s${lead.stage}`}>{PIPELINE_STAGES[lead.stage]}</span></div>
              <div>{lead.source}</div>
              <div className="ctr-actions">
                <button className="os-btn-outline small" onClick={() => toast(`Calling ${lead.name}`, 'info')}>📞</button>
                <button className="os-btn-outline small" onClick={() => toast(`WhatsApp: ${lead.phone}`, 'info')}>💬</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'calllog' && (
        <div className="crm-calllog">
          {CALL_LOG.map((c, i) => (
            <div key={i} className="crm-call-row">
              <div className="ccr-icon">📞</div>
              <div className="ccr-body"><h4>{c.lead}</h4><p>{c.outcome}</p></div>
              <div className="ccr-meta">
                <span>{c.date} · {c.time}</span>
                <span className="ccr-dur">{c.duration}</span>
              </div>
              <button className="os-btn-outline small" onClick={() => toast(`Follow-up scheduled for ${c.lead}`, 'success')}>Follow up</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'followups' && (
        <div className="crm-followups">
          {leads.filter(l => l.stage < 4).map(lead => (
            <div key={lead.id} className="crm-followup-card">
              <div className="cfc-avatar">{lead.name[0]}</div>
              <div className="cfc-body">
                <h4>{lead.name}</h4>
                <p>{lead.type} in {lead.location} · {lead.budget ? formatPriceIndian(lead.budget) : '—'}</p>
                <span className="cfc-stage">{PIPELINE_STAGES[lead.stage]}</span>
              </div>
              <div className="cfc-actions">
                <button className="os-btn-primary small" onClick={() => { advanceStage(lead); }}>Done ✓</button>
                <button className="os-btn-outline small" onClick={() => toast(`Follow-up rescheduled for ${lead.name}`, 'info')}>Reschedule</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {addModal && (
        <div className="os-modal-backdrop" onClick={() => setAddModal(false)}>
          <div className="os-modal" onClick={e => e.stopPropagation()}>
            <div className="os-modal-header">
              <h3>Add New Lead</h3>
              <button onClick={() => setAddModal(false)}>✕</button>
            </div>
            <div className="os-modal-body">
              <div className="os-form-row">
                <div><label>Full Name *</label><input placeholder="Arjun Sharma" value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} autoFocus /></div>
                <div><label>Phone *</label><input placeholder="+91 98765 43210" value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} /></div>
              </div>
              <div className="os-form-row">
                <div><label>Budget (₹)</label><input type="number" placeholder="5000000" value={newLead.budget} onChange={e => setNewLead(p => ({ ...p, budget: e.target.value }))} /></div>
                <div><label>Location</label><input placeholder="Gurgaon" value={newLead.location} onChange={e => setNewLead(p => ({ ...p, location: e.target.value }))} /></div>
              </div>
              <div className="os-form-row">
                <div><label>Property Type</label>
                  <select value={newLead.type} onChange={e => setNewLead(p => ({ ...p, type: e.target.value }))}>
                    {['Apartment', 'Villa', 'Plot', 'Penthouse', 'Commercial'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label>Source</label>
                  <select value={newLead.source} onChange={e => setNewLead(p => ({ ...p, source: e.target.value }))}>
                    {['Website', 'Referral', 'Facebook Ad', '99acres', 'MagicBricks', 'IVR', 'Walk-in'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="os-modal-footer">
              <button className="os-btn-outline" onClick={() => setAddModal(false)}>Cancel</button>
              <button className="os-btn-primary" onClick={saveLead}>Add Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
