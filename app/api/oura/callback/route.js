import { NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../../lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://api.ouraring.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.OURA_CLIENT_ID,
        client_secret: process.env.OURA_CLIENT_SECRET,
        redirect_uri: process.env.OURA_REDIRECT_URI,
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      return NextResponse.json({ error: 'Failed to get tokens', details: tokens }, { status: 400 });
    }

    // Store tokens in Supabase
    const supabase = getServiceSupabase();
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // Upsert — always keep only one row
    await supabase.from('oura_tokens').delete().neq('id', 0); // clear all
    await supabase.from('oura_tokens').insert({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
    });

    // Redirect to dashboard with success message
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${siteUrl}/dashboard?oura=connected`);
  } catch (err) {
    return NextResponse.json({ error: 'Token exchange failed', details: err.message }, { status: 500 });
  }
}
