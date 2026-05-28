import { Resend } from 'resend'

const getResend = () => new Resend(process.env.RESEND_API_KEY)
const FROM    = process.env.RESEND_FROM_EMAIL || 'alerts@landlordshield.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://landlordshield.com'

export async function sendLawAlert({
  to, userName, state, lawTitle, summary, action, deadline, alertLevel,
}) {
  const isHigh     = alertLevel === 'high'
  const levelColor = isHigh ? '#EF4444' : alertLevel === 'medium' ? '#F59E0B' : '#10B981'
  const levelLabel = isHigh ? 'Urgent'  : alertLevel === 'medium' ? 'Attention Required' : 'FYI'
  const prefix     = isHigh ? '[URGENT]' : '[Alert]'
  const deadlineHtml = deadline
    ? `<p style="color:#EF4444;font-weight:700;margin-top:12px">Compliance deadline: ${deadline}</p>`
    : ''

  return getResend().emails.send({
    from:    FROM,
    to,
    subject: `${prefix} New Landlord Law in ${state}: ${lawTitle}`,
    html: `<!DOCTYPE html>
<html>
<body style="background:#070C18;color:#F1F5F9;font-family:sans-serif;padding:40px;max-width:580px;margin:0 auto">

  <div style="display:inline-block;background:#F59E0B;border-radius:10px;padding:8px 12px;font-size:18px;margin-bottom:20px">Law Radar</div>
  <span style="display:inline-block;background:${levelColor}22;border:1px solid ${levelColor}44;color:${levelColor};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:100px;padding:4px 12px;margin-left:12px;vertical-align:middle">${levelLabel}</span>

  <h1 style="font-size:22px;font-weight:700;margin:20px 0 6px">New Law Alert &mdash; ${state}</h1>
  <p style="color:#94A3B8;margin-bottom:28px">Hi ${userName}, a law change in one of your monitored states requires your attention.</p>

  <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:22px;margin-bottom:16px">
    <p style="color:#F59E0B;font-weight:700;font-size:15px;margin-bottom:10px">${lawTitle}</p>
    <p style="color:#94A3B8;line-height:1.7;margin:0">${summary}</p>
    ${deadlineHtml}
  </div>

  <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:10px;padding:16px;margin-bottom:24px">
    <p style="color:#F59E0B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px">Required Action</p>
    <p style="color:#FCD34D;font-size:14px;margin:0">${action}</p>
  </div>

  <a href="${APP_URL}/dashboard"
     style="display:inline-block;background:#F59E0B;color:#000;text-decoration:none;padding:13px 28px;border-radius:9px;font-weight:700;font-size:15px">
    View Full Alert &rarr;
  </a>

  <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:32px 0 16px"/>
  <p style="color:#374151;font-size:12px;margin:0">
    LandlordShield &middot; General information only, not legal advice.
    <a href="${APP_URL}/unsubscribe" style="color:#374151">Unsubscribe</a>
  </p>
</body>
</html>`,
  })
}

export async function sendMonthlyDigest({ to, userName, alerts }) {
  const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const rows  = alerts.map(a => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.06);color:#F1F5F9;font-size:14px">${a.state}</td>
      <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.06);color:#94A3B8;font-size:13px">${a.title}</td>
      <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="background:${a.alertLevel === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.12)'};
          color:${a.alertLevel === 'high' ? '#FCA5A5' : '#FCD34D'};
          font-size:11px;font-weight:700;text-transform:uppercase;padding:3px 9px;border-radius:100px">
          ${a.alertLevel}
        </span>
      </td>
    </tr>`).join('')

  return getResend().emails.send({
    from:    FROM,
    to,
    subject: `LandlordShield Monthly Digest &mdash; ${month}`,
    html: `<!DOCTYPE html>
<html>
<body style="background:#070C18;color:#F1F5F9;font-family:sans-serif;padding:40px;max-width:620px;margin:0 auto">
  <h1 style="font-size:22px;margin-bottom:6px">Your Monthly Law Digest</h1>
  <p style="color:#94A3B8;margin-bottom:24px">Hi ${userName}, here are the law changes tracked this month.</p>
  <table style="width:100%;border-collapse:collapse;background:#111827;border-radius:12px;overflow:hidden">
    <thead>
      <tr style="background:#1C2536">
        <th style="padding:12px;text-align:left;color:#94A3B8;font-size:12px;text-transform:uppercase;letter-spacing:0.08em">State</th>
        <th style="padding:12px;text-align:left;color:#94A3B8;font-size:12px;text-transform:uppercase;letter-spacing:0.08em">Law</th>
        <th style="padding:12px;text-align:left;color:#94A3B8;font-size:12px;text-transform:uppercase;letter-spacing:0.08em">Level</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <a href="${APP_URL}/dashboard"
     style="display:inline-block;background:#F59E0B;color:#000;text-decoration:none;padding:13px 28px;border-radius:9px;font-weight:700;font-size:15px;margin-top:24px">
    Open Dashboard &rarr;
  </a>
  <p style="color:#374151;font-size:12px;margin-top:28px">
    Upgrade to Pro for real-time alerts.
    <a href="${APP_URL}/unsubscribe" style="color:#374151">Unsubscribe</a>
  </p>
</body>
</html>`,
  })
}
