import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function POST(request: NextRequest) {
  const cookie = request.headers.get('cookie') ?? '';

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { cookie },
      cache: 'no-store',
    });
  } catch {
    // Local cookies are still removed if the API is temporarily unavailable.
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('access_token', '', { httpOnly: true, expires: new Date(0), path: '/', sameSite: 'lax' });
  response.cookies.set('refresh_token', '', { httpOnly: true, expires: new Date(0), path: '/', sameSite: 'lax' });
  return response;
}
