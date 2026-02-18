'use client';
import { Nav, Footer } from '../../components/ui';

export default function Challenge() {
  return (
    <>
      <Nav current="/challenge" />
      <div style={{ paddingTop: 72 }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 4, fontWeight: 700, marginBottom: 16 }}>THE CHALLENGE</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 24px' }}>
              What is Arch2Arch?
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 48px' }}>
              The Arch2Arch is an ultra-triathlon from London to Paris. You start by running 140km through London,
              then swim across the English Channel (~34km), and finish with a 300km bike ride into Paris. The Channel
              crossing is weather-dependent — my window is August or September 2027.
            </p>

            {/* Route */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, padding: '32px 0', flexWrap: 'wrap' }}>
              {[
                { city: 'LONDON', emoji: '🏃', distance: '140 km RUN', color: '#ef4444' },
                null,
                { city: 'DOVER → CALAIS', emoji: '🏊', distance: '34 km SWIM', color: '#3b82f6' },
                null,
                { city: 'PARIS', emoji: '🚴', distance: '300 km BIKE', color: '#22c55e' },
              ].map((item, i) => item ? (
                <div key={i} style={{ textAlign: 'center', padding: '0 20px' }}>
                  <div style={{ fontSize: 40 }}>{item.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginTop: 8, letterSpacing: 2 }}>{item.city}</div>
                  <div style={{ fontSize: 13, color: item.color, fontWeight: 700, marginTop: 4 }}>{item.distance}</div>
                </div>
              ) : (
                <div key={i} style={{ width: 60, height: 2, background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)', margin: '0 8px' }} />
              ))}
            </div>

            {/* Facts */}
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
              {[
                { label: 'Total Distance', value: '474 km' },
                { label: 'Estimated Time', value: '3-4 days' },
                { label: 'Race Window', value: 'Aug/Sep 2027' },
                { label: 'Prep Event', value: 'Half A2A Nov 10, 2026' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '16px 24px', minWidth: 140,
                }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Half A2A section */}
            <div style={{ marginTop: 64, padding: '40px 32px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>2026 PREP EVENT</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 12px' }}>
                Half Arch2Arch — Lanzarote
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 24px' }}>
                November 10, 2026. Half the distance of the full Arch2Arch — a critical test of fitness, logistics, and mental
                readiness before the main event.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { emoji: '🏃', val: '70 km', color: '#ef4444' },
                  { emoji: '🏊', val: '17 km', color: '#3b82f6' },
                  { emoji: '🚴', val: '150 km', color: '#22c55e' },
                ].map((l, i) => (
                  <div key={i} style={{ fontSize: 14, fontWeight: 700, color: l.color }}>
                    {l.emoji} {l.val}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
