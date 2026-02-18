import { NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../lib/supabase';

// This endpoint receives data from the Health Auto Export iOS app
// Configure the app to POST to: https://yourdomain.com/api/health-export
// Set the API key header: x-api-key: YOUR_HEALTH_EXPORT_API_KEY

export async function POST(request) {
  // Verify API key
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.HEALTH_EXPORT_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Health Auto Export sends data in this format:
    // { data: { metrics: [...], workouts: [...] } }
    const metrics = body?.data?.metrics || body?.metrics || [];
    const workouts = body?.data?.workouts || body?.workouts || [];

    let metricsUpdated = 0;
    let workoutsInserted = 0;

    // Process health metrics
    const dailyData = {};
    for (const metric of metrics) {
      const name = metric.name || metric.type;
      const date = (metric.date || metric.dateString || '').slice(0, 10);
      if (!date) continue;

      if (!dailyData[date]) dailyData[date] = {};

      const val = metric.qty || metric.value || metric.avg;
      if (val === undefined || val === null) continue;

      // Map Health Auto Export metric names to our columns
      const mapping = {
        'resting_heart_rate': 'resting_hr',
        'restingHeartRate': 'resting_hr',
        'heart_rate_variability': 'hrv_sdnn',
        'heartRateVariability': 'hrv_sdnn',
        'vo2_max': 'vo2max',
        'vo2Max': 'vo2max',
        'step_count': 'steps',
        'stepCount': 'steps',
        'active_energy': 'active_energy_kcal',
        'activeEnergy': 'active_energy_kcal',
        'apple_exercise_time': 'exercise_time_min',
        'appleExerciseTime': 'exercise_time_min',
        'body_mass': 'body_weight_kg',
        'bodyMass': 'body_weight_kg',
        'weight': 'body_weight_kg',
      };

      const col = mapping[name];
      if (col) {
        dailyData[date][col] = typeof val === 'number' ? Math.round(val * 10) / 10 : parseFloat(val);
      }
    }

    // Upsert daily metrics
    for (const [date, data] of Object.entries(dailyData)) {
      await supabase.from('daily_metrics').upsert({
        date,
        ...data,
        apple_synced: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'date' });
      metricsUpdated++;
    }

    // Process workouts
    for (const w of workouts) {
      const date = (w.start || w.date || '').slice(0, 10);
      if (!date) continue;

      const workout = {
        date,
        start_time: w.start || null,
        activity: (w.name || w.workoutActivityType || 'Other').toLowerCase().replace('hkworkoutactivitytype', ''),
        duration_min: w.duration ? Math.round(w.duration / 60 * 10) / 10 : null,
        distance_km: w.totalDistance ? Math.round(w.totalDistance / 1000 * 100) / 100 : null,
        energy_kcal: w.totalEnergyBurned ? Math.round(w.totalEnergyBurned) : null,
        avg_hr: w.avgHeartRate ? Math.round(w.avgHeartRate) : null,
        max_hr: w.maxHeartRate ? Math.round(w.maxHeartRate) : null,
        source: 'apple_watch',
      };

      await supabase.from('workouts').insert(workout);
      workoutsInserted++;

      // Update cumulative distances
      if (workout.distance_km && workout.distance_km > 0) {
        const sport = categorizeWorkout(workout.activity);
        if (sport) {
          await updateTrainingTotals(supabase, date, sport, workout.distance_km);
        }
      }
    }

    return NextResponse.json({
      success: true,
      metricsUpdated,
      workoutsInserted,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function categorizeWorkout(activity) {
  const a = activity.toLowerCase();
  if (a.includes('run') || a.includes('walking')) return 'run_km';
  if (a.includes('swim')) return 'swim_km';
  if (a.includes('cycl') || a.includes('bik')) return 'bike_km';
  return null;
}

async function updateTrainingTotals(supabase, date, sport, km) {
  const { data: existing } = await supabase
    .from('training_totals')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single();

  const totals = existing || { run_km: 0, swim_km: 0, bike_km: 0 };
  totals[sport] = parseFloat(totals[sport] || 0) + km;
  totals.total_km = parseFloat(totals.run_km || 0) + parseFloat(totals.swim_km || 0) + parseFloat(totals.bike_km || 0);

  await supabase.from('training_totals').upsert({
    date,
    run_km: totals.run_km,
    swim_km: totals.swim_km,
    bike_km: totals.bike_km,
    total_km: totals.total_km,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'date' });
}
