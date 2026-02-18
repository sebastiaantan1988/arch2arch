import { NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../lib/supabase';

export async function POST(request) {
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.HEALTH_EXPORT_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getServiceSupabase();
    const metrics = body?.data?.metrics || [];
    const workouts = body?.data?.workouts || [];

    const mapping = {
      'resting_heart_rate': 'resting_hr',
      'heart_rate_variability': 'hrv_sdnn',
      'vo2_max': 'vo2max',
      'step_count': 'steps',
      'active_energy': 'active_energy_kcal',
      'apple_exercise_time': 'exercise_time_min',
      'body_mass': 'body_weight_kg',
      'weight': 'body_weight_kg',
    };

    const dailyData = {};

    for (const metric of metrics) {
      const col = mapping[metric.name];
      if (!col) continue;

      for (const point of (metric.data || [])) {
        const date = (point.date || '').slice(0, 10);
        if (!date) continue;
        if (!dailyData[date]) dailyData[date] = {};
        dailyData[date][col] = Math.round(parseFloat(point.qty) * 10) / 10;
      }
    }

    let metricsUpdated = 0;
    for (const [date, data] of Object.entries(dailyData)) {
      await supabase.from('daily_metrics').upsert({
        date,
        ...data,
        apple_synced: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'date' });
      metricsUpdated++;
    }

    let workoutsInserted = 0;
    for (const w of workouts) {
      const date = (w.start || w.date || '').slice(0, 10);
      if (!date) continue;

      const activity = (w.name || w.workoutActivityType || 'other')
        .toLowerCase()
        .replace('hkworkoutactivitytype', '');

      const workout = {
        date,
        start_time: w.start || null,
        activity,
        duration_min: w.duration ? Math.round(w.duration / 60 * 10) / 10 : null,
        distance_km: w.totalDistance ? Math.round(w.totalDistance / 1000 * 100) / 100 : null,
        energy_kcal: w.totalEnergyBurned ? Math.round(w.totalEnergyBurned) : null,
        avg_hr: w.avgHeartRate ? Math.round(w.avgHeartRate) : null,
        max_hr: w.maxHeartRate ? Math.round(w.maxHeartRate) : null,
        source: 'apple_watch',
      };

      await supabase.from('workouts').insert(workout);
      workoutsInserted++;

      if (workout.distance_km && workout.distance_km > 0) {
        const sport = activity.includes('run') || activity.includes('walk') ? 'run_km'
          : activity.includes('swim') ? 'swim_km'
          : activity.includes('cycl') || activity.includes('bik') ? 'bike_km'
          : null;

        if (sport) {
          const { data: existing } = await supabase
            .from('training_totals')
            .select('*')
            .order('date', { ascending: false })
            .limit(1);

          const prev = existing && existing[0] ? existing[0] : { run_km: 0, swim_km: 0, bike_km: 0 };
          const totals = { run_km: parseFloat(prev.run_km || 0), swim_km: parseFloat(prev.swim_km || 0), bike_km: parseFloat(prev.bike_km || 0) };
          totals[sport] += workout.distance_km;
          totals.total_km = totals.run_km + totals.swim_km + totals.bike_km;

          await supabase.from('training_totals').upsert({
            date,
            ...totals,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'date' });
        }
      }
    }

    return NextResponse.json({
      success: true,
      metricsUpdated,
      workoutsInserted,
      metricsReceived: metrics.map(m => m.name),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}