import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Club M — Communaute de femmes entrepreneures'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #091626 0%, #1a3050 50%, #091626 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#a55b46',
          }}
        />

        {/* Logo text */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.05em',
            marginBottom: 20,
          }}
        >
          Club M
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#a55b46',
            fontWeight: 600,
            marginBottom: 40,
          }}
        >
          Communaute & Marketplace
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: 600,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          La plateforme des femmes entrepreneures de Kinshasa
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#a55b46',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            clubm.cd
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
