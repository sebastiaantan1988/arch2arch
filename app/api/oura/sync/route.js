import { NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../../lib/supabase';

async function getValidToken(supabase) {
  const { data: tokenRow } = await supabase.from('oura_tokens').select('*').limit(1).single();
  if (!tokenRow) throw new Error('No Oura token found. Visit /api/oura to connect.');

  // Check if token expired
  if (new Date(tokenRow.expires_at) < new Date()) {
    // Refresh the token
    const res = await fetch('https://api.ouraring.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenRow.refresh_token,
        client_id: process.env.OURA_CLIENT_ID,
        client_secret: process.env.OURA_CLIENT_SECRET,
      }),
    });
    const tokens = await res.json();
    if (!tokens.access_token) throw new Error('Token refresh failed');

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
    await supabase.from('oura_tokens').update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    }).eq('id', tokenRow.id);

    return tokens.access_token;
  }

  return tokenRow.access_token;
}

async function fetchOura(token, endpoint, params = {}) {
  const url = new URL(`https://api.ouraring.com/v2/usercollection/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7');

  try {
    const supabase = getServiceSupabase();
    const token = await getValidToken(supabase);

    const endDate = new Date().toISOString().slice(0, 10);
    const startDate = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const params = { start_date: startDate, end_date: endDate };

    // Fetch all data types in parallel
    const [sleepRes, readinessRes, stressRes, spo2Res, heartRateRes] = await Promise.all([
      fetchOura(token, 'daily_sleep', params),
      fetchOura(token, 'daily_readiness', params),
      fetchOura(token, 'daily_stress', params),
      fetchOura(token, 'daily_spo2', params),
      fetchOura(token, 'heartrate', { ...params, start_datetime: `${startDate}T00:00:00+00:00`, end_datetime: `${endDate}T23:59:59+00:00` }),
    ]);

    // Process and upsert daily metrics
    const sleepByDay = {};
    (sleepRes.data || []).forEach(s => {
      sleepByDay[s.day] = {
        sleep_score: s.score,
        sleep_deep: s.contributors?.deep_sleep,
        sleep_efficiency: s.contributors?.efficiency,
        sleep_latency: s.contributors?.latency,
        sleep_rem: s.contributors?.rem_sleep,
        sleep_restfulness: s.contributors?.restfulness,
        sleep_timing: s.contributors?.timing,
        sleep_total: s.contributors?.total_sleep,
      };
    });

    const readinessByDay = {};
    (readinessRes.data || []).forEach(r => {
      readinessByDay[r.day] = {
        readiness_score: r.score,
        readiness_hrv_balance: r.contributors?.hrv_balance,
        readiness_resting_hr: r.contributors?.resting_heart_rate,
        readiness_recovery_index: r.contributors?.recovery_index,
        readiness_sleep_balance: r.contributors?.sleep_balance,
        readiness_prev_night: r.contributors?.previous_night,
        temperature_deviation: r.temperature_deviation,
      };
    });

    const spo2ByDay = {};
    (spo2Res.data || []).forEach(s => {
      spo2ByDay[s.day] = {
        spo2_avg: s.spo2_percentage?.average,
        breathing_disturbance_index: s.breathing_disturbance_index,
      };
    });

    // Aggregate heart rate to daily resting HR
    const hrByDay = {};
    (heartRateRes.data || []).forEach(h => {
      const day = h.timestamp?.slice(0, 10);
      if (!day) return;
      if (!hrByDay[day]) hrByDay[day] = [];
      hrByDay[day].push(h.bpm);
    });

    // Combine and upsert
    const allDays = new Set([...Object.keys(sleepByDay), ...Object.keys(readinessByDay)]);
    let synced = 0;

    for (const day of allDays) {
      const hrValues = hrByDay[day] || [];
      const avgHR = hrValues.length > 0 ? Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length * 10) / 10 : null;

      const row = {
        date: day,
        ...sleepByDay[day],
        ...readinessByDay[day],
        ...spo2ByDay[day],
        resting_hr: avgHR,
        oura_synced: true,
        updated_at: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(row).forEach(k => row[k] === undefined && delete row[k]);

      await supabase.from('daily_metrics').upsert(row, { onConflict: 'date' });
      synced++;
    }

    return NextResponse.json({
      success: true,
      synced,
      range: { startDate, endDate },
      counts: {
        sleep: sleepRes.data?.length || 0,
        readiness: readinessRes.data?.length || 0,
        spo2: spo2Res.data?.length || 0,
        heartrate_points: heartRateRes.data?.length || 0,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
