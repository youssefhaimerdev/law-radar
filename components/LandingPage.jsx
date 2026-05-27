'use client'
import { useState } from 'react'
import { C, SD, lvl } from '@/lib/constants'
import USMap from '@/components/ui/USMap'

const SERIF = "var(--font-playfair, 'Playfair Display', Georgia, serif)"
const SANS  = "var(--font-dm-sans, 'DM Sans', -apple-system, sans-serif)"

const TICKER_ITEMS = [
  "🔴  URGENT · California — AB 414 Security Deposit Reform — Deadline June 15",
  "🟡  NEW · Florida — Notice Period Extended 30→45 Days — August 1",
  "🔴  URGENT · Washington — Just Cause Eviction Statewide — Deadline May 30",
  "🔴  URGENT · New Jersey — Anti-Eviction Act Amendment — July 1",
  "🟡  NEW · Oregon — Rent Control Cap Reduced to 7% — In Effect Now",
  "🔴  URGENT · Massachusetts — Tenant Protections Act — October 1",
  "✅  CLEAR · Texas — No Changes — Fully Compliant",
  "🔴  URGENT · Hawaii — Short-Term Rental Permits Required — July 1",
  "🟡  NEW · Colorado — Broadband Now Required Utility — September 1",
  "🟡  NEW · Minnesota — Rent Stabilization Extended Through 2027",
]

const TESTIMONIALS = [
  {
    name: "Marcus R.", role: "7-unit landlord · Sacramento, CA", initials: "MR", color: "#EF4444", stars: 5,
    text: "I got fined $4,200 because I didn't know California changed the deposit rules. After that nightmare I found LawRadar. Haven't had a single compliance issue since. Worth every single penny.",
  },
  {
    name: "Sandra K.", role: "Property Manager · Portland, OR", initials: "SK", color: "#8B5CF6", stars: 5,
    text: "Oregon's rent control laws change every year and keeping up was a full-time job. LawRadar sends me exactly what changed and exactly what to update in my leases. My clients think I'm a genius.",
  },
  {
    name: "David T.", role: "14-unit landlord · Seattle, WA", initials: "DT", color: "#0EA5E9", stars: 5,
    text: "Washington's just cause eviction law caught me completely off guard. LawRadar alerted me 3 weeks before it took effect. I updated all my leases in time. Could have been a very costly mistake.",
  },
]

const PAIN_CARDS = [
  { icon: "💸", title: "Average landlord fine: $3,800", body: "Non-compliance penalties hit small landlords hardest. A single missed deposit rule, improper eviction notice, or outdated lease clause can wipe out months of rental income." },
  { icon: "⚖️", title: "Evictions get thrown out of court", body: "Courts routinely dismiss eviction cases when landlords can't prove they followed the latest procedural requirements. The tenant stays. You pay court costs. You start over." },
  { icon: "📋", title: "Lease clauses become illegal overnight", body: "A clause that was perfectly legal last year can expose you to tenant lawsuits this year. Laws change constantly. Your lease needs to change with them — or it becomes a weapon against you." },
]

const STATS = [
  { n: "12,000+", label: "Landlords Protected" },
  { n: "50",      label: "States Monitored" },
  { n: "$47M+",   label: "In Fines Prevented" },
  { n: "<24hrs",  label: "Alert Delivery Time" },
]

const FEATURES = [
  { icon: "📡", tag: "Core", title: "Real-Time Law Monitoring", body: "Our engine scans all 50 state legislative databases every day. The moment a bill affecting landlords is filed, progresses, or passes — you know before most attorneys do." },
  { icon: "📋", tag: "AI", title: "Plain-English Summaries", body: "Every law change translated from dense legal jargon into a 3-sentence explanation. What changed, who it affects, and why it matters. Zero lawyer-speak." },
  { icon: "✅", tag: "Smart", title: "Exact Action Checklists", body: "Not just what changed — but which lease clause to update, which form to file, and which deadline to hit. Your compliance to-do list, auto-generated." },
  { icon: "📊", tag: "Dashboard", title: "Compliance Health Score", body: "A live 0–100 score across all your properties. Green = safe. Amber = review. Red = act now. Automatically updated every time a law changes in your states." },
  { icon: "🤖", tag: "AI Chat", title: "Ask the Law AI", body: "Ask any landlord law question in plain English. Get an accurate, jurisdiction-specific answer grounded in real legislation. Like a property attorney on call — for $19/month." },
  { icon: "🔔", tag: "Alerts", title: "Deadline Reminders", body: "Email and SMS reminders at 30 days, 7 days, and the day before every compliance deadline. Never find out in the courtroom." },
]

