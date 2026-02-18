import { supabase } from './supabase';

// Get today's metrics
export async function getTodayMetrics() {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('date', today)
    .single();
  return data;
}

// Get last N days of metrics for sparklines
export async function getRecentMetrics(days = 7) {
  const from = new Date();
  from.setDate(from.getDate() - days);
  const { data } = await supabase
    .from('daily_metrics')
    .select('date, sleep_score, readiness_score, resting_hr, hrv_sdnn, vo2max, resilience_level')
    .gte('date', from.toISOString().slice(0, 10))
    .order('date', { ascending: true });
  return data || [];
}

// Get this week's workouts
export async function getThisWeekWorkouts() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const { data } = await supabase
    .from('workouts')
    .select('*')
    .gte('date', monday.toISOString().slice(0, 10))
    .order('date', { ascending: true });
  return data || [];
}

// Get cumulative training totals
export async function getTrainingTotals() {
  const { data } = await supabase
    .from('training_totals')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single();
  return data || { run_km: 0, swim_km: 0, bike_km: 0 };
}

// Get weekly summaries
export async function getWeeklySummaries(limit = 12) {
  const { data } = await supabase
    .from('weekly_summaries')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(limit);
  return data || [];
}

// Get published blog posts
export async function getBlogPosts(limit = 10) {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return data || [];
}

// Get approved guestbook messages
export async function getGuestbookMessages(limit = 50) {
  const { data } = await supabase
    .from('guestbook')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

// Submit guestbook message
export async function submitGuestbookMessage(name, message) {
  const { data, error } = await supabase
    .from('guestbook')
    .insert({ name, message, approved: false });
  return { data, error };
}

// Get monthly metrics for charts
export async function getMonthlyMetrics(months = 12) {
  const from = new Date();
  from.setMonth(from.getMonth() - months);
  const { data } = await supabase
    .from('daily_metrics')
    .select('date, sleep_score, readiness_score, resting_hr, hrv_sdnn, vo2max')
    .gte('date', from.toISOString().slice(0, 10))
    .order('date', { ascending: true });
  return data || [];
}

// Calculate race readiness score
export function calculateReadiness(metrics, totals) {
  if (!metrics) return { overall: 0, components: {} };

  const vo2Pct = Math.min(100, Math.round(((metrics.vo2max || 40) / 50) * 100));
  const sleepPct = Math.min(100, Math.round((metrics.sleep_score || 50)));
  const hrvTarget = 60;
  const hrvPct = Math.min(100, Math.round(((metrics.hrv_sdnn || 39) / hrvTarget) * 100));
  const hrTarget = 55;
  const hrPct = Math.min(100, Math.round((1 - Math.max(0, (metrics.resting_hr || 67) - hrTarget) / 20) * 100));
  const injuryPct = 90; // manual for now
  const trainingPct = totals
    ? Math.min(100, Math.round(((totals.run_km + totals.swim_km + totals.bike_km) / 6500) * 100))
    : 0;

  const overall = Math.round(
    vo2Pct * 0.20 + trainingPct * 0.20 + sleepPct * 0.15 +
    hrvPct * 0.15 + hrPct * 0.10 + injuryPct * 0.10 + trainingPct * 0.10
  );

  return {
    overall,
    components: {
      vo2max: { pct: vo2Pct, label: `VO2max (${metrics.vo2max || '?'} → 50)` },
      training: { pct: trainingPct, label: 'Training Volume vs Plan' },
      sleep: { pct: sleepPct, label: 'Sleep Quality' },
      recovery: { pct: hrvPct, label: `Recovery HRV (${metrics.hrv_sdnn || '?'} → 60)` },
      restingHR: { pct: hrPct, label: `Resting HR (${metrics.resting_hr || '?'} → 55)` },
      injury: { pct: injuryPct, label: 'Injury Status' },
    }
  };
}

// Days until a target date
export function daysUntil(dateStr) {
  const target = new Date(dateStr + 'T06:00:00');
  const now = new Date();
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
}

// Fallback mock data when DB is empty
export const MOCK = {
  today: { sleep_score: 54, readiness_score: 56, resilience_level: 'Limited', resting_hr: 67, hrv_sdnn: 39 },
  sparklines: {
    sleep: [48, 52, 61, 55, 49, 58, 54],
    readiness: [62, 58, 71, 65, 52, 60, 56],
    hr: [65, 68, 64, 70, 66, 69, 67],
    hrv: [42, 38, 51, 45, 35, 44, 39],
  },
  weeklyTraining: [
    { day: 'Mon', activity: 'swim', duration_min: 45, emoji: '🏊' },
    { day: 'Tue', activity: 'run', duration_min: 60, emoji: '🏃' },
    { day: 'Wed', activity: 'strength', duration_min: 50, emoji: '💪' },
    { day: 'Thu', activity: 'rest', duration_min: 0, emoji: '😴' },
    { day: 'Fri', activity: 'run', duration_min: 75, emoji: '🏃' },
    { day: 'Sat', activity: 'bike', duration_min: 90, emoji: '🚴' },
    { day: 'Sun', activity: 'swim', duration_min: 60, emoji: '🏊' },
  ],
  totals: { run_km: 487, swim_km: 124, bike_km: 310 },
  readiness: {
    overall: 58,
    components: {
      vo2max: { pct: 68, label: 'VO2max (40.7 → 50)' },
      training: { pct: 52, label: 'Training Volume vs Plan' },
      sleep: { pct: 38, label: 'Sleep Quality' },
      recovery: { pct: 45, label: 'Recovery HRV (39 → 60)' },
      restingHR: { pct: 55, label: 'Resting HR (67 → 55)' },
      injury: { pct: 90, label: 'Injury Status' },
    }
  }
};
