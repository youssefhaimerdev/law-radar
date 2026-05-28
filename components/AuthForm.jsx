'use client'
import { useState } from 'react'
import { C } from '@/lib/constants'

export default function AuthForm({ onSuccess }) {
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState('')

  const submit = () => {
    if (!email || !pass)      { setErr('Please fill in both fields.'); return }
    if (pass.length < 6)      { setErr('Password must be at least 6 characters.'); return }
    setErr(''); setLoading(true)
    // TODO: replace with real Supabase signUp/signIn call from @/lib/supabase
    setTimeout(() => { setLoading(false); onSuccess({ email, name: email.split('@')[0] }) }, 1400)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg0, display: 'flex', fontFamily: "var(--font-dm-sans), sans-serif" }}>
      {/* Left testimonial panel */}
      <div style={{ flex: 1, background: C.bg1, borderRight: `1px solid ${C.border}`, padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: C.gold, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>⚖️</div>
          <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, fontWeight: 700 }}>LandlordShield</span>
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 30, fontWeight: 700, marginBottom: 24, lineHeight: 1.25, fontStyle: 'italic', color: C.textMid }}>
            "I got fined $4,200 because I didn't know California changed the deposit rules. LandlordShield would have caught it instantly."
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.amberBg, border: `1px solid ${C.amberBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.gold }}>MR</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Marcus R.</div>
              <div style={{ fontSize: 12, color: C.textMid }}>7-unit landlord · Sacramento, CA</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['50 States', 'Real-Time Alerts', 'Plain English', 'AI-Powered'].map(t => (
            <div key={t} style={{ padding: '8px 16px', background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 8, fontSize: 13, color: C.gold, fontWeight: 500 }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Right sign-up form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 30, fontWeight: 700, marginBottom: 8, color: C.text }}>Create your account</h1>
          <p style={{ color: C.textMid, fontSize: 15, marginBottom: 36 }}>Start monitoring for free. No credit card needed.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: 'Email address', val: email, set: setEmail, type: 'email',    ph: 'you@example.com' },
              { label: 'Password',      val: pass,  set: setPass,  type: 'password', ph: 'Min. 6 characters' },
            ].map(({ label, val, set, type, ph }) => (
              <div key={label}>
                <label style={{ fontSize: 13, fontWeight: 500, color: C.textMid, display: 'block', marginBottom: 7 }}>{label}</label>
                <input type={type} value={val} onChange={e => set(e.target.value)}
                  placeholder={ph} onKeyDown={e => e.key === 'Enter' && submit()}
                  style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: '13px 16px', fontSize: 15, color: C.text }}
                />
              </div>
            ))}

            {err && (
              <div style={{ fontSize: 13, color: C.red, background: C.redBg, border: `1px solid ${C.redBorder}`, borderRadius: 8, padding: '10px 14px' }}>{err}</div>
            )}

            <button onClick={submit} disabled={loading}
              style={{ background: loading ? C.goldDark : C.gold, color: '#000', border: 'none', borderRadius: 11, padding: '15px', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 4, transition: 'background 0.2s' }}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: C.textMid }}>
            Already have an account? <span style={{ color: C.gold, cursor: 'pointer' }}>Sign in</span>
          </p>
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
