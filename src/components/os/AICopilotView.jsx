import { useState, useRef, useEffect } from 'react';
import { useRole } from '../../context/RoleContext';

const ROLE_PROMPTS = {
  buyer: ['Best area to buy in Gurgaon under ₹1Cr?', 'Compare DLF vs Godrej projects', 'Is now a good time to buy or wait?', 'Expected appreciation on Sector 77?'],
  broker: ['How to generate more leads from 99acres?', 'Market trend in Golf Course Ext?', 'How to handle a price negotiation?', 'Which builder offers the best commission?'],
  builder: ['How to improve my RERA compliance score?', 'What amenities sell fastest in 2026?', 'How to price my new tower in Sector 84?', 'Best channel partners in Delhi NCR?'],
};

const ROLE_PERSONA = {
  buyer: 'PropBot for Buyers',
  broker: 'PropBot for Brokers',
  builder: 'PropBot for Builders',
};

const AI_RESPONSES = {
  default: "I've analyzed real estate data across 50+ cities and 10,000+ listings. Based on current market trends, I'd recommend focusing on micro-markets showing consistent 12%+ YoY appreciation. Would you like a detailed breakdown?",
  gurgaon: "Gurgaon's top micro-markets by ROI: (1) Sector 77 SPR corridor — 14.2% YoY, (2) Golf Course Extension — 11.8% YoY, (3) Dwarka Expressway — 16.3% YoY. The DXP corridor has shown the highest appreciation due to the new metro line completing in Q2 2026.",
  compare: "DLF vs Godrej comparison: DLF has higher brand premium (8-12% over market rate) but stronger resale liquidity. Godrej has better delivery track record (94% on-time vs DLF's 81%). For investment — DLF. For end-use — Godrej. Both carry RERA ratings above 90.",
  appreciation: "Sector 77 (SPR Corridor) analysis: Current prices ₹18,500–₹22,000/sqft. Forecast: ₹24,000–₹27,000/sqft by Q4 2027 (+22%). Key drivers: Kundli-Manesar-Palwal Expressway widening, proximity to IMT Manesar, and DLF Privana as a neighborhood anchor.",
  time: "Current market assessment: The NCR market is in a demand-supply equilibrium. Interest rates stabilized at 8.5-9%. Inventory absorption is healthy at 78%. Our AI models suggest 2026 Q2-Q3 is a window before prices jump on new metro corridor announcements. Short answer: Buy now.",
};

export default function AICopilotView() {
  const { role } = useRole();
  const [messages, setMessages] = useState([
    {
      id: 1, type: 'ai',
      text: `Hello! I'm your ${ROLE_PERSONA[role]}. I have access to real-time market data, property analytics, RERA database, and infrastructure intelligence. Ask me anything about real estate.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('gurgaon') || lower.includes('sector 77')) return AI_RESPONSES.gurgaon;
    if (lower.includes('dlf') || lower.includes('godrej') || lower.includes('compare')) return AI_RESPONSES.compare;
    if (lower.includes('appreciat') || lower.includes('return') || lower.includes('roi')) return AI_RESPONSES.appreciation;
    if (lower.includes('time') || lower.includes('wait') || lower.includes('now')) return AI_RESPONSES.time;
    return AI_RESPONSES.default;
  };

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: msg }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: getResponse(msg) }]);
    }, 1200);
  };

  return (
    <div className="os-module-page">
      <div className="os-module-header">
        <div className="os-module-icon-lg">🤖</div>
        <div>
          <h1>AI Real Estate Copilot</h1>
          <p>AI assistant powered by market data, RERA database & infrastructure intelligence</p>
        </div>
        <span className="os-module-badge beta">Beta</span>
      </div>

      <div className="ai-copilot-layout">
        <div className="ai-sidebar">
          <h4>Suggested Questions</h4>
          {(ROLE_PROMPTS[role] || ROLE_PROMPTS.buyer).map((p, i) => (
            <button key={i} className="ai-prompt-chip" onClick={() => send(p)}>{p}</button>
          ))}
          <div className="ai-capabilities">
            <h4>Capabilities</h4>
            <ul>
              <li>📊 Market trend analysis</li>
              <li>🔍 Property comparison</li>
              <li>📈 Appreciation forecasting</li>
              <li>🛡️ RERA database lookup</li>
              <li>🏦 Loan eligibility check</li>
              <li>🚇 Infrastructure impact</li>
              <li>💼 Investment advice</li>
            </ul>
          </div>
        </div>

        <div className="ai-chat-area">
          <div className="ai-messages">
            {messages.map(m => (
              <div key={m.id} className={`ai-msg ${m.type}`}>
                {m.type === 'ai' && (
                  <div className="ai-avatar-icon">🤖</div>
                )}
                <div className="ai-msg-bubble">
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
            {thinking && (
              <div className="ai-msg ai">
                <div className="ai-avatar-icon">🤖</div>
                <div className="ai-msg-bubble thinking">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="ai-input-row">
            <input
              type="text"
              placeholder="Ask about any property, market, builder, loan or investment…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button className="os-btn-primary" onClick={() => send()} disabled={!input.trim()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
