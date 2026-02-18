import { NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../lib/supabase';

export async function POST(request) {
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.HEALTH_EXPORT_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Log the raw data so we can see the format
    const supabase = getServiceSupabase();
    await supabase.from('guestbook').insert({
      name: 'DEBUG',
      message: JSON.stringify(body).slice(0, 490),
      approved: false,
    });

    return NextResponse.json({
      success: true,
      debug: true,
      keys: Object.keys(body),
      sample: JSON.stringify(body).slice(0, 300),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}