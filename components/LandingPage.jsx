'use client'
import { useState, useEffect, useRef } from 'react'
import { C, SD, lvl } from '@/lib/constants'
import USMap from '@/components/ui/USMap'

const SERIF = "var(--font-playfair,'Playfair Display',Georgia,serif)"
const SANS  = "var(--font-dm-sans,'DM Sans',-apple-system,sans-serif)"

// ── Swap this URL when you have a real demo video ─────────────
const DEMO_VIDEO_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'

const TICKER = [
  "🔴  URGENT · Washington — Just Cause Eviction Statewide — Deadline May 30",
  "🔴  URGENT · California — AB 414 Security Deposit Reform — June 15",
  "🟡  NEW · Florida — Notice Period Extended 30→45 Days — August 1",
  "🔴  URGENT · New Jersey — Anti-Eviction Act Amendment — July 1",
  "🟡  NEW · Oregon — Rent Control Cap Reduced to 7% — In Effect",
  "🔴  URGENT · Massachusetts — Tenant Protections Act — October 1",
  "🔴  URGENT · Hawaii — STR Permits Required — July 1",
  "✅  CLEAR · Texas — No Changes · Fully Compliant",
  "🟡  NEW · Colorado — Broadband Now Required Utility — September 1",
  "🟡  NEW · Minnesota — Rent Stabilization Extended Through 2027",
]

const TESTIMONIALS = [
  { name:"Marcus R.", role:"7-unit landlord · Sacramento, CA", initials:"MR", color:"#EF4444", text:"I got fined $4,200 because I didn't know California changed the deposit rules. After that nightmare I found LandlordShield. Haven't had a single compliance issue since.", stars:5 },
  { name:"Sandra K.", role:"Property Manager · Portland, OR",   initials:"SK", color:"#8B5CF6", text:"Oregon's rent control laws change every year and keeping up was a full-time job. LandlordShield sends me exactly what changed and what to update. My clients think I'm a genius.", stars:5 },
  { name:"David T.", role:"14-unit landlord · Seattle, WA",     initials:"DT", color:"#0EA5E9", text:"Washington's just cause eviction law caught me completely off guard. LandlordShield alerted me 3 weeks before it took effect. I updated all my leases in time. Could have cost me everything.", stars:5 },
]

const PAIN = [
  { icon:"💸", title:"Average landlord fine: $3,800",    body:"Non-compliance penalties hit small landlords hardest. A single missed deposit rule, improper eviction notice, or outdated lease clause can wipe out months of rental income." },
  { icon:"⚖️", title:"Evictions get thrown out of court", body:"Courts routinely dismiss eviction cases when landlords can't prove they followed the latest procedure. The tenant stays. You pay court costs. You start over." },
  { icon:"📋", title:"Lease clauses become illegal overnight", body:"A clause perfectly legal last year can expose you to tenant lawsuits this year. Laws change constantly. Your lease must change with them — or it becomes a weapon against you." },
]

const FEATURES = [
  { icon:"📡", tag:"Core",      title:"Real-Time Law Monitoring",   body:"Our engine scans all 50 state legislative databases every day. The moment a bill affecting landlords passes — you know before most attorneys do." },
  { icon:"📋", tag:"AI",        title:"Plain-English Summaries",     body:"Every law change translated from dense legal jargon into a 3-sentence explanation. What changed, who it affects, and why it matters. Zero lawyer-speak." },
  { icon:"✅", tag:"Smart",     title:"Exact Action Checklists",     body:"Not just what changed — but which lease clause to update, which form to file, and which deadline to hit. Your to-do list, auto-generated after every change." },
  { icon:"📊", tag:"Dashboard", title:"Compliance Health Score",     body:"A live 0–100 score across all your properties. Green = safe. Amber = act soon. Red = act now. Updated every time a law changes in your states." },
  { icon:"🤖", tag:"AI Chat",   title:"Ask the Law AI",              body:"Ask any landlord law question in plain English. Get an accurate, jurisdiction-specific answer grounded in real legislation. Like a property attorney — for $19/month." },
  { icon:"🔔", tag:"Alerts",    title:"Deadline Reminders",          body:"Email and SMS at 30 days, 7 days, and 24 hours before every compliance deadline. Never find out in the courtroom again." },
]

