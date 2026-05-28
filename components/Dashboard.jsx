'use client'
import { useState } from 'react'
import { C, SD, lvl } from '@/lib/constants'
import ScoreRing  from '@/components/ui/ScoreRing'
import AlertCard  from '@/components/ui/AlertCard'
import AskTheLaw  from '@/components/ui/AskTheLaw'
import USMap      from '@/components/ui/USMap'

export default function Dashboard({ user, prefs }) {
  const [tab,        setTab]        = useState('overview')
  const [mapHovered, setMapHovered] = useState(null)

  const states      = prefs?.selStates || ['CA', 'FL', 'NY', 'WA', 'OR']
  const highA       = states.filter(s => SD[s]?.v === 'high')
  const medA        = states.filter(s => SD[s]?.v === 'medium')
  const totalAlerts = states.reduce((s, a) => s + (SD[a]?.c || 0), 0)
  const score       = Math.max(38, 100 - highA.length * 16 - medA.length * 7)
  const alertStates = states.filter(s => SD[s].c > 0).sort((a, b) => SD[b].c - SD[a].c)

  const TABS = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'alerts',   icon: '⚠️', label: `Alerts (${totalAlerts})` },
    { id: 'map',      icon: '🗺️', label: 'Live Map' },
    { id: 'laws',     icon: '📋', label: 'Law Feed' },
    { id: 'ai',       icon: '🤖', label: 'Ask the Law' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg0, color: C.text, fontFamily: "var(--font-dm-sans), sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{ width: 248, background: C.bg1, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', padding: '28px 18px', position: 'sticky', top: 0, height: '100vh', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 32, height: 32, background: C.gold, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚖️</div>
          <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 18, fontWeight: 700 }}>LandlordShield</span>
        </div>

        {/* Score card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 26 }}>
          <ScoreRing score={score} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Compliance Score</div>
            <div style={{ fontSize: 12, marginTop: 4, color: score >= 80 ? C.green : score >= 60 ? C.gold : C.red }}>
              {score >= 80 ? '✓ Good standing' : score >= 60 ? '⚠ Review needed' : '✗ Action required'}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ background: tab === t.id ? C.amberBg : 'transparent', border: `1px solid ${tab === t.id ? C.amberBorder : 'transparent'}`, borderRadius: 9, padding: '10px 14px', color: tab === t.id ? C.gold : C.textMid, fontSize: 14, fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s' }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        {/* Quick stats */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'States',    val: states.length,                         c: C.textMid },
            { label: 'Urgent',    val: highA.length,                          c: highA.length > 0 ? C.red : C.green },
            { label: 'Compliant', val: states.length - highA.length - medA.length, c: C.green },
          ].map(({ label, val, c }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: C.textMid }}>{label}</span>
              <span style={{ fontWeight: 700, color: c }}>{val}</span>
            </div>
          ))}
        </div>

        {/* User */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.amberBg, border: `1px solid ${C.amberBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: C.gold }}>
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: 11, color: C.gold }}>Pro Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Good morning, {user?.name || 'there'} 👋
          </h1>
          <p style={{ color: C.textMid, fontSize: 15 }}>
            Monitoring <strong style={{ color: C.text }}>{states.length} states</strong> ·&nbsp;
            {totalAlerts > 0
              ? <span><strong style={{ color: C.red }}>{totalAlerts} alert{totalAlerts !== 1 ? 's' : ''}</strong> requiring attention</span>
              : <span style={{ color: C.green }}>✓ All properties compliant</span>
            }
          </p>
        </div>

        {/* Stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
          {[
            { label: 'States Monitored', val: states.length,                               color: C.text  },
            { label: 'Urgent Alerts',    val: highA.length,                                color: highA.length > 0 ? C.red  : C.green },
            { label: 'Needs Review',     val: medA.length,                                 color: medA.length  > 0 ? C.gold : C.green },
            { label: 'Fully Compliant',  val: states.length - highA.length - medA.length,  color: C.green },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 700, color, marginBottom: 4, fontFamily: "var(--font-playfair), Georgia, serif" }}>{val}</div>
              <div style={{ fontSize: 12, color: C.textMid }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 28 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, fontWeight: 700, marginBottom: 22 }}>State-by-State Status</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {states.map(a => {
                const d = SD[a]; const l = lvl(d.v)
                return (
                  <div key={a} style={{ background: l.bg, border: `1px solid ${l.border}`, borderRadius: 14, padding: 18, transition: 'transform 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{d.n}</div>
                        <div style={{ fontSize: 11, color: C.textMid, marginTop: 2 }}>{d.c} change{d.c !== 1 ? 's' : ''}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', background: `${l.hex}20`, color: l.hex, padding: '3px 9px', borderRadius: 100 }}>{l.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5 }}>{d.c > 0 ? d.law : 'No recent changes'}</div>
                    {d.d && <div style={{ marginTop: 10, fontSize: 12, color: C.red, fontWeight: 600 }}>⏰ Due: {d.d}</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {tab === 'alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, fontWeight: 700 }}>Active Alerts</h2>
            {alertStates.length === 0
              ? <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
                  <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: C.text }}>All Clear!</div>
                  <div style={{ fontSize: 14, color: C.textMid }}>No active alerts in your monitored states.</div>
                </div>
              : alertStates.map(a => <AlertCard key={a} abbr={a} data={SD[a]} />)
            }
          </div>
        )}

        {/* ── LIVE MAP ── */}
        {tab === 'map' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, fontWeight: 700 }}>Live Law Map — All 50 States</h2>
              <div style={{ display: 'flex', gap: 16 }}>
                {[{ c: '#EF4444', label: 'Urgent' }, { c: '#F59E0B', label: 'Attention' }, { c: '#1A2840', label: 'Clear' }].map(({ c, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMid }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{label}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '20px 20px 12px', overflow: 'hidden' }}>
              <USMap hovered={mapHovered} onHover={setMapHovered} />
            </div>
          </div>
        )}

        {/* ── LAW FEED ── */}
        {tab === 'laws' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, fontWeight: 700 }}>Law Feed — Your States</h2>
              <span style={{ fontSize: 12, color: C.textMid }}>Updated: May 25, 2026</span>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
              {states.map((a, i) => {
                const d = SD[a]; const l = lvl(d.v)
                return (
                  <div key={a} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 22px', borderBottom: i < states.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.15s', cursor: 'default' }}
                    onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: l.bg, border: `1px solid ${l.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: l.hex, flexShrink: 0 }}>{a}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{d.n}</span>
                        <span style={{ fontSize: 12, color: l.hex, fontWeight: 600, flexShrink: 0 }}>{d.c > 0 ? `${d.c} change${d.c > 1 ? 's' : ''}` : 'No changes'}</span>
                      </div>
                      <div style={{ fontSize: 13, color: C.textMid, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.law}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── ASK THE LAW ── */}
        {tab === 'ai' && (
          <div>
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, fontWeight: 700, marginBottom: 5 }}>Ask the Law</h2>
              <p style={{ color: C.textMid, fontSize: 14 }}>Ask any rental law question in plain English — powered by Gemini AI, grounded in real legislation.</p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
              <AskTheLaw states={states} />
            </div>
            <p style={{ fontSize: 12, color: C.textDim, marginTop: 14, textAlign: 'center' }}>
              General legal information only. Always consult a qualified attorney for specific situations.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
