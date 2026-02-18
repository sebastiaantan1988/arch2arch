'use client';
import { Nav, Footer } from '../../components/ui';

const SAMPLE_WEEKS = [
  {
    week: 'Week 7 — Feb 10-16, 2026', sessions: 6, total: '6h 20min',
    swim: '2.4 km', run: '18 km', bike: '45 km',
    avgSleep: 59, avgReadiness: 62, avgHR: 67, avgHRV: 41,
    summary: 'Solid week with 6 sessions. Longest open water swim of 2026 (2.4km). Running pace improved to 5:12/km avg. Sleep score averaged 59 — still below target. Recovery limited by elevated resting HR.',
    days: [
      { day: 'Mon', emoji: '🏊', label: 'Pool swim 45min' },
      { day: 'Tue', emoji: '🏃', label: 'Easy run 60min' },
      { day: 'Wed', emoji: '💪', label: 'Strength 50min' },
      { day: 'Thu', emoji: '😴', label: 'Rest day' },
      { day: 'Fri', emoji: '🏃', label: 'Tempo run 75min' },
      { day: 'Sat', emoji: '🚴', label: 'Long ride 90min' },
      { day: 'Sun', emoji: '🏊', label: 'Open water 60min' },
    ],
  },
  {
    week: 'Week 6 — Feb 3-9, 2026', sessions: 5, total: '5h 15min',
    swim: '1.8 km', run: '15 km', bike: '30 km',
    avgSleep: 56, avgReadiness: 58, avgHR: 68, avgHRV: 38,
    summary: 'Recovery week with reduced volume. Focused on technique in the pool and easy aerobic running. Sleep quality dipped mid-week. No shin splint symptoms — prevention protocol working.',
    days: [
      { day: 'Mon', emoji: '🏊', label: 'Pool swim 40min' },
      { day: 'Tue', emoji: '🏃', label: 'Easy run 50min' },
      { day: 'Wed', emoji: '😴', label: 'Rest day' },
      { day: 'Thu', emoji: '💪', label: 'Strength 45min' },
      { day: 'Fri', emoji: '🏃', label: 'Easy run 55min' },
      { day: 'Sat', emoji: '🚴', label: 'Bike 45min' },
      { day: 'Sun', emoji: '😴', label: 'Rest day' },
    ],
  },
];

export default function Training() {
  return (
    <>
      <Nav current="/training" />
      <div style={{ paddingTop: 72 }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 4, fontWeight: 700, marginBottom: 12 }}>TRAINING LOG</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 900, color: '#fff', margin: 0 }}>
            Weekly Summaries
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Auto-generated from Apple Watch & Oura Ring</p>
        </div>

        <div style={{ background: '#f8fafc', padding: '32px 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {SAMPLE_WEEKS.map((w, idx) => (
              <div key={idx} style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{w.week}</h3>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 0 20px' }}>{w.summary}</p>

                  <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                    {w.days.map((d, i) => (
                      <div key={i} style={{
                        flex: 1, minWidth: 70, textAlign: 'center', padding: '10px 4px',
                        background: d.emoji === '😴' ? '#f8fafc' : 'rgba(245,158,11,0.04)',
                        borderRadius: 10, border: '1px solid #f1f5f9',
                      }}>
                        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{d.day}</div>
                        <div style={{ fontSize: 22, margin: '4px 0' }}>{d.emoji}</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>{d.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
                    <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: 8 }}>
                      <span style={{ color: '#94a3b8' }}>Total </span><span style={{ fontWeight: 700 }}>{w.total}</span>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: 8 }}>
                      <span style={{ color: '#94a3b8' }}>🏊 </span><span style={{ fontWeight: 700, color: '#3b82f6' }}>{w.swim}</span>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: 8 }}>
                      <span style={{ color: '#94a3b8' }}>🏃 </span><span style={{ fontWeight: 700, color: '#ef4444' }}>{w.run}</span>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: 8 }}>
                      <span style={{ color: '#94a3b8' }}>🚴 </span><span style={{ fontWeight: 700, color: '#22c55e' }}>{w.bike}</span>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: 8 }}>
                      <span style={{ color: '#94a3b8' }}>Sleep </span><span style={{ fontWeight: 700, color: w.avgSleep < 60 ? '#ef4444' : '#22c55e' }}>{w.avgSleep}/100</span>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: 8 }}>
                      <span style={{ color: '#94a3b8' }}>HRV </span><span style={{ fontWeight: 700 }}>{w.avgHRV} ms</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