const FAQ = [
  { q: "Is this actual legal advice?", a: "No — LawRadar provides general legal information, not legal advice. Think of us as a very well-informed assistant that tells you when laws change and what they mean in plain English. For specific legal situations, always consult a qualified attorney." },
  { q: "How fast do I get alerted when a law changes?", a: "Our engine checks all 50 state databases every day. For urgent changes, we run additional scans. Most landlords receive their alert within 24 hours of a bill being signed into law." },
  { q: "I only own one property in one state. Is it worth it?", a: "Absolutely. The average non-compliance fine is $3,800. Our Pro plan is $19/month. That's 16+ years of protection for the price of one avoided fine." },
  { q: "How accurate is the AI summary?", a: "Very. We pull directly from official state legislative databases via the LegiScan API, then use Gemini to generate plain-English summaries. Every summary includes a direct link to the source legislation so you can verify it yourself." },
  { q: "Can I cancel anytime?", a: "Yes — cancel with a single click from your dashboard, no phone calls, no questions asked. Your access continues until the end of your billing period." },
]

// ── Alert Float Card ─────────────────────────────────────────
function AlertCard({ level, state, law, deadline, cls }) {
  const isH = level === 'high'
  return (
    <div className={cls} style={{
      position: 'absolute',
      background: 'rgba(10,16,28,0.95)',
      border: `1px solid ${isH ? 'rgba(239,68,68,0.35)' : 'rgba(16,185,129,0.28)'}`,
      borderRadius: 16, padding: '14px 18px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      minWidth: 230, maxWidth: 260, zIndex: 2,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: isH ? '#EF4444' : '#10B981', animation: isH ? 'pulse 1.8s infinite' : 'none' }} />
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', color: isH ? '#EF4444' : '#10B981' }}>{isH ? 'URGENT' : 'COMPLIANT'}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 }}>{state}</div>
      <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.5, marginBottom: deadline ? 8 : 0 }}>{law}</div>
      {deadline && <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700 }}>⏰ {deadline}</div>}
    </div>
  )
}

function Stars() {
  return <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: '#F59E0B', fontSize: 15 }}>★</span>)}</div>
}

