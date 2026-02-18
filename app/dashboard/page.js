'use client';
import { useState, useEffect } from 'react';
import { Nav, Footer, StatCard, CountdownRing, ProgressBar } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { MOCK } from '../../lib/data';

const EMOJI_MAP = { swim: '🏊', swimming: '🏊', run: '🏃', running: '🏃', bike: '🚴', cycling: '🚴', strength: '💪', functionalstrengthtraining: '💪', yoga: '🧘', rest: '😴', rowing: '🚣', walking: '🚶', traditionalstrengthtraining: '💪' };

function getStatus(value, good, ok) {
  if (value >= good) return 'good';
  if (value >= ok) return 'watch';
  return 'attention';
}

export default function Dashboard() {
  const [today, setToday] = useState(null);
  const [sparklines, setSparklines] = useState(null);
  const [totals, setTotals] = useState(null);
  const [weekWorkouts, setWeekWorkouts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get last 7 days for sparklines
        const sevenAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
        const { data: recent } = await supabase
          .from('daily_metrics')
          .select('date, sleep_score, readiness_score, resting_hr, hrv_sdnn, resilience_level, vo2max, spo2_avg, breathing_disturbance_index')
          .gte('date', sevenAgo)
          .order('date', { ascending: true });

        if (recent && recent.length > 0) {
          const latest = recent[recent.length - 1];
          setToday(latest);
          setSparklines({
            sleep: recent.map(r => r.sleep_score).filter(Boolean),
            readiness: recent.map(r => r.readiness_score).filter(Boolean),
            hr: recent.map(r => r.resting_hr).filter(Boolean),
            hrv: recent.map(r => r.hrv_sdnn).filter(Boolean),
          });
        }

        // Get training totals
        const { data: totalsData } = await supabase
          .from('training_totals')
          .select('*')
          .order('date', { ascending: false })
          .limit(1);

        if (totalsData && totalsData.length > 0) {
          setTotals(totalsData[0]);
        }

        // Get this week's workouts
        const now = new Date();
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        const { data: workouts } = await supabase
          .from('workouts')
          .select('*')
          .gte('date', monday.toISOString().slice(0, 10))
          .order('date', { ascending: true });

        if (workouts) {
          setWeekWorkouts(workouts);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Use real data or fall back to mock
  const d = today || MOCK.today;
  const sp = sparklines || MOCK.sparklines;
  const t = totals || MOCK.totals;

  // Calculate readiness score
  const vo2 = d.vo2max || 40.7;
  const vo2Pct = Math.min(100, Math.round((vo2 / 50) * 100));
  const sleepPct = Math.min(100, d.sleep_score || 50);
  const hrvPct = Math.min(100, Math.round(((d.hrv_sdnn || 39) / 60) * 100));
  const hrPct = Math.min(100, Math.round((1 - Math.max(0, (d.resting_hr || 67) - 55) / 20) * 100));
  const tKm = (parseFloat(t.run_km || 0) + parseFloat(t.swim_km || 0) + parseFloat(t.bike_km || 0));
  const trainPct = Math.min(100, Math.round((tKm / 6500) * 100));
  const injuryPct = 90;
  const overall = Math.round(vo2Pct * 0.20 + trainPct * 0.20 + sleepPct * 0.15 + hrvPct * 0.15 + hrPct * 0.10 + injuryPct * 0.10 + trainPct * 0.10);

  const readinessComponents = [
    { label: `VO2max (${vo2} → 50)`, pct: vo2Pct, color: '#3b82f6' },
    { label: 'Training Volume vs Plan', pct: trainPct, color: '#22c55e' },
    { label: 'Sleep Quality', pct: sleepPct, color: '#a78bfa' },
    { label: `Recovery HRV (${d.hrv_sdnn || '?'} → 60)`, pct: hrvPct, color: '#06b6d4' },
    { label: `Resting HR (${d.resting_hr || '?'} → 55)`, pct: hrPct, color: '#ef4444' },
    { label: 'Injury Status', pct: injuryPct, color: '#4ade80' },
  ];

  // Format week workouts
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDisplay = weekWorkouts && weekWorkouts.length > 0
    ? (() => {
        const byDay = {};
        weekWorkouts.forEach(w => {
          const dayIdx = (new Date(w.date).getDay() + 6) % 7;
          if (!byDay[dayIdx]) byDay[dayIdx] = [];
          byDay[dayIdx].push(w);
        });
        return dayNames.map((name, i) => {
          const sessions = byDay[i];
          if (!sessions || sessions.length === 0) return { day: name, activity: 'rest', duration_min: 0, emoji: '😴' };
          const main = sessions[0];
          const act = (main.activity || 'other').toLowerCase();
          return {
            day: name,
            activity: act,
            duration_min: Math.round(sessions.reduce((sum, s) => sum + parseFloat(s.duration_min || 0), 0)),
            emoji: EMOJI_MAP[act] || '🏋️',
          };
        });
      })()
    : MOCK.weeklyTraining;

  const weekTotal = weekDisplay.reduce((sum, w) => sum + (w.duration_min || 0), 0);
  const weekSessions = weekDisplay.filter(w => w.activity !== 'rest').length;

  return (
    <>
      <Nav current="/dashboard" />

      {/* Today's Status */}
      <div style={{ paddingTop: 72, background: '#f8fafc', padding: '96px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                {loading ? 'Loading...' : today ? "Today's Status" : "Today's Status (demo data)"}
              </h2>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
                {today ? today.date : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{
              background: (d.resilience_level || 'Limited') === 'Limited' ? 'rgba(251,191,36,0.15)' : 'rgba(74,222,128,0.15)',
              padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              color: (d.resilience_level || 'Limited') === 'Limited' ? '#d97706' : '#16a34a',
            }}>
              Resilience: {d.resilience_level || 'Limited'}
            </div>
          </div>
          <div className="stat-grid" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <StatCard label="Sleep Score" value={d.sleep_score || '—'} unit="/100" spark={sp.sleep} sparkColor="#a78bfa" status={getStatus(d.sleep_score || 0, 75, 60)} />
            <StatCard label="Readiness" value={d.readiness_score || '—'} unit="/100" spark={sp.readiness} sparkColor="#f59e0b" status={getStatus(d.readiness_score || 0, 75, 60)} />
            <StatCard label="Resting HR" value={d.resting_hr || '—'} unit="bpm" spark={sp.hr} sparkColor="#ef4444" status={d.resting_hr && d.resting_hr < 60 ? 'good' : d.resting_hr && d.resting_hr < 68 ? 'watch' : 'attention'} />
            <StatCard label="HRV" value={d.hrv_sdnn || '—'} unit="ms" spark={sp.hrv} sparkColor="#3b82f6" status={getStatus(d.hrv_sdnn || 0, 60, 40)} />
          </div>
        </div>
      </div>

      {/* This Week */}
      <div style={{ background: '#fff', padding: '32px 24px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 24px' }}>This Week</h2>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {weekDisplay.map((w, i) => (
              <div key={i} style={{
                flex: 1, minWidth: 80, textAlign: 'center', padding: '16px 8px',
                background: w.activity === 'rest' ? '#f8fafc' : 'rgba(245,158,11,0.04)',
                borderRadius: 12, border: '1px solid #f1f5f9',
              }}>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 8 }}>{w.day}</div>
                <div style={{ fontSize: 28 }}>{w.emoji}</div>
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
            <div><span style={{ color: '#94a3b8', fontSize: 12 }}>Total </span><span style={{ fontWeight: 700 }}>{Math.floor(weekTotal / 60)}h {weekTotal % 60}min</span></div>
            <div><span style={{ color: '#94a3b8', fontSize: 12 }}>Sessions </span><span style={{ fontWeight: 700 }}>{weekSessions}</span></div>
          </div>
        </div>
      </div>

      {/* Race Readiness */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 3, fontWeight: 700 }}>RACE READINESS</div>
            <div style={{ fontSize: 72, fontWeight: 800, color: '#fff', margin: '8px 0' }}>
              {overall}<span style={{ fontSize: 28, color: 'rgba(255,255,255,0.3)' }}>/100</span>
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Base Building Phase</div>
          </div>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            {readinessComponents.map((c, i) => (
              <ProgressBar key={i} label={c.label} pct={c.pct} color={c.color} />
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
            <CountdownRing label="Running" current={Math.round(parseFloat(t.run_km || 0))} target={3000} unit="km" color="#ef4444" icon="🏃" />
            <CountdownRing label="Swimming" current={Math.round(parseFloat(t.swim_km || 0))} target={1000} unit="km" color="#3b82f6" icon="🏊" />
            <CountdownRing label="Cycling" current={Math.round(parseFloat(t.bike_km || 0))} target={2500} unit="km" color="#22c55e" icon="🚴" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
