import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.OURA_CLIENT_ID;
  const redirectUri = process.env.OURA_REDIRECT_URI;
  const scopes = 'personal daily heartrate workout session spo2';

  const url = `https://cloud.ouraring.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=arch2arch`;

  return NextResponse.redirect(url);
}