// ── Demo Modal ───────────────────────────────────────────────
function DemoModal({ onClose }) {
  const [tab, setTab] = useState('alerts')

  const DEMO_ALERTS = [
    { abbr:'WA', n:'Washington',    v:'high',   c:4, law:'HB 2057 — Statewide Just Cause Eviction',     d:'May 30, 2026',     a:'Review all pending evictions and non-renewals immediately. Documented justification required for every case.', s:"Just cause eviction requirements expanded statewide. All landlords must document just cause for every eviction and non-renewal of tenancy." },
    { abbr:'CA', n:'California',    v:'high',   c:3, law:'AB 414 — Security Deposit Reform Act',         d:'June 15, 2026',    a:'Update lease templates. Implement timestamped photo workflow for all move-ins and move-outs.', s:"Landlords may now agree electronically on deposit refund procedures. AB 2801 adds mandatory timestamped photo documentation." },
    { abbr:'NJ', n:'New Jersey',    v:'high',   c:3, law:'Anti-Eviction Protection Act Amendment 2026',  d:'July 1, 2026',     a:'Review all 3+ year tenancies. Budget relocation assistance for any planned owner move-ins.', s:"Long-term tenant protections expanded. Owner move-ins now require 3 months notice plus 3 months rent as mandatory relocation assistance." },
    { abbr:'FL', n:'Florida',       v:'medium', c:1, law:'SB 892 — Notice Period Extension',             d:'August 1, 2026',   a:'Update termination clauses for Broward, Dade, Palm Beach, and Hillsborough county properties.', s:"Notice period extended from 30 to 45 days for month-to-month tenancies in counties over 500K population." },
    { abbr:'OR', n:'Oregon',        v:'high',   c:2, law:'SB 611 — Rent Control Reduction 2026',         d:'June 1, 2026',     a:'Recalculate all planned rent increases. Portland properties capped at 5% regardless of state formula.', s:"Annual rent increase cap reduced from 10% to 7% above CPI. Portland adds an additional 5% city-level cap." },
  ]
  const CHAT = [
    { r:'ai', t:"Hi! I'm your LawRadar AI. Ask me anything about rental laws in your states — plain English, grounded in real legislation." },
    { r:'user', t:"Can I still increase rent in California this year?" },
    { r:'ai', t:"Yes — but with limits. Under AB 1482, most California landlords are capped at 5% plus local CPI, with an absolute maximum of 10%. For 2026, that means most properties are capped at around 8.5%. Single-family homes owned by individuals are exempt if you give proper notice. Always check your specific city — some like LA and San Francisco have additional local caps." },
    { r:'user', t:"What if my tenant hasn't paid rent for 2 months in Washington?" },
    { r:'ai', t:"Under Washington's updated law, you can still serve a 3-day Pay or Vacate notice for non-payment. However, since HB 2057 took effect, you must document this as your just cause reason before filing any eviction. Keep all payment records and the notice itself — courts in Washington are strict about documentation. Note: This is general information, not legal advice." },
  ]
  const lv = (v) => ({ high:{ hex:'#EF4444', bg:'rgba(239,68,68,0.12)', border:'rgba(239,68,68,0.3)', label:'Urgent' }, medium:{ hex:'#F59E0B', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.28)', label:'Attention' } }[v] || {})

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
      onClick={onClose}>
      {/* Backdrop */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)' }} />

      {/* Modal */}
      <div style={{ position:'relative', width:'100%', maxWidth:900, maxHeight:'90vh', background:'#0D1425', border:`1px solid rgba(255,255,255,0.1)`, borderRadius:24, overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 40px 120px rgba(0,0,0,0.8)' }}
        onClick={e=>e.stopPropagation()}>

        {/* Modal header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 28px', borderBottom:`1px solid rgba(255,255,255,0.07)`, flexShrink:0 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <div style={{ width:28, height:28, background:C.gold, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>⚖️</div>
              <span style={{ fontFamily:SERIF, fontSize:18, fontWeight:700 }}>LawRadar — Product Demo</span>
            </div>
            <p style={{ fontSize:13, color:C.textMid }}>See exactly what landlords get when they sign up</p>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'none', color:C.textMid, width:36, height:36, borderRadius:9, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, padding:'16px 28px 0', borderBottom:`1px solid rgba(255,255,255,0.07)`, flexShrink:0 }}>
          {[
            { id:'alerts',    label:'⚠️  Active Alerts' },
            { id:'score',     label:'📊  Compliance Score' },
            { id:'ai',        label:'🤖  Ask the Law AI' },
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ background: tab===t.id ? C.amberBg : 'transparent', border:`1px solid ${tab===t.id ? C.amberBorder : 'transparent'}`, borderBottom: tab===t.id ? `1px solid ${C.amberBg}` : '1px solid transparent', borderRadius:'8px 8px 0 0', padding:'10px 18px', color: tab===t.id ? C.gold : C.textMid, fontSize:14, fontWeight: tab===t.id ? 600 : 400, cursor:'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ overflowY:'auto', flex:1, padding:28 }}>

          {/* Alerts tab */}
          {tab==='alerts' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div>
                  <h3 style={{ fontFamily:SERIF, fontSize:18, fontWeight:700, marginBottom:4 }}>Your Active Law Alerts</h3>
                  <p style={{ fontSize:13, color:C.textMid }}>5 states monitored · 13 changes requiring attention</p>
                </div>
                <div style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:10, padding:'8px 16px', fontSize:13, color:'#FCA5A5', fontWeight:600 }}>🔴 3 Urgent deadlines this month</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {DEMO_ALERTS.map(a => {
                  const l = lv(a.v)
                  return (
                    <div key={a.abbr} style={{ background:'#111927', border:`1px solid ${l.border}`, borderRadius:16, padding:22 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:38, height:38, borderRadius:9, background:l.bg, border:`1px solid ${l.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:l.hex }}>{a.abbr}</div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:15, color:C.text }}>{a.n}</div>
                            <div style={{ fontSize:12, color:l.hex, fontWeight:600 }}>{a.law}</div>
                          </div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                          <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', background:l.bg, border:`1px solid ${l.border}`, color:l.hex, padding:'3px 9px', borderRadius:100 }}>{l.label}</span>
                          {a.d && <span style={{ fontSize:12, color:'#EF4444', fontWeight:700, background:'rgba(239,68,68,0.1)', padding:'4px 10px', borderRadius:7 }}>⏰ {a.d}</span>}
                        </div>
                      </div>
                      <p style={{ fontSize:13, color:C.textMid, lineHeight:1.65, marginBottom:12 }}>{a.s}</p>
                      <div style={{ background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:9, padding:'10px 14px', fontSize:13, color:C.goldLight }}>
                        <span style={{ color:C.gold, fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em' }}>Action: </span>{a.a}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Score tab */}
          {tab==='score' && (
            <div>
              <h3 style={{ fontFamily:SERIF, fontSize:18, fontWeight:700, marginBottom:20 }}>Your Compliance Dashboard</h3>
              <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:24, marginBottom:24 }}>
                {/* Score ring */}
                <div style={{ background:'#111927', border:`1px solid ${C.border}`, borderRadius:18, padding:28, display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
                  <svg width={130} height={130} style={{ transform:'rotate(-90deg)' }}>
                    <circle cx={65} cy={65} r={52} fill="none" stroke="#1C2536" strokeWidth={10} />
                    <circle cx={65} cy={65} r={52} fill="none" stroke="#F59E0B" strokeWidth={10} strokeDasharray={2*Math.PI*52} strokeDashoffset={2*Math.PI*52*(1-0.67)} strokeLinecap="round" />
                  </svg>
                  <div style={{ textAlign:'center', marginTop:-130+10 }}>
                    <div style={{ fontSize:36, fontWeight:700, color:C.text, fontFamily:SERIF }}>67</div>
                    <div style={{ fontSize:11, color:C.gold, fontWeight:600 }}>/ 100</div>
                  </div>
                  <div style={{ textAlign:'center', marginTop:110 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>Compliance Score</div>
                    <div style={{ fontSize:12, color:C.gold, marginTop:4 }}>⚠ Action needed</div>
                  </div>
                </div>
                {/* State breakdown */}
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {DEMO_ALERTS.map(a => {
                    const l = lv(a.v)
                    return (
                      <div key={a.abbr} style={{ background:'#111927', border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:7, background:l.bg, border:`1px solid ${l.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:l.hex }}>{a.abbr}</div>
                          <div>
                            <div style={{ fontSize:14, fontWeight:500, color:C.text }}>{a.n}</div>
                            <div style={{ fontSize:11, color:C.textMid }}>{a.c} change{a.c!==1?'s':''} detected</div>
                          </div>
                        </div>
                        <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', background:l.bg, border:`1px solid ${l.border}`, color:l.hex, padding:'3px 9px', borderRadius:100 }}>{l.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{ background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:14, padding:'18px 22px' }}>
                <p style={{ fontSize:14, color:C.goldLight, lineHeight:1.65 }}>
                  <strong style={{ color:C.gold }}>To reach 100/100:</strong> Review the 3 urgent Washington and California alerts, update your lease templates with the new deposit clause, and mark the June 15 deadline as complete in your action calendar.
                </p>
              </div>
            </div>
          )}

          {/* AI tab */}
          {tab==='ai' && (
            <div>
              <h3 style={{ fontFamily:SERIF, fontSize:18, fontWeight:700, marginBottom:6 }}>Ask the Law AI</h3>
              <p style={{ fontSize:13, color:C.textMid, marginBottom:20 }}>Powered by Gemini · Grounded in real state legislation · Available 24/7</p>
              <div style={{ background:'#111927', border:`1px solid ${C.border}`, borderRadius:16, padding:20, display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
                {CHAT.map((m,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent: m.r==='user' ? 'flex-end' : 'flex-start', gap:10 }}>
                    {m.r==='ai' && <div style={{ width:28, height:28, borderRadius:'50%', background:C.amberBg, border:`1px solid ${C.amberBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0, marginTop:2 }}>⚖️</div>}
                    <div style={{ maxWidth:'80%', padding:'11px 15px', borderRadius:14, fontSize:13.5, lineHeight:1.65, background: m.r==='user' ? C.gold : '#1C2842', color: m.r==='user' ? '#000' : C.text, borderBottomRightRadius: m.r==='user' ? 4 : 14, borderBottomLeftRadius: m.r==='ai' ? 4 : 14 }}>
                      {m.t}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.22)', borderRadius:12, padding:'14px 18px', fontSize:13, color:'#6EE7B7', lineHeight:1.6 }}>
                ✓ Answers grounded in real legislation · Links to source bills · Jurisdiction-specific · Not a substitute for a licensed attorney
              </div>
            </div>
          )}

        </div>

        {/* Modal footer CTA */}
        <div style={{ padding:'18px 28px', borderTop:`1px solid rgba(255,255,255,0.07)`, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, background:'#0A0F1E' }}>
          <p style={{ fontSize:14, color:C.textMid }}>This is a live preview of the actual LawRadar dashboard.</p>
          <button onClick={()=>{ onClose(); }} style={{ background:C.gold, color:'#000', border:'none', borderRadius:10, padding:'12px 28px', fontSize:15, fontWeight:700, cursor:'pointer' }}>
            Get Started Free →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function LandingPage({ onStart }) {
  const [mapHovered, setMapHovered] = useState(null)
  const [openFaq,    setOpenFaq]    = useState(null)
  const [showDemo,   setShowDemo]   = useState(false)
  const totalAlerts = Object.values(SD).reduce((s, v) => s + v.c, 0)

  return (
    <div style={{ background: C.bg0, color: C.text, fontFamily: SANS, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-18px) rotate(-2deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(2deg)}  50%{transform:translateY(-12px) rotate(2deg)}  }
        @keyframes floatC { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-22px) rotate(-1deg)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes goldGlow { 0%,100%{box-shadow:0 0 28px rgba(245,158,11,0.25)} 50%{box-shadow:0 0 56px rgba(245,158,11,0.55)} }
        .float-a { animation: floatA 5s  ease-in-out infinite; }
        .float-b { animation: floatB 6.5s ease-in-out infinite 1s; }
        .float-c { animation: floatC 8s  ease-in-out infinite 2s; }
        .ticker-track { display:inline-flex; gap:72px; animation:ticker 40s linear infinite; white-space:nowrap; }
        .ticker-track:hover { animation-play-state:paused; }
        .nav-link:hover { color:#F1F5F9 !important; }
        .hero-btn:hover  { transform:translateY(-2px) !important; }
        .pain-card:hover { transform:translateY(-4px) !important; border-color:rgba(245,158,11,0.22) !important; }
        .feat-row:hover  { background:rgba(255,255,255,0.03) !important; }
        .test-card:hover { transform:translateY(-4px) !important; }
        .price-card:hover { transform:translateY(-5px) !important; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#1E2D40; border-radius:4px; }
      `}</style>

      {/* ════ DEMO MODAL ═════════════════════════════════════ */}
      {showDemo && <DemoModal onClose={()=>setShowDemo(false)} />}

      {/* ════ NAV ════════════════════════════════════════════ */}
      <nav style={{ position:'sticky', top:0, zIndex:300, background:'rgba(7,12,24,0.93)', backdropFilter:'blur(20px)', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 56px', height:68 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, background:C.gold, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>⚖️</div>
          <span style={{ fontFamily:SERIF, fontSize:22, fontWeight:700, letterSpacing:'-0.02em' }}>LawRadar</span>
        </div>
        <div style={{ display:'flex', gap:36, alignItems:'center' }}>
          {['Features','How It Works','Pricing','Blog'].map(n=>(
            <span key={n} className="nav-link" style={{ color:C.textMid, fontSize:14, cursor:'pointer', transition:'color 0.15s' }}>{n}</span>
          ))}
          <button onClick={onStart} style={{ background:C.gold, color:'#000', border:'none', borderRadius:9, padding:'10px 24px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
            Start Free →
          </button>
        </div>
      </nav>

      {/* ════ HERO ═══════════════════════════════════════════ */}
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', padding:'100px 56px 80px' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize:'36px 36px', zIndex:0 }} />
        <div style={{ position:'absolute', top:'8%', right:'22%', width:640, height:640, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)', zIndex:0 }} />
        <div style={{ position:'absolute', bottom:'15%', left:'2%', width:380, height:380, borderRadius:'50%', background:'radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 65%)', zIndex:0 }} />

        {/* Text column */}
        <div style={{ maxWidth:600, position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'7px 18px', marginBottom:32 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:C.gold, animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:13, color:C.gold, fontWeight:500 }}>Live · {totalAlerts} active law changes tracked across all 50 states</span>
          </div>

          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(42px,5vw,70px)', fontWeight:700, lineHeight:1.06, letterSpacing:'-0.03em', marginBottom:28 }}>
            The Law Just<br />Changed.<br />
            <em style={{ color:C.gold, fontStyle:'italic' }}>Did You Know?</em>
          </h1>

          <p style={{ fontSize:20, color:C.textMid, lineHeight:1.75, marginBottom:18, maxWidth:530 }}>
            LawRadar watches every state legislature 24/7 and sends you a plain-English alert — with the exact lease clause to update — the moment a rental law changes.
          </p>
          <p style={{ fontSize:15, color:'#6B7280', lineHeight:1.7, marginBottom:44, maxWidth:520 }}>
            No lawyers. No newsletters. No Googling. Just one email that tells you exactly what changed, what you owe, and what to update.
          </p>

          <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:28 }}>
            <button className="hero-btn" onClick={onStart} style={{ background:C.gold, color:'#000', border:'none', borderRadius:12, padding:'17px 44px', fontSize:18, fontWeight:800, cursor:'pointer', animation:'goldGlow 3s ease infinite', transition:'transform 0.2s' }}>
              Start Monitoring Free
            </button>
            <button className="hero-btn" style={{ background:'transparent', color:C.text, border:`1px solid rgba(255,255,255,0.14)`, borderRadius:12, padding:'17px 32px', fontSize:18, cursor:'pointer', transition:'transform 0.2s' }} onClick={()=>setShowDemo(true)}>
              Watch 2-Min Demo ▶
            </button>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['✓ Free to start','✓ No credit card','✓ Cancel anytime','✓ All 50 states'].map(t=>(
              <span key={t} style={{ fontSize:13, color:'#6B7280' }}>{t}&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>

        {/* Floating alert cards */}
        <div style={{ position:'absolute', right:'5%', top:'50%', transform:'translateY(-50%)', width:320, height:500, zIndex:1 }}>
          <AlertCard cls="float-a" level="high" state="Washington" law="HB 2057 — Just Cause Eviction now statewide" deadline="May 30 — 3 days left" style={{ top:0, right:0 }} />
          <AlertCard cls="float-b" level="high" state="California" law="AB 414 — Security Deposit Reform" deadline="June 15, 2026" style={{ top:165, right:30 }} />
          <AlertCard cls="float-c" level="ok"   state="Texas"      law="No recent changes — Fully compliant" deadline={null} style={{ top:330, right:5 }} />
        </div>
      </div>

      {/* ════ TICKER ═════════════════════════════════════════ */}
      <div style={{ background:'#0A0F1E', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'14px 0', overflow:'hidden' }}>
        <div style={{ overflow:'hidden', whiteSpace:'nowrap' }}>
          <div className="ticker-track">
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((item,i)=>(
              <span key={i} style={{ fontSize:13, color:C.textMid }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ════ STATS ══════════════════════════════════════════ */}
      <div style={{ background:C.bg1, borderBottom:`1px solid ${C.border}`, padding:'56px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
          {STATS.map(({ n, label })=>(
            <div key={label} style={{ textAlign:'center', padding:'28px 16px', background:C.card, border:`1px solid ${C.border}`, borderRadius:18 }}>
              <div style={{ fontFamily:SERIF, fontSize:48, fontWeight:700, color:C.gold, lineHeight:1, marginBottom:10 }}>{n}</div>
              <div style={{ fontSize:14, color:C.textMid }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════ PAIN ═══════════════════════════════════════════ */}
      <div style={{ padding:'110px 56px', background:C.bg0 }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:C.red, background:C.redBg, border:`1px solid ${C.redBorder}`, borderRadius:100, padding:'5px 14px' }}>The Hidden Danger</span>
          </div>
          <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, textAlign:'center', marginBottom:20, lineHeight:1.12 }}>
            Most Landlords Find Out<br /><em style={{ color:C.red, fontStyle:'italic' }}>Too Late</em>
          </h2>
          <p style={{ color:C.textMid, fontSize:18, textAlign:'center', maxWidth:580, margin:'0 auto 64px', lineHeight:1.75 }}>
            Rental laws change constantly — and the penalties don't care whether you knew about the change or not.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24, marginBottom:48 }}>
            {PAIN_CARDS.map(({ icon, title, body })=>(
              <div key={title} className="pain-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:22, padding:40, transition:'all 0.2s' }}>
                <div style={{ fontSize:48, marginBottom:22 }}>{icon}</div>
                <h3 style={{ fontFamily:SERIF, fontSize:22, fontWeight:700, marginBottom:14, lineHeight:1.3 }}>{title}</h3>
                <p style={{ fontSize:15, color:C.textMid, lineHeight:1.8 }}>{body}</p>
              </div>
            ))}
          </div>
          {/* Real story */}
          <div style={{ background:'linear-gradient(135deg,rgba(239,68,68,0.07) 0%,rgba(245,158,11,0.05) 100%)', border:`1px solid rgba(239,68,68,0.2)`, borderRadius:22, padding:'40px 52px', display:'flex', gap:28, alignItems:'flex-start' }}>
            <div style={{ fontSize:56, lineHeight:1, color:C.gold, fontFamily:SERIF, flexShrink:0, marginTop:-8 }}>"</div>
            <div>
              <p style={{ fontSize:18, color:C.text, lineHeight:1.82, marginBottom:24, fontStyle:'italic' }}>
                I lost an eviction case I should have won — and had to pay the tenant's attorney fees — because my notice period was 30 days when California had quietly changed it to 45. Nobody told me. I found out in the courtroom.
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:46, height:46, borderRadius:'50%', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.28)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#FCA5A5', fontSize:14 }}>JM</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:600 }}>James M.</div>
                  <div style={{ fontSize:12, color:C.textMid }}>22-unit landlord · Los Angeles, CA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ HOW IT WORKS ═══════════════════════════════════ */}
      <div style={{ background:C.bg1, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:68 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>How It Works</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22, marginBottom:16 }}>Set Up in 3 Minutes.<br />Protected Forever.</h2>
            <p style={{ color:C.textMid, fontSize:18, maxWidth:480, margin:'0 auto' }}>No technical knowledge required. Just your state and property type.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, position:'relative' }}>
            <div style={{ position:'absolute', top:52, left:'18%', right:'18%', height:1, background:`linear-gradient(to right,${C.gold}40,${C.gold}40)` }} />
            {[
              { n:'01', icon:'🏠', title:'Register Your Properties', body:'Pick your states and property types. Two minutes. Zero technical setup.' },
              { n:'02', icon:'📡', title:'We Watch Everything', body:'Our engine scans all 50 state legislatures daily. Keywords, bill status, effective dates — all tracked for you.' },
              { n:'03', icon:'📬', title:'You Get Instant Alerts', body:"Plain-English email: what changed, what you owe, what to update, by when. No jargon." },
            ].map(({ n, icon, title, body })=>(
              <div key={n} style={{ textAlign:'center', padding:'0 44px' }}>
                <div style={{ width:80, height:80, borderRadius:22, background:C.amberBg, border:`1px solid ${C.amberBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 22px', position:'relative', zIndex:1 }}>
                  {icon}
                  <div style={{ position:'absolute', top:-10, right:-10, width:28, height:28, borderRadius:'50%', background:C.gold, color:'#000', fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{n}</div>
                </div>
                <h3 style={{ fontFamily:SERIF, fontSize:20, fontWeight:700, marginBottom:12 }}>{title}</h3>
                <p style={{ fontSize:15, color:C.textMid, lineHeight:1.75 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ MAP ════════════════════════════════════════════ */}
      <div style={{ padding:'110px 56px', background:C.bg0 }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>Live Map</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22, marginBottom:16 }}>See Your Legal Exposure<br />Across Every State</h2>
            <p style={{ color:C.textMid, fontSize:18 }}>Hover over any state. Red means you need to act now.</p>
          </div>
          <div style={{ display:'flex', gap:24, justifyContent:'center', marginBottom:32, flexWrap:'wrap' }}>
            {[{ c:'#EF4444', label:'Urgent — Act Now' },{ c:'#F59E0B', label:'Changes Detected' },{ c:'#1A2840', label:'Compliant' }].map(({ c, label })=>(
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:c }} />
                <span style={{ fontSize:13, color:C.textMid }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:'28px 28px 16px', overflow:'hidden' }}>
            <USMap hovered={mapHovered} onHover={setMapHovered} />
          </div>
          <p style={{ textAlign:'center', fontSize:13, color:'#4B5563', marginTop:14 }}>Updated daily via LegiScan API · Plain-English summaries by Gemini AI</p>
        </div>
      </div>

      {/* ════ FEATURES ═══════════════════════════════════════ */}
      <div style={{ background:C.bg1, borderTop:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:68 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>Features</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22, marginBottom:16 }}>Your Legal Co-Pilot.<br />Always On.</h2>
            <p style={{ color:C.textMid, fontSize:18, maxWidth:500, margin:'0 auto' }}>Everything a landlord needs to stay compliant — in one place.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
            {FEATURES.map(({ icon, tag, title, body })=>(
              <div key={title} className="feat-row" style={{ display:'flex', gap:22, padding:30, borderRadius:20, border:`1px solid ${C.border}`, background:C.card, transition:'background 0.2s' }}>
                <div style={{ width:60, height:60, borderRadius:16, background:C.amberBg, border:`1px solid ${C.amberBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>{icon}</div>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                    <h3 style={{ fontFamily:SERIF, fontSize:18, fontWeight:700 }}>{title}</h3>
                    <span style={{ fontSize:10, fontWeight:700, color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, padding:'2px 8px', borderRadius:100 }}>{tag}</span>
                  </div>
                  <p style={{ fontSize:14, color:C.textMid, lineHeight:1.78 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ TESTIMONIALS ═══════════════════════════════════ */}
      <div style={{ background:C.bg0, borderTop:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:68 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>Real Landlords</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22 }}>They Stopped Getting Surprised.<br />So Can You.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
            {TESTIMONIALS.map(({ name, role, initials, color, text })=>(
              <div key={name} className="test-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:22, padding:36, transition:'all 0.2s', display:'flex', flexDirection:'column' }}>
                <Stars />
                <p style={{ fontSize:15, color:C.text, lineHeight:1.85, flex:1, fontStyle:'italic', marginBottom:28 }}>"{text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:14, borderTop:`1px solid ${C.border}`, paddingTop:22 }}>
                  <div style={{ width:46, height:46, borderRadius:'50%', background:`${color}22`, border:`1px solid ${color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color, fontSize:14 }}>{initials}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{name}</div>
                    <div style={{ fontSize:12, color:C.textMid }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:18, justifyContent:'center', marginTop:56, flexWrap:'wrap' }}>
            {['🔒 SSL Encrypted','🏦 Stripe Payments','⚡ 99.9% Uptime','🔁 Cancel Anytime','🇺🇸 US-Based Data'].map(t=>(
              <div key={t} style={{ fontSize:13, color:C.textMid, background:C.card, border:`1px solid ${C.border}`, borderRadius:100, padding:'9px 20px' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ PRICING ════════════════════════════════════════ */}
      <div style={{ background:C.bg1, borderTop:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:1020, margin:'0 auto', textAlign:'center' }}>
          <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>Pricing</span>
          <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22, marginBottom:16 }}>Less Than One Coffee.<br />Potentially Worth Thousands.</h2>
          <p style={{ color:C.textMid, fontSize:18, maxWidth:520, margin:'0 auto 60px' }}>The average landlord fine is $3,800. Our Pro plan is $19/month. Do the math.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr 1fr', gap:20, alignItems:'start' }}>
            {/* Free */}
            <div className="price-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:40, textAlign:'left', transition:'all 0.2s' }}>
              <div style={{ fontSize:11, color:C.textMid, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>Free</div>
              <div style={{ fontFamily:SERIF, fontSize:56, fontWeight:700, lineHeight:1, marginBottom:8 }}>$0</div>
              <div style={{ color:C.textMid, fontSize:14, marginBottom:36, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>Forever free. No card needed.</div>
              {['1 state monitored','Monthly law digest','Basic alert emails','Community support'].map(f=>(
                <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:C.textMid, marginBottom:13 }}><span style={{ color:C.green }}>✓</span>{f}</div>
              ))}
              <button onClick={onStart} style={{ width:'100%', marginTop:28, background:'transparent', color:C.text, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px', fontSize:15, fontWeight:500, cursor:'pointer' }}>Get Started</button>
            </div>
            {/* Pro */}
            <div className="price-card" style={{ background:'linear-gradient(160deg,rgba(245,158,11,0.1) 0%,rgba(245,158,11,0.03) 100%)', border:'2px solid rgba(245,158,11,0.4)', borderRadius:24, padding:40, textAlign:'left', transition:'all 0.2s', position:'relative' }}>
              <div style={{ position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', background:C.gold, color:'#000', fontSize:11, fontWeight:800, padding:'6px 20px', borderRadius:100, letterSpacing:'0.07em', textTransform:'uppercase', whiteSpace:'nowrap' }}>Most Popular</div>
              <div style={{ fontSize:11, color:C.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>Pro</div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:8, lineHeight:1 }}>
                <span style={{ fontFamily:SERIF, fontSize:56, fontWeight:700 }}>$19</span>
                <span style={{ color:C.textMid, fontSize:16, paddingBottom:8 }}>/month</span>
              </div>
              <div style={{ color:C.textMid, fontSize:14, marginBottom:36, paddingBottom:24, borderBottom:`1px solid rgba(245,158,11,0.2)` }}>14-day free trial · Cancel anytime</div>
              {['All 50 states monitored','Real-time law alerts','AI plain-English summaries','Compliance health score','Lease clause generator','Deadline reminders','Ask the Law AI — unlimited','Priority support'].map(f=>(
                <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, marginBottom:13 }}><span style={{ color:C.gold }}>✓</span>{f}</div>
              ))}
              <button onClick={onStart} style={{ width:'100%', marginTop:28, background:C.gold, color:'#000', border:'none', borderRadius:12, padding:'16px', fontSize:16, fontWeight:800, cursor:'pointer' }}>Start 14-Day Free Trial →</button>
            </div>
            {/* Team */}
            <div className="price-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:40, textAlign:'left', transition:'all 0.2s' }}>
              <div style={{ fontSize:11, color:C.textMid, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>Team</div>
              <div style={{ fontFamily:SERIF, fontSize:56, fontWeight:700, lineHeight:1, marginBottom:8 }}>$49</div>
              <div style={{ color:C.textMid, fontSize:14, marginBottom:36, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>Property managers & attorneys</div>
              {['Everything in Pro','Unlimited properties','White-label PDF reports','Client portal access','API access','Dedicated account manager'].map(f=>(
                <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:C.textMid, marginBottom:13 }}><span style={{ color:C.green }}>✓</span>{f}</div>
              ))}
              <button onClick={onStart} style={{ width:'100%', marginTop:28, background:'transparent', color:C.text, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px', fontSize:15, fontWeight:500, cursor:'pointer' }}>Contact Us</button>
            </div>
          </div>
        </div>
      </div>

      {/* ════ FAQ ════════════════════════════════════════════ */}
      <div style={{ background:C.bg0, borderTop:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:740, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>FAQ</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(28px,4vw,44px)', fontWeight:700, marginTop:22 }}>Common Questions</h2>
          </div>
          {FAQ.map(({ q, a }, i)=>(
            <div key={q} style={{ borderBottom:`1px solid ${C.border}` }}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:'100%', background:'transparent', border:'none', padding:'22px 4px', textAlign:'left', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', gap:20 }}>
                <span style={{ fontSize:16, fontWeight:600, color:C.text }}>{q}</span>
                <span style={{ fontSize:22, color:C.gold, flexShrink:0, transform:openFaq===i?'rotate(45deg)':'rotate(0)', transition:'transform 0.2s', display:'inline-block' }}>+</span>
              </button>
              {openFaq===i && (
                <div style={{ padding:'0 4px 22px', fontSize:15, color:C.textMid, lineHeight:1.78 }}>{a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ════ FINAL CTA ══════════════════════════════════════ */}
      <div style={{ background:'linear-gradient(135deg,#0D1425 0%,#141E34 50%,#0D1425 100%)', borderTop:`1px solid ${C.border}`, padding:'130px 56px', textAlign:'center' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ fontSize:64, marginBottom:28 }}>🏠</div>
          <h2 style={{ fontFamily:SERIF, fontSize:'clamp(38px,5vw,64px)', fontWeight:700, lineHeight:1.1, marginBottom:24 }}>
            Stop Finding Out<br /><em style={{ color:C.gold, fontStyle:'italic' }}>Too Late.</em>
          </h2>
          <p style={{ fontSize:20, color:C.textMid, lineHeight:1.78, maxWidth:520, margin:'0 auto 52px' }}>
            12,847 landlords already get instant alerts when a law affects their property. Join them free — setup takes 3 minutes.
          </p>
          <button className="hero-btn" onClick={onStart} style={{ background:C.gold, color:'#000', border:'none', borderRadius:14, padding:'22px 64px', fontSize:20, fontWeight:800, cursor:'pointer', animation:'goldGlow 3s ease infinite', transition:'transform 0.2s', display:'inline-block' }}>
            Start Monitoring Free →
          </button>
          <p style={{ marginTop:22, fontSize:14, color:'#4B5563' }}>No credit card · Free forever plan · Cancel anytime</p>
        </div>
      </div>

      {/* ════ FOOTER ═════════════════════════════════════════ */}
      <div style={{ background:C.bg0, borderTop:`1px solid ${C.border}`, padding:'56px 56px 40px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48, marginBottom:48 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <div style={{ width:32, height:32, background:C.gold, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>⚖️</div>
              <span style={{ fontFamily:SERIF, fontSize:18, fontWeight:700 }}>LawRadar</span>
            </div>
            <p style={{ fontSize:14, color:C.textMid, lineHeight:1.75, maxWidth:260 }}>The landlord compliance platform that watches every state legislature so you don't have to.</p>
          </div>
          {[
            { h:'Product',  links:['Features','Pricing','Changelog','API'] },
            { h:'Company',  links:['About','Blog','Careers','Contact'] },
            { h:'Legal',    links:['Privacy','Terms','Cookies','Disclaimer'] },
          ].map(({ h, links })=>(
            <div key={h}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:C.textMid, marginBottom:18 }}>{h}</div>
              {links.map(l=>(
                <div key={l} style={{ fontSize:14, color:'#4B5563', marginBottom:11, cursor:'pointer' }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:13, color:'#374151' }}>© 2026 LawRadar · General information only, not legal advice</p>
          <div style={{ display:'flex', gap:24 }}>
            {['Twitter','LinkedIn','GitHub'].map(n=>(
              <span key={n} style={{ fontSize:13, color:'#4B5563', cursor:'pointer' }}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
