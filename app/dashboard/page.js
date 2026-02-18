'use client';
import { Nav, Footer, StatCard, CountdownRing, ProgressBar } from '../../components/ui';
import { MOCK } from '../../lib/data';

const EMOJI_MAP = { swim: '🏊', run: '🏃', bike: '🚴', strength: '💪', yoga: '🧘', rest: '😴', row: '🚣', walk: '🚶' };

export default function Dashboard() {
  const d = MOCK;
  const today = d.today;
  const readiness = d.readiness;

  return (
    <>
      <Nav current="/dashboard" />

      {/* Today's Status */}
      <div style={{ paddingTop: 72, background: '#f8fafc', padding: '96px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Today&apos;s Status</h2>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{
              background: today.resilience_level === 'Limited' ? 'rgba(251,191,36,0.15)' : 'rgba(74,222,128,0.15)',
              padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              color: today.resilience_level === 'Limited' ? '#d97706' : '#16a34a',
            }}>
              Resilience: {today.resilience_level}
            </div>
          </div>
          <div className="stat-grid" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <StatCard label="Sleep Score" value={today.sleep_score} unit="/100" spark={d.sparklines.sleep} sparkColor="#a78bfa" status="attention" />
            <StatCard label="Readiness" value={today.readiness_score} unit="/100" spark={d.sparklines.readiness} sparkColor="#f59e0b" status="watch" />
            <StatCard label="Resting HR" value={today.resting_hr} unit="bpm" spark={d.sparklines.hr} sparkColor="#ef4444" status="watch" />
            <StatCard label="HRV" value={today.hrv_sdnn} unit="ms" spark={d.sparklines.hrv} sparkColor="#3b82f6" status="attention" />
          </div>
        </div>
      </div>

      {/* This Week */}
      <div style={{ background: '#fff', padding: '32px 24px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 24px' }}>This Week</h2>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {d.weeklyTraining.map((w, i) => (
              <div key={i} style={{
                flex: 1, minWidth: 80, textAlign: 'center', padding: '16px 8px',
                background: w.activity === 'rest' ? '#f8fafc' : 'rgba(245,158,11,0.04)',
                borderRadius: 12, border: '1px solid #f1f5f9',
              }}>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 8 }}>{w.day}</div>
                <div style={{ fontSize: 28 }}>{EMOJI_MAP[w.activity] || '🏋️'}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>
                  {w.duration_min > 0 ? `${w.duration_min}m` : 'REST'}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex', gap: 24, marginTop: 20, padding: '16px 20px',
            background: '#f8fafc', borderRadius: 12, flexWrap: 'wrap',
          }}>
            <div><span style={{ color: '#94a3b8', fontSize: 12 }}>Total </span><span style={{ fontWeight: 700 }}>6h 20min</span></div>
            <div><span style={{ color: '#94a3b8', fontSize: 12 }}>Sessions </span><span style={{ fontWeight: 700 }}>6</span></div>
            <div><span style={{ color: '#94a3b8', fontSize: 12 }}>🏊 Swim </span><span style={{ fontWeight: 700, color: '#3b82f6' }}>2.4 km</span></div>
            <div><span style={{ color: '#94a3b8', fontSize: 12 }}>🏃 Run </span><span style={{ fontWeight: 700, color: '#ef4444' }}>18 km</span></div>
            <div><span style={{ color: '#94a3b8', fontSize: 12 }}>🚴 Bike </span><span style={{ fontWeight: 700, color: '#22c55e' }}>45 km</span></div>
          </div>
        </div>
      </div>

      {/* Race Readiness */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 3, fontWeight: 700 }}>RACE READINESS</div>
            <div style={{ fontSize: 72, fontWeight: 800, color: '#fff', margin: '8px 0' }}>
              {readiness.overall}<span style={{ fontSize: 28, color: 'rgba(255,255,255,0.3)' }}>/100</span>
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Base Building Phase</div>
          </div>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            {Object.values(readiness.components).map((c, i) => (
              <ProgressBar key={i} label={c.label} pct={c.pct}
                color={['#3b82f6', '#22c55e', '#a78bfa', '#06b6d4', '#ef4444', '#4ade80'][i]} />
            ))}
          </div>
          <div style={{
            textAlign: 'center', marginTop: 24, padding: '12px 20px',
            background: 'rgba(245,158,11,0.1)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)',
          }}>
            <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600 }}>
              ⚡ Sleep is the #1 limiter — treating OSA could add 15-25 points
            </span>
          </div>
        </div>
      </div>

      {/* Training Countdowns */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 3, fontWeight: 700 }}>TRAINING DISTANCE TARGETS</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <CountdownRing label="Running" current={d.totals.run_km} target={3000} unit="km" color="#ef4444" icon="🏃" />
            <CountdownRing label="Swimming" current={d.totals.swim_km} target={1000} unit="km" color="#3b82f6" icon="🏊" />
            <CountdownRing label="Cycling" current={d.totals.bike_km} target={2500} unit="km" color="#22c55e" icon="🚴" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
