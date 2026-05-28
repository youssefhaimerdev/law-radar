'use client'
import { useState, useEffect, useRef } from 'react'
import { C, AI_RESPONSES } from '@/lib/constants'

export default function AskTheLaw({ states = [] }) {
  const [msgs,  setMsgs]  = useState([{ r: 'ai', t: "Hello! I'm your LandlordShield AI assistant. Ask me anything about rental laws in your monitored states — plain English, grounded in real legislation." }])
  const [input, setInput] = useState('')
  const [busy,  setBusy]  = useState(false)
  const bottomRef = useRef(null)

  const SUGG = [
    'What are my deposit rules in California?',
    'Can I raise rent this year in Oregon?',
    'Do I need just cause to evict in Washington?',
  ]

  // In production this calls /api/ask-the-law with the user's primary state.
  // For the demo we return mock responses locally.
  const getResponse = async (question) => {
    const q = question.toLowerCase()
    if (q.includes('deposit') && q.includes('california')) return AI_RESPONSES.ca_deposit
    if ((q.includes('rent') || q.includes('raise')) && q.includes('oregon')) return AI_RESPONSES.or_rent
    if ((q.includes('evict') || q.includes('cause')) && q.includes('washington')) return AI_RESPONSES.wa_eviction
    return AI_RESPONSES.default
  }

  const send = async (text) => {
    if (!text.trim() || busy) return
    setMsgs(p => [...p, { r: 'user', t: text }])
    setInput('')
    setBusy(true)

    setTimeout(async () => {
      const resp = await getResponse(text)
      let i = 0
      setMsgs(p => [...p, { r: 'ai', t: '' }])
      const iv = setInterval(() => {
        i += 5
        setMsgs(p => { const u = [...p]; u[u.length - 1] = { r: 'ai', t: resp.slice(0, i) }; return u })
        if (i >= resp.length) { clearInterval(iv); setBusy(false) }
      }, 16)
    }, 500)
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 440 }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.r === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.r === 'ai' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.amberBg, border: `1px solid ${C.amberBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, marginRight: 8, marginTop: 2 }}>⚖️</div>
            )}
            <div style={{ maxWidth: '82%', padding: '11px 15px', borderRadius: 14, fontSize: 13.5, lineHeight: 1.65, background: m.r === 'user' ? C.gold : C.bg3, color: m.r === 'user' ? '#000' : C.text, borderBottomRightRadius: m.r === 'user' ? 4 : 14, borderBottomLeftRadius: m.r === 'ai' ? 4 : 14 }}>
              {m.t}
              {busy && i === msgs.length - 1 && m.r === 'ai' && (
                <span style={{ display: 'inline-block', width: 2, height: 14, background: C.gold, marginLeft: 3, verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {SUGG.map(s => (
          <button key={s} onClick={() => !busy && send(s)}
            style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 100, padding: '5px 11px', fontSize: 12, color: C.textMid, cursor: 'pointer' }}
            onMouseEnter={e => { e.target.style.borderColor = C.gold; e.target.style.color = C.gold }}
            onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.textMid }}
          >{s}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Ask any landlord law question..."
          style={{ flex: 1, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: C.text }} />
        <button onClick={() => send(input)}
          style={{ background: C.gold, color: '#000', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Send</button>
      </div>
    </div>
  )
}
