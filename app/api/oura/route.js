import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.OURA_CLIENT_ID;
  const redirectUri = process.env.OURA_REDIRECT_URI;
  const scopes = 'email personal daily heartrate tag workout session spo2 ring_configuration stress heart_health';

  const url = `https://cloud.ouraring.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}`;

  return NextResponse.redirect(url);
}