const FAQ = [
  { q:"Is this actual legal advice?",                          a:"No — LandlordShield provides general legal information, not legal advice. Think of us as a well-informed assistant that tells you when laws change and what they mean in plain English. For specific situations, always consult a qualified attorney." },
  { q:"How fast do I get alerted when a law changes?",         a:"Our engine checks all 50 state databases daily. For urgent bills, we run additional scans. Most landlords receive their alert within 24 hours of a bill being signed into law." },
  { q:"I only own one property in one state. Is it worth it?", a:"Absolutely. The average non-compliance fine is $3,800. Our Pro plan is $19/month. That's 16+ years of protection for the cost of one avoided fine." },
  { q:"How accurate are the AI summaries?",                    a:"Very. We pull directly from official state legislative databases via the LegiScan API, then use Gemini AI to generate plain-English summaries. Every summary links directly to the source legislation so you can verify it yourself." },
  { q:"Can I cancel anytime?",                                 a:"Yes — cancel with a single click from your dashboard. No phone calls, no questions asked. Your access continues until the end of your billing period." },
]

// ── Animated counter ──────────────────────────────────────────
function Counter({ end, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0
      const step = end / 60
      const t = setInterval(() => {
        start += step
        if (start >= end) { setVal(end); clearInterval(t) }
        else setVal(Math.floor(start))
      }, 24)
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ── Stars ─────────────────────────────────────────────────────
function Stars() {
  return <div style={{ display:'flex', gap:2, marginBottom:16 }}>{[1,2,3,4,5].map(i=><span key={i} style={{ color:'#F59E0B', fontSize:15 }}>★</span>)}</div>
}

// ── Video Demo Modal ─────────────────────────────────────────
function VideoModal({ onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={onClose}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(10px)' }} />
      <div style={{ position:'relative', width:'100%', maxWidth:900, zIndex:1 }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute', top:-48, right:0, background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:38, height:38, borderRadius:'50%', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        <div style={{ background:'#0D1425', border:`1px solid rgba(255,255,255,0.1)`, borderRadius:20, overflow:'hidden', boxShadow:'0 40px 120px rgba(0,0,0,0.9)' }}>
          {/* Video header */}
          <div style={{ padding:'18px 24px', borderBottom:`1px solid rgba(255,255,255,0.07)`, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, background:C.gold, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🛡️</div>
            <span style={{ fontFamily:SERIF, fontSize:16, fontWeight:700 }}>LandlordShield — Product Demo</span>
            <span style={{ marginLeft:'auto', fontSize:12, color:C.textMid }}>2 min walkthrough</span>
          </div>
          {/* 16:9 video embed */}
          <div style={{ position:'relative', paddingBottom:'56.25%', height:0, background:'#070C18' }}>
            <iframe
              src={DEMO_VIDEO_URL}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }}
            />
          </div>
          {/* Below video */}
          <div style={{ padding:'20px 24px', display:'flex', gap:32, justifyContent:'center', borderTop:`1px solid rgba(255,255,255,0.07)` }}>
            {['📡 50 States Monitored','⚡ Alerts in Under 24hrs','🤖 AI Plain-English Summaries'].map(t=>(
              <span key={t} style={{ fontSize:13, color:C.textMid }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── City skyline SVG (decorative hero backdrop) ───────────────
function CitySkyline() {
  return (
    <svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
      style={{ position:'absolute', bottom:0, left:0, right:0, width:'100%', opacity:0.07, pointerEvents:'none' }}>
      {/* Buildings */}
      <rect x="0"    y="120" width="60"  height="100" fill="white"/>
      <rect x="10"   y="90"  width="40"  height="30"  fill="white"/>
      <rect x="25"   y="75"  width="10"  height="15"  fill="white"/>
      <rect x="70"   y="80"  width="80"  height="140" fill="white"/>
      <rect x="85"   y="60"  width="50"  height="20"  fill="white"/>
      <rect x="105"  y="45"  width="10"  height="20"  fill="white"/>
      <rect x="160"  y="130" width="50"  height="90"  fill="white"/>
      <rect x="170"  y="110" width="30"  height="25"  fill="white"/>
      <rect x="220"  y="100" width="70"  height="120" fill="white"/>
      <rect x="235"  y="70"  width="40"  height="30"  fill="white"/>
      <rect x="300"  y="140" width="40"  height="80"  fill="white"/>
      {/* House 1 */}
      <polygon points="360,90 400,60 440,90" fill="white"/>
      <rect x="360" y="90" width="80" height="130" fill="white"/>
      <rect x="385" y="110" width="20" height="25" fill="#0D1425"/>
      {/* More buildings */}
      <rect x="450"  y="95"  width="90"  height="125" fill="white"/>
      <rect x="460"  y="70"  width="70"  height="30"  fill="white"/>
      <rect x="490"  y="50"  width="10"  height="25"  fill="white"/>
      <rect x="550"  y="130" width="55"  height="90"  fill="white"/>
      <rect x="560"  y="105" width="35"  height="25"  fill="white"/>
      {/* House 2 */}
      <polygon points="620,100 660,68 700,100" fill="white"/>
      <rect x="620" y="100" width="80" height="120" fill="white"/>
      <rect x="645" y="120" width="18" height="22" fill="#0D1425"/>
      {/* Tall buildings */}
      <rect x="710"  y="60"  width="75"  height="160" fill="white"/>
      <rect x="720"  y="40"  width="55"  height="25"  fill="white"/>
      <rect x="742"  y="20"  width="11"  height="25"  fill="white"/>
      <rect x="795"  y="110" width="50"  height="110" fill="white"/>
      <rect x="805"  y="90"  width="30"  height="25"  fill="white"/>
      <rect x="855"  y="85"  width="85"  height="135" fill="white"/>
      <rect x="870"  y="60"  width="55"  height="30"  fill="white"/>
      <rect x="893"  y="40"  width="10"  height="25"  fill="white"/>
      {/* House 3 */}
      <polygon points="950,105 990,72 1030,105" fill="white"/>
      <rect x="950" y="105" width="80" height="115" fill="white"/>
      <rect x="976" y="126" width="18" height="20" fill="#0D1425"/>
      {/* More tall buildings */}
      <rect x="1040" y="75"  width="70"  height="145" fill="white"/>
      <rect x="1050" y="50"  width="50"  height="30"  fill="white"/>
      <rect x="1070" y="30"  width="10"  height="25"  fill="white"/>
      <rect x="1120" y="120" width="60"  height="100" fill="white"/>
      <rect x="1130" y="95"  width="40"  height="30"  fill="white"/>
      <rect x="1190" y="90"  width="80"  height="130" fill="white"/>
      <rect x="1205" y="65"  width="50"  height="30"  fill="white"/>
      <rect x="1225" y="45"  width="10"  height="25"  fill="white"/>
      <rect x="1280" y="130" width="55"  height="90"  fill="white"/>
      <rect x="1345" y="100" width="95"  height="120" fill="white"/>
      <rect x="1360" y="75"  width="65"  height="30"  fill="white"/>
      <rect x="1385" y="55"  width="15"  height="25"  fill="white"/>
      {/* Ground */}
      <rect x="0" y="218" width="1440" height="4" fill="white"/>
    </svg>
  )
}

// ── Product Preview Card (hero right side) ────────────────────
function ProductPreview() {
  const alerts = [
    { abbr:'WA', state:'Washington', law:'HB 2057 — Just Cause Eviction', deadline:'May 30', level:'high' },
    { abbr:'CA', state:'California', law:'AB 414 — Deposit Reform',        deadline:'Jun 15', level:'high' },
    { abbr:'OR', state:'Oregon',     law:'SB 611 — Rent Cap Reduced',      deadline:'Jun 1',  level:'high' },
    { abbr:'FL', state:'Florida',    law:'SB 892 — Notice Extended',       deadline:'Aug 1',  level:'medium' },
    { abbr:'TX', state:'Texas',      law:'No recent changes',              deadline:null,     level:'low' },
  ]
  const score = 62
  const circ  = 2 * Math.PI * 32
  const offset = circ - (score / 100) * circ

  return (
    <div style={{
      background:'rgba(13,20,37,0.9)',
      border:'1px solid rgba(245,158,11,0.2)',
      borderRadius:20, padding:24,
      backdropFilter:'blur(20px)',
      boxShadow:'0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,158,11,0.08)',
      width:340, flexShrink:0,
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:24, height:24, background:C.gold, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>🛡️</div>
          <span style={{ fontSize:13, fontWeight:600 }}>LandlordShield</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#10B981', animation:'pulse 2s infinite' }} />
          <span style={{ fontSize:11, color:'#10B981', fontWeight:600 }}>LIVE</span>
        </div>
      </div>

      {/* Score + summary row */}
      <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:16 }}>
        <div style={{ position:'relative', width:74, height:74, flexShrink:0 }}>
          <svg width={74} height={74} style={{ transform:'rotate(-90deg)' }}>
            <circle cx={37} cy={37} r={32} fill="none" stroke="#1C2536" strokeWidth={8} />
            <circle cx={37} cy={37} r={32} fill="none" stroke="#F59E0B" strokeWidth={8}
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition:'stroke-dashoffset 1.5s ease' }} />
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:18, fontWeight:700, color:C.text }}>{score}</span>
            <span style={{ fontSize:9, color:C.gold, fontWeight:600 }}>/ 100</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Compliance Score</div>
          <div style={{ fontSize:11, color:C.gold, marginBottom:8 }}>⚠ 3 urgent items need action</div>
          <div style={{ fontSize:11, color:C.textMid }}>5 states · 10 changes tracked</div>
        </div>
      </div>

      {/* Alert list */}
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {alerts.map(a => {
          const isH = a.level==='high', isMed = a.level==='medium'
          const dotColor = isH ? '#EF4444' : isMed ? '#F59E0B' : '#10B981'
          const bg       = isH ? 'rgba(239,68,68,0.08)' : isMed ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.02)'
          const border   = isH ? 'rgba(239,68,68,0.2)'  : isMed ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.05)'
          return (
            <div key={a.abbr} style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:'9px 12px', display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:dotColor, flexShrink:0, animation: isH ? 'pulse 1.8s infinite' : 'none' }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:600, color:C.text }}>{a.state}</div>
                <div style={{ fontSize:10, color:C.textMid, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.law}</div>
              </div>
              {a.deadline && (
                <span style={{ fontSize:9, color: isH ? '#FCA5A5' : '#FCD34D', background: isH ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.12)', padding:'2px 7px', borderRadius:100, fontWeight:700, flexShrink:0 }}>{a.deadline}</span>
              )}
              {!a.deadline && <span style={{ fontSize:9, color:'#10B981', background:'rgba(16,185,129,0.12)', padding:'2px 7px', borderRadius:100, fontWeight:700 }}>✓ Clear</span>}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop:14, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.06)', fontSize:10, color:C.textMid, textAlign:'center' }}>
        Updated moments ago · Powered by LegiScan + Gemini AI
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// ════════════════════════════════════════════════════════════════
export default function LandingPage({ onStart }) {
  const [mapHovered, setMapHovered] = useState(null)
  const [openFaq,    setOpenFaq]    = useState(null)
  const [showVideo,  setShowVideo]  = useState(false)
  const totalAlerts = Object.values(SD).reduce((s,v) => s+v.c, 0)
  const highStates  = Object.values(SD).filter(v => v.v==='high').length

  return (
    <div style={{ background:C.bg0, color:C.text, fontFamily:SANS, overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes goldGlow  { 0%,100%{box-shadow:0 0 28px rgba(245,158,11,.25)} 50%{box-shadow:0 0 56px rgba(245,158,11,.55)} }
        @keyframes ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes breathe   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.015)} }
        @keyframes shimmer   { 0%,100%{opacity:.3} 50%{opacity:.7} }
        .ticker-track  { display:inline-flex; gap:72px; animation:ticker 45s linear infinite; white-space:nowrap; }
        .ticker-track:hover { animation-play-state:paused; }
        .nav-link:hover  { color:#F1F5F9 !important; }
        .hero-cta:hover  { transform:translateY(-2px) !important; box-shadow:0 12px 40px rgba(245,158,11,.4) !important; }
        .ghost-btn:hover { border-color:rgba(255,255,255,.35) !important; color:#fff !important; }
        .pain-card:hover { transform:translateY(-5px) !important; border-color:rgba(245,158,11,.2) !important; }
        .feat-row:hover  { background:rgba(245,158,11,.04) !important; border-color:rgba(245,158,11,.15) !important; }
        .test-card:hover { transform:translateY(-5px) !important; border-color:rgba(245,158,11,.2) !important; }
        .price-card:hover{ transform:translateY(-6px) !important; }
        .step-card:hover { transform:translateY(-3px) !important; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#1E2D40;border-radius:4px}
      `}</style>

      {showVideo && <VideoModal onClose={()=>setShowVideo(false)} />}

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <nav style={{ position:'sticky', top:0, zIndex:300, background:'rgba(7,12,24,0.94)', backdropFilter:'blur(20px)', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 56px', height:68 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, background:C.gold, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🛡️</div>
          <span style={{ fontFamily:SERIF, fontSize:21, fontWeight:700, letterSpacing:'-0.02em' }}>LandlordShield</span>
        </div>
        <div style={{ display:'flex', gap:36, alignItems:'center' }}>
          {['Features','How It Works','Pricing','Blog'].map(n=>(
            <span key={n} className="nav-link" style={{ color:C.textMid, fontSize:14, cursor:'pointer', transition:'color .15s' }}>{n}</span>
          ))}
          <button onClick={onStart} style={{ background:C.gold, color:'#000', border:'none', borderRadius:9, padding:'10px 24px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
            Start Free →
          </button>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', padding:'100px 56px 0', background:'linear-gradient(175deg,#070C18 0%,#0D1425 60%,#101B2E 100%)' }}>
        {/* Background grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,0.022) 1px,transparent 1px)', backgroundSize:'38px 38px', zIndex:0 }} />
        {/* Glow orbs */}
        <div style={{ position:'absolute', top:'5%',  right:'30%', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 60%)', zIndex:0, animation:'breathe 8s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'20%', left:'0%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(239,68,68,0.05) 0%,transparent 65%)', zIndex:0 }} />
        {/* City skyline */}
        <CitySkyline />

        {/* Left: Copy */}
        <div style={{ maxWidth:580, position:'relative', zIndex:1, paddingBottom:120 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'7px 18px', marginBottom:32, animation:'slideUp .6s ease both' }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:C.gold, animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:13, color:C.gold, fontWeight:500 }}>Live · {totalAlerts} active law changes across all 50 states</span>
          </div>

          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(44px,5.2vw,72px)', fontWeight:700, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:26, animation:'slideUp .65s .1s ease both' }}>
            The Law Just<br />Changed.<br />
            <em style={{ color:C.gold, fontStyle:'italic' }}>Did You Know?</em>
          </h1>

          <p style={{ fontSize:20, color:C.textMid, lineHeight:1.76, marginBottom:16, maxWidth:520, animation:'slideUp .65s .2s ease both' }}>
            LandlordShield watches every state legislature 24/7 and sends you a plain-English alert — with the exact clause to update — the moment a rental law changes.
          </p>
          <p style={{ fontSize:15, color:'#6B7280', lineHeight:1.72, marginBottom:44, maxWidth:500, animation:'slideUp .65s .28s ease both' }}>
            No lawyers. No newsletters. No Googling. Just one email that tells you what changed, what you owe your tenants, and exactly what to fix.
          </p>

          <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:28, animation:'slideUp .65s .36s ease both' }}>
            <button className="hero-cta" onClick={onStart} style={{ background:C.gold, color:'#000', border:'none', borderRadius:12, padding:'17px 44px', fontSize:18, fontWeight:800, cursor:'pointer', animation:'goldGlow 3s ease infinite', transition:'all .2s' }}>
              Start Monitoring Free
            </button>
            <button className="ghost-btn" onClick={()=>setShowVideo(true)} style={{ background:'transparent', color:C.textMid, border:`1px solid rgba(255,255,255,0.14)`, borderRadius:12, padding:'17px 30px', fontSize:18, cursor:'pointer', transition:'all .2s', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>▶</span>
              Watch Demo
            </button>
          </div>

          <div style={{ display:'flex', gap:6, flexWrap:'wrap', animation:'slideUp .65s .44s ease both' }}>
            {['✓ Free forever plan','✓ No credit card','✓ All 50 states','✓ Cancel anytime'].map(t=>(
              <span key={t} style={{ fontSize:13, color:'#6B7280' }}>{t}&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>

        {/* Right: Live product preview */}
        <div style={{ position:'absolute', right:56, top:'50%', transform:'translateY(-50%)', zIndex:1, animation:'slideUp .8s .3s ease both', paddingBottom:120 }}>
          <ProductPreview />
        </div>
      </div>

      {/* ══ TICKER ════════════════════════════════════════════ */}
      <div style={{ background:'#070C18', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'13px 0', overflow:'hidden' }}>
        <div style={{ overflow:'hidden', whiteSpace:'nowrap' }}>
          <div className="ticker-track">
            {[...TICKER,...TICKER].map((item,i)=>(
              <span key={i} style={{ fontSize:13, color:C.textMid }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ STATS ═════════════════════════════════════════════ */}
      <div style={{ background:C.bg1, borderBottom:`1px solid ${C.border}`, padding:'56px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
          {[
            { end:12000, suffix:'+', label:'Landlords Protected',   color:C.gold },
            { end:50,    suffix:'',  label:'States Monitored',      color:C.gold },
            { end:47,    suffix:'M+',label:'In Fines Prevented',    color:'#10B981', prefix:'$' },
            { end:24,    suffix:'h', label:'Max Alert Delivery',    color:C.gold, prefix:'<' },
          ].map(({ end, suffix, label, color, prefix='' })=>(
            <div key={label} style={{ textAlign:'center', padding:'28px 16px', background:C.card, border:`1px solid ${C.border}`, borderRadius:18, transition:'transform .2s' }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ fontFamily:SERIF, fontSize:50, fontWeight:700, color, lineHeight:1, marginBottom:10 }}>
                {prefix}<Counter end={end} suffix={suffix} />
              </div>
              <div style={{ fontSize:14, color:C.textMid }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PAIN ══════════════════════════════════════════════ */}
      <div style={{ padding:'110px 56px', background:C.bg0 }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:18 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:C.red, background:C.redBg, border:`1px solid ${C.redBorder}`, borderRadius:100, padding:'5px 14px' }}>The Hidden Danger</span>
          </div>
          <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, textAlign:'center', marginBottom:20, lineHeight:1.12 }}>
            Most Landlords Find Out<br /><em style={{ color:C.red, fontStyle:'italic' }}>Too Late</em>
          </h2>
          <p style={{ color:C.textMid, fontSize:18, textAlign:'center', maxWidth:560, margin:'0 auto 64px', lineHeight:1.75 }}>
            Rental laws change constantly — and the penalties don't care whether you knew or not.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24, marginBottom:48 }}>
            {PAIN.map(({ icon, title, body })=>(
              <div key={title} className="pain-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:22, padding:40, transition:'all .2s' }}>
                <div style={{ fontSize:48, marginBottom:22 }}>{icon}</div>
                <h3 style={{ fontFamily:SERIF, fontSize:22, fontWeight:700, marginBottom:14, lineHeight:1.3 }}>{title}</h3>
                <p style={{ fontSize:15, color:C.textMid, lineHeight:1.82 }}>{body}</p>
              </div>
            ))}
          </div>
          {/* Real quote */}
          <div style={{ background:'linear-gradient(135deg,rgba(239,68,68,0.07) 0%,rgba(245,158,11,0.05) 100%)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:22, padding:'40px 52px', display:'flex', gap:28, alignItems:'flex-start' }}>
            <div style={{ fontSize:56, lineHeight:1, color:C.gold, fontFamily:SERIF, flexShrink:0, marginTop:-8 }}>"</div>
            <div>
              <p style={{ fontSize:18, color:C.text, lineHeight:1.82, marginBottom:24, fontStyle:'italic' }}>I lost an eviction case I should have won — and had to pay the tenant's attorney fees — because my notice period was 30 days when California had quietly changed it to 45. Nobody told me. I found out in the courtroom.</p>
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

      {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
      <div style={{ background:C.bg1, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:68 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>How It Works</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22, marginBottom:16 }}>Set Up in 3 Minutes.<br />Protected Forever.</h2>
            <p style={{ color:C.textMid, fontSize:18, maxWidth:460, margin:'0 auto' }}>No technical knowledge required. Just your state and property type.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {[
              { n:'01', icon:'🏠', title:'Register Your Properties', body:'Pick your states and property types. Takes 2 minutes. Zero technical setup required.' },
              { n:'02', icon:'📡', title:'We Watch Everything',       body:'Our engine scans all 50 state legislatures daily. Every landlord-relevant bill tracked automatically.' },
              { n:'03', icon:'📬', title:'You Get Instant Alerts',    body:"Plain-English email: what changed, what you need to do, and by when. No jargon, no guesswork." },
            ].map(({ n, icon, title, body })=>(
              <div key={n} className="step-card" style={{ textAlign:'center', padding:'40px 36px', background:C.card, border:`1px solid ${C.border}`, borderRadius:22, transition:'all .2s', position:'relative' }}>
                <div style={{ width:80, height:80, borderRadius:22, background:C.amberBg, border:`1px solid ${C.amberBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 22px' }}>
                  {icon}
                  <div style={{ position:'absolute', top:18, left:'calc(50% + 24px)', width:28, height:28, borderRadius:'50%', background:C.gold, color:'#000', fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{n}</div>
                </div>
                <h3 style={{ fontFamily:SERIF, fontSize:21, fontWeight:700, marginBottom:12 }}>{title}</h3>
                <p style={{ fontSize:15, color:C.textMid, lineHeight:1.77 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAP ═══════════════════════════════════════════════ */}
      <div style={{ padding:'110px 56px', background:C.bg0 }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>Live Map</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22, marginBottom:16 }}>See Your Legal Exposure<br />Across Every State</h2>
            <p style={{ color:C.textMid, fontSize:18 }}>Hover over any state. Red means you need to act now.</p>
          </div>
          <div style={{ display:'flex', gap:24, justifyContent:'center', marginBottom:32, flexWrap:'wrap' }}>
            {[{c:'#EF4444',label:'Urgent — Act Now'},{c:'#F59E0B',label:'Changes Detected'},{c:'#1A2840',label:'Compliant'}].map(({c,label})=>(
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:c }} />
                <span style={{ fontSize:13, color:C.textMid }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:'28px 28px 16px', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
            <USMap hovered={mapHovered} onHover={setMapHovered} />
          </div>
          <p style={{ textAlign:'center', fontSize:13, color:'#4B5563', marginTop:14 }}>Updated daily via LegiScan API · Plain-English summaries by Gemini AI</p>
        </div>
      </div>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <div style={{ background:C.bg1, borderTop:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:68 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>Features</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22, marginBottom:16 }}>Your Legal Co-Pilot.<br />Always On.</h2>
            <p style={{ color:C.textMid, fontSize:18, maxWidth:480, margin:'0 auto' }}>Everything a landlord needs to stay compliant — in one place.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {FEATURES.map(({ icon, tag, title, body })=>(
              <div key={title} className="feat-row" style={{ display:'flex', gap:22, padding:28, borderRadius:20, border:`1px solid ${C.border}`, background:C.card, transition:'all .2s' }}>
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

      {/* ══ TESTIMONIALS ══════════════════════════════════════ */}
      <div style={{ background:C.bg0, borderTop:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:68 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>Real Landlords</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22 }}>They Stopped Getting Surprised.<br />So Can You.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
            {TESTIMONIALS.map(({ name, role, initials, color, text })=>(
              <div key={name} className="test-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:22, padding:36, transition:'all .2s', display:'flex', flexDirection:'column' }}>
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
            {['🔒 SSL Encrypted','🏦 Stripe Payments','⚡ 99.9% Uptime','🔁 Cancel Anytime','🇺🇸 US-Based'].map(t=>(
              <div key={t} style={{ fontSize:13, color:C.textMid, background:C.card, border:`1px solid ${C.border}`, borderRadius:100, padding:'9px 20px' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ PRICING ═══════════════════════════════════════════ */}
      <div style={{ background:C.bg1, borderTop:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:1020, margin:'0 auto', textAlign:'center' }}>
          <span style={{ fontSize:11, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>Pricing</span>
          <h2 style={{ fontFamily:SERIF, fontSize:'clamp(34px,4.5vw,58px)', fontWeight:700, marginTop:22, marginBottom:16 }}>Less Than One Coffee.<br />Potentially Worth Thousands.</h2>
          <p style={{ color:C.textMid, fontSize:18, maxWidth:500, margin:'0 auto 60px' }}>The average landlord fine is $3,800. Our Pro plan is $19/month. Do the math.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr 1fr', gap:20, alignItems:'start' }}>
            <div className="price-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:40, textAlign:'left', transition:'all .2s' }}>
              <div style={{ fontSize:11, color:C.textMid, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Free</div>
              <div style={{ fontFamily:SERIF, fontSize:56, fontWeight:700, lineHeight:1, marginBottom:8 }}>$0</div>
              <div style={{ color:C.textMid, fontSize:14, marginBottom:36, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>Forever free. No card needed.</div>
              {['1 state monitored','Monthly law digest','Basic alert emails','Community support'].map(f=>(
                <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:C.textMid, marginBottom:13 }}><span style={{ color:C.green }}>✓</span>{f}</div>
              ))}
              <button onClick={onStart} style={{ width:'100%', marginTop:28, background:'transparent', color:C.text, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px', fontSize:15, fontWeight:500, cursor:'pointer' }}>Get Started</button>
            </div>
            <div className="price-card" style={{ background:'linear-gradient(160deg,rgba(245,158,11,0.1) 0%,rgba(245,158,11,0.03) 100%)', border:'2px solid rgba(245,158,11,0.4)', borderRadius:24, padding:40, textAlign:'left', transition:'all .2s', position:'relative' }}>
              <div style={{ position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', background:C.gold, color:'#000', fontSize:11, fontWeight:800, padding:'6px 20px', borderRadius:100, letterSpacing:'.07em', textTransform:'uppercase', whiteSpace:'nowrap' }}>Most Popular</div>
              <div style={{ fontSize:11, color:C.gold, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Pro</div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:8, lineHeight:1 }}>
                <span style={{ fontFamily:SERIF, fontSize:56, fontWeight:700 }}>$19</span>
                <span style={{ color:C.textMid, fontSize:16, paddingBottom:8 }}>/month</span>
              </div>
              <div style={{ color:C.textMid, fontSize:14, marginBottom:36, paddingBottom:24, borderBottom:'1px solid rgba(245,158,11,0.2)' }}>14-day free trial · Cancel anytime</div>
              {['All 50 states monitored','Real-time law alerts','AI plain-English summaries','Compliance health score','Lease clause generator','Deadline reminders','Ask the Law AI — unlimited','Priority support'].map(f=>(
                <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, marginBottom:13 }}><span style={{ color:C.gold }}>✓</span>{f}</div>
              ))}
              <button onClick={onStart} style={{ width:'100%', marginTop:28, background:C.gold, color:'#000', border:'none', borderRadius:12, padding:'16px', fontSize:16, fontWeight:800, cursor:'pointer' }}>Start 14-Day Free Trial →</button>
            </div>
            <div className="price-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:40, textAlign:'left', transition:'all .2s' }}>
              <div style={{ fontSize:11, color:C.textMid, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Team</div>
              <div style={{ fontFamily:SERIF, fontSize:56, fontWeight:700, lineHeight:1, marginBottom:8 }}>$49</div>
              <div style={{ color:C.textMid, fontSize:14, marginBottom:36, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>Property managers &amp; attorneys</div>
              {['Everything in Pro','Unlimited properties','White-label PDF reports','Client portal','API access','Dedicated account manager'].map(f=>(
                <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:C.textMid, marginBottom:13 }}><span style={{ color:C.green }}>✓</span>{f}</div>
              ))}
              <button onClick={onStart} style={{ width:'100%', marginTop:28, background:'transparent', color:C.text, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px', fontSize:15, fontWeight:500, cursor:'pointer' }}>Contact Us</button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FAQ ═══════════════════════════════════════════════ */}
      <div style={{ background:C.bg0, borderTop:`1px solid ${C.border}`, padding:'110px 56px' }}>
        <div style={{ maxWidth:740, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:C.gold, background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:100, padding:'5px 14px' }}>FAQ</span>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(28px,4vw,44px)', fontWeight:700, marginTop:22 }}>Common Questions</h2>
          </div>
          {FAQ.map(({ q, a }, i)=>(
            <div key={q} style={{ borderBottom:`1px solid ${C.border}` }}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:'100%', background:'transparent', border:'none', padding:'22px 4px', textAlign:'left', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', gap:20 }}>
                <span style={{ fontSize:16, fontWeight:600, color:C.text }}>{q}</span>
                <span style={{ fontSize:22, color:C.gold, flexShrink:0, display:'inline-block', transform:openFaq===i?'rotate(45deg)':'rotate(0)', transition:'transform .2s' }}>+</span>
              </button>
              {openFaq===i && <div style={{ padding:'0 4px 22px', fontSize:15, color:C.textMid, lineHeight:1.78 }}>{a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ══ FINAL CTA ═════════════════════════════════════════ */}
      <div style={{ background:'linear-gradient(135deg,#0D1425 0%,#141E34 50%,#0D1425 100%)', borderTop:`1px solid ${C.border}`, padding:'130px 56px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 60%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:680, margin:'0 auto', position:'relative' }}>
          <div style={{ fontSize:64, marginBottom:24 }}>🛡️</div>
          <h2 style={{ fontFamily:SERIF, fontSize:'clamp(38px,5vw,64px)', fontWeight:700, lineHeight:1.1, marginBottom:24 }}>
            Stop Finding Out<br /><em style={{ color:C.gold, fontStyle:'italic' }}>Too Late.</em>
          </h2>
          <p style={{ fontSize:20, color:C.textMid, lineHeight:1.78, maxWidth:520, margin:'0 auto 52px' }}>
            12,847 landlords already get instant alerts when a law affects their property. Join them free — setup takes 3 minutes.
          </p>
          <button className="hero-cta" onClick={onStart} style={{ background:C.gold, color:'#000', border:'none', borderRadius:14, padding:'22px 64px', fontSize:20, fontWeight:800, cursor:'pointer', animation:'goldGlow 3s ease infinite', transition:'all .2s', display:'inline-block' }}>
            Start Monitoring Free →
          </button>
          <p style={{ marginTop:22, fontSize:14, color:'#4B5563' }}>No credit card · Free forever plan · Cancel anytime</p>
        </div>
      </div>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <div style={{ background:C.bg0, borderTop:`1px solid ${C.border}`, padding:'56px 56px 40px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48, marginBottom:48 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <div style={{ width:32, height:32, background:C.gold, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🛡️</div>
              <span style={{ fontFamily:SERIF, fontSize:18, fontWeight:700 }}>LandlordShield</span>
            </div>
            <p style={{ fontSize:14, color:C.textMid, lineHeight:1.75, maxWidth:260 }}>The landlord compliance platform that watches every state legislature so you don't have to.</p>
          </div>
          {[
            { h:'Product', links:['Features','Pricing','Changelog','API'] },
            { h:'Company', links:['About','Blog','Careers','Contact'] },
            { h:'Legal',   links:['Privacy','Terms','Cookies','Disclaimer'] },
          ].map(({ h, links })=>(
            <div key={h}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:C.textMid, marginBottom:18 }}>{h}</div>
              {links.map(l=><div key={l} style={{ fontSize:14, color:'#4B5563', marginBottom:11, cursor:'pointer' }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:13, color:'#374151' }}>© 2026 LandlordShield · General information only, not legal advice</p>
          <div style={{ display:'flex', gap:24 }}>
            {['Twitter','LinkedIn','GitHub'].map(n=><span key={n} style={{ fontSize:13, color:'#4B5563', cursor:'pointer' }}>{n}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
