import { NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../lib/supabase';

// GET - fetch approved messages
export async function GET() {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from('guestbook')
    .select('name, message, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50);

  return NextResponse.json({ messages: data || [] });
}

// POST - submit new message (requires approval)
export async function POST(request) {
  try {
    const { name, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    }

    if (name.length > 100 || message.length > 500) {
      return NextResponse.json({ error: 'Name max 100 chars, message max 500 chars' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    await supabase.from('guestbook').insert({
      name: name.trim(),
      message: message.trim(),
      approved: false, // requires manual approval
    });

    return NextResponse.json({ success: true, message: 'Thank you! Your message will appear after approval.' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
