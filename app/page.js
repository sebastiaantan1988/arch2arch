'use client';
import { useState, useEffect } from 'react';
import { Nav, Footer, CountdownRing } from '../components/ui';
import { daysUntil, MOCK } from '../lib/data';

export default function Home() {
  const [daysA2A, setDaysA2A] = useState(daysUntil('2027-08-15'));
  const [daysHalf, setDaysHalf] = useState(daysUntil('2026-11-10'));
  const d = MOCK;

  useEffect(() => {
    const t = setInterval(() => {
      setDaysA2A(daysUntil('2027-08-15'));
      setDaysHalf(daysUntil('2026-11-10'));
    }, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Nav current="/" />

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0c1929 100%)',
        paddingTop: 100, paddingBottom: 80, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 13, color: '#f59e0b', letterSpacing: 4, fontWeight: 700, marginBottom: 16 }}>ULTRA-TRIATHLON</div>
            <h1 className="hero-title" style={{
              fontFamily: "'Playfair Display', serif", fontSize: 'clamp(42px, 7vw, 72px)',
              fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: -1,
            }}>
              London <span style={{ color: '#f59e0b' }}>→</span> Channel <span style={{ color: '#f59e0b' }}>→</span> Paris
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>474 km by foot, water & bike</p>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            {[
              { emoji: '🏃', distance: '140 km', label: 'RUN', sub: 'London', color: '#ef4444' },
              { emoji: '🏊', distance: '34 km', label: 'SWIM', sub: 'English Channel', color: '#3b82f6' },
              { emoji: '🚴', distance: '300 km', label: 'BIKE', sub: 'To Paris', color: '#22c55e' },
            ].map((leg, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '24px 32px', textAlign: 'center', minWidth: 160,
              }}>
                <div style={{ fontSize: 36 }}>{leg.emoji}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: leg.color, marginTop: 8 }}>{leg.distance}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: 2, marginTop: 4 }}>{leg.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{leg.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#f59e0b' }}>{daysA2A}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, fontWeight: 600 }}>DAYS TO ARCH2ARCH</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#f59e0b' }}>{daysHalf}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, fontWeight: 600 }}>DAYS TO HALF A2A<br />LANZAROTE</div>
            </div>
          </div>
        </div>
      </div>

      {/* TRAINING RINGS */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 3, fontWeight: 700 }}>TRAINING DISTANCE TARGETS</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Total km until race day</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <CountdownRing label="Running" current={d.totals.run_km} target={3000} unit="km" color="#ef4444" icon="🏃" />
            <CountdownRing label="Swimming" current={d.totals.swim_km} target={1000} unit="km" color="#3b82f6" icon="🏊" />
            <CountdownRing label="Cycling" current={d.totals.bike_km} target={2500} unit="km" color="#22c55e" icon="🚴" />
          </div>
        </div>
      </div>

      {/* BIO */}
      <div style={{ background: '#f8fafc', padding: '64px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 16px' }}>
            The Journey
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.8, margin: '0 0 32px' }}>
            I'm Sebastiaan, a 37-year-old endurance athlete based in Lisbon. In 2027, I'll attempt the Arch2Arch
            ultra-triathlon — running 140km through London, swimming the English Channel, and cycling 300km to
            Paris. This site tracks every step of the preparation in real-time. Follow along, hold me accountable,
            or join the crew.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard" style={{
              background: '#f59e0b', color: '#0f172a', padding: '14px 32px',
              borderRadius: 12, fontSize: 14, fontWeight: 700, display: 'inline-block',
            }}>View Live Dashboard →</a>
            <a href="/team" style={{
              background: 'transparent', color: '#0f172a', border: '2px solid #e2e8f0',
              padding: '14px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700, display: 'inline-block',
            }}>Join the Team</a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
