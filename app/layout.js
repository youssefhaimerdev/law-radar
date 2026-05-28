import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dmSans   = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300','400','500','600'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', style: ['normal','italic'], weight: ['500','700'] })

export const metadata = {
  title: 'LandlordShield — Never Get Blindsided By A New Landlord Law',
  description: 'Real-time rental law monitoring across all 50 US states. Plain-English summaries and compliance checklists for landlords — delivered the moment a law changes.',
  keywords: 'landlord law, rental law compliance, tenant law alerts, property management legal',
  icons: {
    icon:  [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.svg' }],
  },
  openGraph: {
    title:       'LandlordShield — Never Get Blindsided By A New Landlord Law',
    description: 'Monitor rental legislation across all 50 states in real-time.',
    type:        'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-sans), -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
